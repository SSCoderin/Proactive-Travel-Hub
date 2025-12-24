from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database.database import SessionLocal
from models.models import User
from models.models import CorporateAccount
from models.models import user_corporate_map
from schemas.user_corporate import UserCorporateAssignRequest

router = APIRouter(
    prefix="/user-corporate",
    tags=["User Corporate Mapping"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", status_code=201)
def assign_user_to_corporate(
    payload: UserCorporateAssignRequest,
    db: Session = Depends(get_db)
):
    user_id = payload.user_id
    corporate_account_id = payload.corporate_account_id

    # 1. Validate user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 2. Validate corporate account exists
    company = db.query(CorporateAccount).filter(
        CorporateAccount.id == corporate_account_id
    ).first()
    if not company:
        raise HTTPException(status_code=404, detail="Corporate account not found")

    # 3. Check mapping already exists
    existing = db.execute(
        user_corporate_map.select().where(
            (user_corporate_map.c.user_id == user_id) &
            (user_corporate_map.c.corporate_account_id == corporate_account_id)
        )
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already assigned to this corporate account"
        )

    # 4. Insert mapping
    db.execute(
        user_corporate_map.insert().values(
            user_id=user_id,
            corporate_account_id=corporate_account_id
        )
    )
    db.commit()

    return {"message": "User successfully assigned to corporate account"}




# get all user mapping 
@router.get("/", response_model=list[UserCorporateAssignRequest])
def get_user_corporate_mapping(db: Session = Depends(get_db)):
    return db.query(user_corporate_map).all()
