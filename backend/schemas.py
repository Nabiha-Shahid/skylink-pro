from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class FlightBase(BaseModel):
    flight_number: str
    origin: str
    destination: str
    departure_time: datetime
    arrival_time: datetime
    base_price: float
    capacity: int
    available_seats: int
    status: str
    delay_probability: Optional[float] = 0.0
    duffel_offer_id: Optional[str] = None

class FlightCreate(FlightBase):
    pass

class Flight(FlightBase):
    id: int

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    email: str
    full_name: str

class UserCreate(UserBase):
    firebase_uid: str

class User(UserBase):
    id: int
    firebase_uid: str
    loyalty_points: int

    class Config:
        orm_mode = True

class BookingBase(BaseModel):
    user_id: int
    flight_id: int
    seat_number: str
    status: str
    total_price: float
    passenger_name: Optional[str] = None
    passenger_email: Optional[str] = None
    passenger_title: str
    gender: str
    born_on: str # YYYY-MM-DD
    passenger_phone: str
    duffel_order_id: Optional[str] = None

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    passenger_name: Optional[str] = None
    passenger_email: Optional[str] = None

class Booking(BookingBase):
    id: int
    booking_date: datetime

    class Config:
        orm_mode = True

class BookingDetail(Booking):
    flight: Flight

    class Config:
        orm_mode = True

class UserDashboard(BaseModel):
    user: User
    upcoming_flights: List[BookingDetail]
    past_flights: List[BookingDetail]
    total_trips: int
