from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class GrievanceModel(BaseModel):
    id: str = Field(alias="_id")
    grievance_id: str
    user_id: str
    application_id: Optional[str] = None
    scheme_name: Optional[str] = None
    category: str
    subject: str
    description: str
    status: str = "SUBMITTED"
    assigned_officer: Optional[str] = "MoTA Grievance Redressal Officer"
    resolution_remarks: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
