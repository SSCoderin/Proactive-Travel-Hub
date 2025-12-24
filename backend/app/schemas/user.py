from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr

class UserResponse(BaseModel):
    id: str
    username: str
    email: EmailStr

    class Config:
        from_attributes = True
