from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class ApplicationModel(BaseModel):
    id: str = Field(alias="_id")
    application_id: str
    user_id: str
    scheme_id: str
    scheme_name: str
    status: str
    personal_details: Dict[str, Any]
    academic_details: Dict[str, Any]
    financial_details: Dict[str, Any]
    documents: List[Dict[str, Any]] = []
    has_deficiency: bool = False
    deficiency_notes: Optional[str] = None
    officer_remarks: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
