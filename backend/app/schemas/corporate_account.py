from pydantic import BaseModel
from decimal import Decimal

class CorporateAccountCreate(BaseModel):
    company_name: str
    policy_limit: Decimal
