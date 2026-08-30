"""Pydantic schemas for KrishiMitra API"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class RecommendedEnterprise(BaseModel):
    """Schema for enterprise recommendation"""
    enterprise_code: str
    enterprise_name: str
    score: float = Field(ge=0, le=100, description="Recommendation score (0-100)")
    match_reason: str
    estimated_investment: int
    estimated_monthly_income: int
    payback_months: int
    relevant_schemes: List[Dict[str, Any]] = []
    training_modules: List[Dict[str, Any]] = []
    market_info: Optional[Dict[str, Any]] = None


class AdvisoryRequest(BaseModel):
    """Request for enterprise advisory"""
    budget_rupees: int = Field(gt=0, description="Available budget in rupees")
    land_size_hectares: float = Field(gt=0, description="Available land in hectares")
    state: str = Field(default="maharashtra", description="State location")
    experience_level: str = Field(default="beginner", description="Beginner, intermediate, or expert")
    goals: Optional[str] = Field(default=None, description="Farmer's goals")


class AdvisoryResponse(BaseModel):
    """Response with enterprise recommendations"""
    recommendations: List[RecommendedEnterprise]
    summary: str
    farmer_profile: Dict[str, Any]


class ChatRequest(BaseModel):
    """Chat request to assistant"""
    message: str
    language: str = "english"
    farmer_context: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    """Chat response from assistant"""
    response: str
    intent: str
    response_type: str
    detected_language: str
    information_completeness: float
    requires_further_input: bool
    suggested_next_action: Optional[str] = None


class SchemeSearchRequest(BaseModel):
    """Request to search schemes"""
    query: Optional[str] = None
    state: Optional[str] = None
    enterprise: Optional[str] = None


class WeatherRequest(BaseModel):
    """Request for weather data"""
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    days: int = Field(default=7, ge=1, le=14, description="Number of days forecast")
