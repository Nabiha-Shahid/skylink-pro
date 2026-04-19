from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

Base = declarative_base()

class FlightStatus(enum.Enum):
    SCHEDULED = "scheduled"
    ON_TIME = "on-time"
    DELAYED = "delayed"
    CANCELLED = "cancelled"

class Flight(Base):
    __tablename__ = "flights"

    id = Column(Integer, primary_key=True, index=True)
    flight_number = Column(String, unique=True, index=True)
    origin = Column(String)
    destination = Column(String)
    departure_time = Column(DateTime)
    arrival_time = Column(DateTime)
    base_price = Column(Float)
    capacity = Column(Integer)
    available_seats = Column(Integer)
    status = Column(Enum(FlightStatus), default=FlightStatus.SCHEDULED)
    duffel_offer_id = Column(String, nullable=True)

    bookings = relationship("Booking", back_populates="flight")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    firebase_uid = Column(String, unique=True, index=True)
    full_name = Column(String)
    loyalty_points = Column(Integer, default=0)

    bookings = relationship("Booking", back_populates="user")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    flight_id = Column(Integer, ForeignKey("flights.id"))
    seat_number = Column(String)
    status = Column(String) # confirmed, pending, etc.
    total_price = Column(Float)
    booking_date = Column(DateTime, default=datetime.utcnow)
    passenger_name = Column(String)
    passenger_email = Column(String)
    passenger_title = Column(String)
    gender = Column(String)
    born_on = Column(String) # YYYY-MM-DD
    passenger_phone = Column(String)
    duffel_order_id = Column(String, nullable=True)

    user = relationship("User", back_populates="bookings")
    flight = relationship("Flight", back_populates="bookings")
