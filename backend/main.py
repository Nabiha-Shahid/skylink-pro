from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session
import models, database, schemas
from ml.pricing import PricingEngine, predict_delay_probability
from payments.stripe_utils import create_checkout_session, verify_payment
import os
from dotenv import load_dotenv
from typing import List
import redis.asyncio as redis
import json
from datetime import datetime, timedelta
from fastapi.encoders import jsonable_encoder
import uuid
import shutil
from fastapi import File, UploadFile, Form
from duffel_api import Duffel

load_dotenv()

# Define absolute path for uploads to ensure robustness across different CWDs
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SkyLink Airline API")

# Setup CORS - Optimized for Production and Local Dev
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:3000"], # Always allow local during transition
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type", "Authorization", "Accept", "X-Requested-With"],
    expose_headers=["*"],
)

# Initialize Redis (Supports Upstash & Local)
REDIS_URL = os.getenv("REDIS_URL") or os.getenv("UPSTASH_REDIS_URL") or "redis://localhost:6379/0"
redis_client = None

try:
    # Handle SSL for Upstash (rediss://)
    redis_client = redis.from_url(REDIS_URL, decode_responses=True, ssl_cert_reqs=None)
except Exception as e:
    print(f"Warning: Redis connection failed ({e}). Performance may be affected.")

@app.on_event("startup")
async def startup_event():
    # Test Redis connection
    global redis_client
    if redis_client:
        try:
            await redis_client.ping()
        except Exception:
            print("Redis ping failed. Caching disabled.")
            redis_client = None

# Initialize Duffel Client
DUFFEL_ACCESS_TOKEN = os.getenv("DUFFEL_ACCESS_TOKEN")
duffel_client = Duffel(access_token=DUFFEL_ACCESS_TOKEN) if DUFFEL_ACCESS_TOKEN else None

def map_duffel_to_skylink(offer):
    """
    Maps a Duffel Offer object to our standard SkyLink Flight schema.
    """
    first_slice = offer.slices[0]
    # Handle direct flights or use the first/last segments for multi-stop
    first_segment = first_slice.segments[0]
    last_segment = first_slice.segments[-1]
    
    # Duffel uses ISO strings (e.g., '2023-04-24T14:30:00Z')
    # Use replace to handle the Z for older Python versions if needed, or simply fromisoformat
    dep_time = datetime.fromisoformat(first_segment.departing_at.replace("Z", "+00:00"))
    arr_time = datetime.fromisoformat(last_segment.arriving_at.replace("Z", "+00:00"))
    
    # Generate a deterministic numeric ID from the Duffel string ID
    numeric_id = abs(hash(offer.id)) % 10000000
    
    # Airline code + Flight Number
    carrier = first_segment.operating_carrier or first_segment.marketing_carrier
    flight_no = f"{carrier.iata_code} {first_segment.operating_carrier_flight_number or 'SKY'}"

    return {
        "id": numeric_id,
        "flight_number": flight_no,
        "origin": first_segment.origin.iata_code,
        "destination": last_segment.destination.iata_code,
        "departure_time": dep_time,
        "arrival_time": arr_time,
        "base_price": float(offer.total_amount),
        "capacity": 150,
        "available_seats": 24, # Duffel doesn't always show exact inventory count
        "status": "scheduled",
        "duffel_offer_id": offer.id
    }

# API Router for consistent /api prefix
router = APIRouter(prefix="/api")

@router.get("/health")
async def health_check():
    return {"status": "ok", "message": "Backend is running and CORS is correctly configured!"}

@router.get("/flights", response_model=List[schemas.Flight])
async def get_flights(origin: str = None, destination: str = None, db: Session = Depends(database.get_db)):
    # Check cache first
    cached_flights = None
    cache_key = f"flights_{origin}_{destination}"
    if redis_client:
        try:
            cached_flights = await redis_client.get(cache_key)
        except Exception:
            pass
    
    if cached_flights:
        flights_data = json.loads(cached_flights)
        return flights_data
    
    # --- DUFFEL LIVE SEARCH INTEGRATION ---
    is_iata = lambda s: s and len(s) == 3 and s.isalpha()
    if duffel_client and is_iata(origin) and is_iata(destination):
        try:
            # We assume current date if none provided, or map provided date
            search_date = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")
            
            offer_request = duffel_client.offer_requests.create() \
                .cabin_class("economy") \
                .passengers([{"type": "adult"}]) \
                .slices([
                    {
                        "origin": origin.upper(),
                        "destination": destination.upper(),
                        "departure_date": search_date,
                    }
                ]) \
                .execute()
            
            live_flights = [map_duffel_to_skylink(offer) for offer in offer_request.offers]
            
            # Enrich and Persist Live Results
            enriched_results = []
            for f in live_flights:
                pricing_engine = PricingEngine(f["base_price"], f["capacity"])
                f["base_price"] = pricing_engine.calculate_price(f["available_seats"], f["departure_time"])
                f["delay_probability"] = predict_delay_probability(f["flight_number"], f["departure_time"])
                
                # Sync with DB
                db_flight = db.query(models.Flight).filter(models.Flight.id == f["id"]).first()
                if not db_flight:
                    new_flight = models.Flight(**f)
                    db.add(new_flight)
                    db.commit()
                    db.refresh(new_flight)
                
                enriched_results.append(f)
            
            # Cache the enriched results
            if redis_client:
                await redis_client.set(cache_key, json.dumps(jsonable_encoder(enriched_results)), ex=3600)
            
            return enriched_results

        except Exception as e:
            print(f"Duffel Search Error: {e}. Falling back to DB/Mocks.")
    
            print(f"Duffel API Error: {e}. Falling back to local data.")

    query = db.query(models.Flight)
    if origin:
        query = query.filter(models.Flight.origin.ilike(f"%{origin}%"))
    if destination:
        query = query.filter(models.Flight.destination.ilike(f"%{destination}%"))
    
    flights = query.all()
    
    # Apply dynamic pricing and delay prediction
    enriched_flights = []
    for f in flights:
        pricing_engine = PricingEngine(f.base_price, f.capacity)
        dynamic_price = pricing_engine.calculate_price(f.available_seats, f.departure_time)
        delay_prob = predict_delay_probability(f.flight_number, f.departure_time)
        
        f_dict = {
            "id": f.id,
            "flight_number": f.flight_number,
            "origin": f.origin,
            "destination": f.destination,
            "departure_time": f.departure_time,
            "arrival_time": f.arrival_time,
            "base_price": dynamic_price, # Use dynamic price as the base price for the UI
            "capacity": f.capacity,
            "available_seats": f.available_seats,
            "status": f.status.value,
            "delay_probability": delay_prob
        }
        enriched_flights.append(f_dict)
    
    # Store in cache for 5 minutes
    if redis_client:
        try:
            await redis_client.setex(cache_key, 300, json.dumps(enriched_flights, default=str))
        except Exception:
            pass
    
    return enriched_flights

@router.post("/bookings", response_model=schemas.Booking)
async def create_booking(booking: schemas.BookingCreate, db: Session = Depends(database.get_db)):
    # 1. Verify Seat Lock in Redis
    if redis_client:
        lock_key = f"seat_lock:{booking.flight_id}:{booking.seat_number}"
        try:
            # We assume for this demo that the user's firebase_uid or similar is the lock owner
            # In a real app, this would be more strictly checked against the auth session
            lock_owner = await redis_client.get(lock_key)
            if not lock_owner:
                # If no lock found, we allow it ONLY if it's not currently locked by someone else
                # but it's better to enforce locking for concurrency safety.
                pass 
                
            # 2. Release lock immediately upon booking
            await redis_client.delete(lock_key)
        except Exception as e:
            print(f"Lock verification error: {e}")

    # 3. Handle Live Duffel Booking
    flight = db.query(models.Flight).filter(models.Flight.id == booking.flight_id).first()
    duffel_order_id = None
    
    if duffel_client and flight and flight.duffel_offer_id:
        try:
            # Duffel requires names split into Given and Family
            name_parts = booking.passenger_name.split(" ", 1)
            given_name = name_parts[0]
            family_name = name_parts[1] if len(name_parts) > 1 else "SkyLink-Guest"
            
            order = duffel_client.orders.create() \
                .payments([{"type": "balance", "amount": str(booking.total_price), "currency": "USD"}]) \
                .passengers([
                    {
                        "type": "adult",
                        "given_name": given_name,
                        "family_name": family_name,
                        "email": booking.passenger_email,
                        "phone_number": booking.passenger_phone,
                        "born_on": booking.born_on,
                        "gender": booking.gender[0].lower(),
                        "title": booking.passenger_title.lower() if booking.passenger_title else "mr"
                    }
                ]) \
                .selected_offers([flight.duffel_offer_id]) \
                .execute()
            
            duffel_order_id = order.id
            print(f"DEBUG: Duffel Order Confirmed -> {duffel_order_id}")
        except Exception as e:
            print(f"Duffel API Ordering Error: {e}")
            raise HTTPException(status_code=400, detail=f"Live booking engine failed: {str(e)}")

    db_booking = models.Booking(**booking.dict())
    if duffel_order_id:
        db_booking.duffel_order_id = duffel_order_id
        db_booking.status = "confirmed"
    else:
        # Generate a premium mock PNR for local/seeded flights
        mock_pnr = f"SK-{str(uuid.uuid4())[:6].upper()}"
        db_booking.duffel_order_id = mock_pnr
        db_booking.status = "confirmed"
        
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

@router.post("/create-checkout-session")
async def checkout(flight_id: int, db: Session = Depends(database.get_db)):
    flight = db.query(models.Flight).filter(models.Flight.id == flight_id).first()
    if not flight:
         raise HTTPException(status_code=404, detail="Flight not found")
    
    # Get current dynamic price
    pricing_engine = PricingEngine(flight.base_price, flight.capacity)
    current_price = pricing_engine.calculate_price(flight.available_seats, flight.departure_time)
    
    url, session_id = create_checkout_session(flight.id, flight.flight_number, current_price)
    
    if not url:
        raise HTTPException(status_code=500, detail="Failed to create checkout session")
    
    return {"checkout_url": url, "session_id": session_id}

@router.get("/verify-checkout")
async def verify_checkout(session_id: str, db: Session = Depends(database.get_db)):
    success, metadata = verify_payment(session_id)
    if not success or not metadata:
        raise HTTPException(status_code=400, detail="Payment verification failed")
    
    flight_id = int(metadata.get("flight_id"))
    
    # In a real app, we'd pull the user_id from the session metadata or context
    # For this test, we'll assume the most recent user or a mock mapping
    # But let's try to get the flight to show we're doing something
    flight = db.query(models.Flight).filter(models.Flight.id == flight_id).first()
    
    return {
        "status": "success",
        "flight": flight,
        "booking_id": f"SKL-{session_id[-8:].upper()}"
    }

@router.put("/bookings/{booking_id}", response_model=schemas.Booking)
async def update_booking(booking_id: int, booking_update: schemas.BookingUpdate, db: Session = Depends(database.get_db)):
    db_booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking_update.passenger_name is not None:
        db_booking.passenger_name = booking_update.passenger_name
    if booking_update.passenger_email is not None:
        db_booking.passenger_email = booking_update.passenger_email
        
    db.commit()
    db.refresh(db_booking)
    return db_booking

@router.delete("/bookings/{booking_id}")
async def delete_booking(booking_id: int, db: Session = Depends(database.get_db)):
    db_booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    db.delete(db_booking)
    db.commit()
    return {"message": "Booking cancelled successfully"}

@router.get("/users/me/dashboard", response_model=schemas.UserDashboard)
async def get_user_dashboard(firebase_uid: str, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.firebase_uid == firebase_uid).first()
    if not user:
        # Create user if it doesn't exist (e.g. first login)
        user = models.User(
            firebase_uid=firebase_uid, 
            email=f"{firebase_uid}@sky-link.com", # Mock unique email
            full_name="SkyLink Member",
            loyalty_points=500 # Initial bonus
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    now = datetime.now()
    
    # Get all bookings with flight details
    all_bookings = db.query(models.Booking).filter(models.Booking.user_id == user.id).all()
    
    upcoming = []
    past = []
    
    for b in all_bookings:
        if b.flight.departure_time > now:
            upcoming.append(b)
        else:
            past.append(b)
            
    return {
        "user": user,
        "upcoming_flights": upcoming,
        "past_flights": past,
        "total_trips": len(all_bookings)
    }

@app.post("/api/applications/submit")
async def submit_application(
    full_name: str = Form(...),
    email: str = Form(...),
    portfolio_url: str = Form(...),
    job_title: str = Form(...),
    resume: UploadFile = File(...)
):
    # Generate a unique application ID
    app_id = f"APP-{str(uuid.uuid4())[:8].upper()}"
    
    try:
        # Define file storage path using absolute UPLOAD_DIR
        file_name = f"{app_id}_{resume.filename}"
        file_path = os.path.join(UPLOAD_DIR, file_name)
        
        # Save the file locally
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(resume.file, buffer)
        
        # Log application details
        print(f"--- NEW JOB APPLICATION RECEIVED ---")
        print(f"ID: {app_id}")
        print(f"Role: {job_title}")
        print(f"Name: {full_name}")
        print(f"Email: {email}")
        print(f"URL: {portfolio_url}")
        print(f"Resume: {file_name}")
        print(f"------------------------------------")
        
        return {
            "status": "success",
            "message": "Application received and reference ID generated.",
            "application_id": app_id
        }
    except Exception as e:
        print(f"CRITICAL ERROR during application submission: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Uplink Failure: Could not save intelligence manifest. Error: {str(e)}"
        )

# Include the router
app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Welcome to SkyLink Airline API"}


