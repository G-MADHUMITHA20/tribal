from typing import Dict, Any, Optional
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/eligibility", tags=["Eligibility Engine"])

class PreCheckRequest(BaseModel):
    scheme_id: str
    annual_income: Optional[float] = None
    category: Optional[str] = None
    course: Optional[str] = None
    percentage: Optional[float] = None

class PreCheckResponse(BaseModel):
    status: str = "UNAVAILABLE"
    available: bool = False
    message: str = "Eligibility pre-check service is currently unavailable. Decisions will be evaluated by the MoTA verification board upon submission."

@router.post("/pre-check", response_model=PreCheckResponse)
async def check_scheme_eligibility(payload: PreCheckRequest):
    """
    Standardized eligibility pre-check endpoint.
    Returns status unavailable as rule engine backend service is scheduled for future deployment.
    Never fabricates false-positive eligible/ineligible decisions.
    """
    return PreCheckResponse()
