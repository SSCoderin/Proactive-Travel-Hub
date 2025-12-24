from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import SessionLocal
from models.models import CorporateAccount
from schemas.corporate_account import CorporateAccountCreate

router = APIRouter(
    prefix="/corporate-accounts",
    tags=["Corporate Accounts"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", status_code=201)
def create_corporate_account(
    data: CorporateAccountCreate,
    db: Session = Depends(get_db)
):
    company = CorporateAccount(
        company_name=data.company_name,
        policy_limit=data.policy_limit
    )
    db.add(company)
    db.commit()
    db.refresh(company)
    return company
@router.get("/" )
def get_corporate_accounts(db: Session = Depends(get_db)):
    companies = db.query(CorporateAccount).all()
    return companies