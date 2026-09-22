from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class SchemeModel(BaseModel):
    id: str = Field(alias="_id")
    code: str
    name: str
    short_name: str
    category: str
    tagline: str
    description: str
    portal_category: str
    is_open: bool
    academic_year: str
    application_deadline: str
    target_community: str = "Scheduled Tribes (ST)"
    annual_income_cap: int
    min_academic_percentage: Optional[float] = None
    eligibility_summary: List[str]
    eligibility_rules: List[Dict[str, Any]]
    required_documents: List[Dict[str, Any]]
    benefits: List[Dict[str, Any]]
    is_demo_data: bool = True

    class Config:
        populate_by_name = True
