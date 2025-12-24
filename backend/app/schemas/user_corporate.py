from pydantic import BaseModel

class UserCorporateAssignRequest(BaseModel):
    user_id: str
    corporate_account_id: str
