from sqlalchemy.orm import Session
from . import models, database
from datetime import datetime, timedelta
import random

def seed_flights(db: Session):
    # Wipe existing flights for a clean test set
    db.query(models.Booking).delete() # Delete bookings first to avoid FK constraints
    db.query(models.Flight).delete()
    db.commit()

    # Specific high-quality routes for the 'Big Three' test
    test_routes = [
        ("JFK (New York)", "CDG (Paris)"),
        ("CDG (Paris)", "LHR (London)"),
        ("LHR (London)", "JFK (New York)"),
        ("JFK (New York)", "LHR (London)"),
        ("LHR (London)", "CDG (Paris)"),
        ("DXB (Dubai)", "JFK (New York)"),
        ("SFO (San Francisco)", "NRT (Tokyo)"),
        ("SIN (Singapore)", "SYD (Sydney)"),
    ]

    for i in range(25):
        if i < len(test_routes):
            origin, destination = test_routes[i]
        else:
            origin, destination = random.choice(test_routes)
            
        flight_num = f"SK{random.randint(1000, 9999)}"
        
        # Departure between now and 30 days from now
        departure = datetime.now() + timedelta(days=random.randint(1, 30), hours=random.randint(0, 23))
        arrival = departure + timedelta(hours=random.randint(6, 14))
        
        flight = models.Flight(
            flight_number=flight_num,
            origin=origin,
            destination=destination,
            departure_time=departure,
            arrival_time=arrival,
            base_price=float(random.randint(400, 1500)),
            capacity=180,
            available_seats=random.randint(10, 170),
            status=models.FlightStatus.SCHEDULED
        )
        db.add(flight)
    
    db.commit()
    print("Database seeded with mock flights.")

if __name__ == "__main__":
    db = next(database.get_db())
    seed_flights(db)
