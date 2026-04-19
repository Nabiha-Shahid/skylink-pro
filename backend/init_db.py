from backend.database import engine, SessionLocal
from backend.models import Base
from backend.seed_data import seed_flights

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    print("Seeding initial data...")
    db = SessionLocal()
    try:
        seed_flights(db)
        print("Database initialization complete!")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
