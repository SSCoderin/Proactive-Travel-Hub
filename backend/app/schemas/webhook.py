from pydantic import BaseModel

class FlightUpdatePayload(BaseModel):
    flight_id: str
    delay_minutes: int
