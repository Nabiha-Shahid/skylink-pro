from backend.database import SessionLocal
from backend.models import User, Booking, Flight
from datetime import datetime, timedelta

def seed_test_user_data():
    db = SessionLocal()
    try:
        # Check if we have a test user (mock UID)
        test_uid = "test-user-123"
        user = db.query(User).filter(User.firebase_uid == test_uid).first()
        
        if not user:
            user = User(
                email="test@sky-link.com",
                firebase_uid=test_uid,
                full_name="Alex SkyWalker",
                loyalty_points=1250
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # check for existing bookings
        if db.query(Booking).filter(Booking.user_id == user.id).count() > 0:
            print("Dashboard data already seeded.")
            return

        # find some flights
        flights = db.query(Flight).limit(3).all()
        if not flights:
            print("No flights found to book. Run seed_data.py first.")
            return

        # Add one upcoming and one past booking
        # Upcoming
        b1 = Booking(
            user_id=user.id,
            flight_id=flights[0].id,
            seat_number="12A",
            status="confirmed",
            total_price=540.0,
            booking_date=datetime.now() - timedelta(days=2),
            passenger_name="Alex SkyWalker",
            passenger_email="test@sky-link.com"
        )
        # Past (we modify the flight departure time for this flight temporarily)
        flights[1].departure_time = datetime.now() - timedelta(days=5)
        b2 = Booking(
            user_id=user.id,
            flight_id=flights[1].id,
            seat_number="4C",
            status="completed",
            total_price=320.0,
            booking_date=datetime.now() - timedelta(days=30),
            passenger_name="Alex SkyWalker",
            passenger_email="test@sky-link.com"
        )
        
        db.add(b1)
        db.add(b2)
        db.commit()
        print("Test dashboard data seeded successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_test_user_data()
