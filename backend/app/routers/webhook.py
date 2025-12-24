from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import SessionLocal
from models.models import Booking
from models.models import ResolutionSuggestion
from socket_manager import manager
from schemas.webhook import FlightUpdatePayload

router = APIRouter(
    prefix="/webhook",
    tags=["Webhook"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/flight-update")
async def flight_delay_webhook(
    payload: FlightUpdatePayload,
    db: Session = Depends(get_db)
):
    bookings = db.query(Booking).filter(
        Booking.flight_id == payload.flight_id
    ).all()

    for booking in bookings:
        suggestion_text = (
            "Book Airport Lounge"
            if booking.trip_type == "WORK"
            else "Notify Honeymoon Hotel"
        )

        suggestion = ResolutionSuggestion(
            booking_id=booking.id,
            suggestion=suggestion_text
        )

        db.add(suggestion)

        await manager.send_message(
            booking.user_id,
            {
                "type": "FLIGHT_DELAY",
                "flight_id": payload.flight_id,
                "delay_minutes": payload.delay_minutes,
                "suggestion": suggestion_text,
            }
        )

    db.commit()

    return {
        "status": "processed",
        "affected_users": len(bookings)
    }