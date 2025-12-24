
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database.database import SessionLocal
from schemas.booking import BookingCreate
from models.models import Booking
from models.models import CorporateAccount
from models.models import user_corporate_map

router = APIRouter(
    prefix="/book",
    tags=["Bookings"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", status_code=201)
def create_booking(
    data: BookingCreate,
    db: Session = Depends(get_db)
):
    corporate_account_id = None

    if data.trip_type.upper() == "WORK":
        mapping = db.execute(
            user_corporate_map.select().where(
                user_corporate_map.c.user_id == data.user_id
            )
        ).first()

        if not mapping:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User is not linked to any corporate account"
            )

        corporate_account_id = mapping.corporate_account_id

      
        corporate = db.query(CorporateAccount).filter(
            CorporateAccount.id == corporate_account_id
        ).first()

        if not corporate:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Corporate account not found"
            )

      
        if data.price > corporate.policy_limit:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Booking price exceeds corporate policy limit of {corporate.policy_limit}"
            )



    booking = Booking(
        user_id=data.user_id,
        corporate_account_id=corporate_account_id,
        flight_id=data.flight_id,
        price=data.price,
        trip_type=data.trip_type.upper(),
        status="CONFIRMED"
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return booking




@router.get("/{user_id}", status_code=201)
def get_user_bookings(user_id: str, db: Session = Depends(get_db)):
    return db.query(Booking).filter(Booking.user_id == user_id).all()
