import uuid
from sqlalchemy import (
    Column,
    String,
    DECIMAL,
    TIMESTAMP,
    Text,
    ForeignKey,
    Table
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database.database import Base


def generate_uuid():
    return str(uuid.uuid4())


user_corporate_map = Table(
    "user_corporate_map",
    Base.metadata,
    Column("user_id", String(36), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("corporate_account_id", String(36), ForeignKey("corporate_accounts.id", ondelete="CASCADE"), primary_key=True),
)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    username = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, unique=True)

    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp()
    )

    corporate_accounts = relationship(
        "CorporateAccount",
        secondary=user_corporate_map,
        back_populates="users"
    )

    bookings = relationship("Booking", back_populates="user")


class CorporateAccount(Base):
    __tablename__ = "corporate_accounts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    company_name = Column(String(255), nullable=False)
    policy_limit = Column(DECIMAL(10, 2), nullable=False)

    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    users = relationship(
        "User",
        secondary=user_corporate_map,
        back_populates="corporate_accounts"
    )

    bookings = relationship("Booking", back_populates="corporate_account")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"))
    corporate_account_id = Column(String(36), ForeignKey("corporate_accounts.id"))

    flight_id = Column(String(50), nullable=False)
    price = Column(DECIMAL(10, 2), nullable=False)
    trip_type = Column(String(20), nullable=False)  # WORK / LEISURE
    status = Column(String(50), default="CONFIRMED")

    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    user = relationship("User", back_populates="bookings")
    corporate_account = relationship("CorporateAccount", back_populates="bookings")
    resolutions = relationship(
        "ResolutionSuggestion",
        back_populates="booking",
        cascade="all, delete"
    )


class ResolutionSuggestion(Base):
    __tablename__ = "resolution_suggestions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    booking_id = Column(String(36), ForeignKey("bookings.id", ondelete="CASCADE"))

    suggestion = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    booking = relationship("Booking", back_populates="resolutions")
