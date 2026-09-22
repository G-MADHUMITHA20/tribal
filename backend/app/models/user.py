from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

class UserModel(BaseModel):
    id: str = Field(alias="_id")
    name: str
    email: EmailStr
    phone: str
    hashed_password: str
    role: str = "APPLICANT" # APPLICANT, OFFICER, ADMIN
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
