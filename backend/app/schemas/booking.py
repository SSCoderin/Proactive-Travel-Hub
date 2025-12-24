from pydantic import BaseModel
from decimal import Decimal

class BookingCreate(BaseModel):
    user_id: str
    flight_id: str
    price: Decimal
    trip_type: str  # WORK or LEISURE