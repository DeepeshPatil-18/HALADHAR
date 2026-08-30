"""
KrishiMitra backend — Pydantic models for all API request/response shapes.
"""
from __future__ import annotations
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field


# ── Weather ──────────────────────────────────────────────────────────────────

class WeatherResponse(BaseModel):
    temperature: float = Field(..., description="Current temperature in °C")
    humidity: float = Field(..., description="Relative humidity in %")
    precipitation_probability: float = Field(..., description="Precipitation probability in %")
    wind_speed: float = Field(..., description="Wind speed in km/h")
    condition: str = Field(..., description="Human-readable weather condition")
    timestamp: str = Field(..., description="ISO 8601 UTC timestamp of data fetch")
    location: str = Field(..., description="lat,lon string for reference")


# ── Mandi Price ───────────────────────────────────────────────────────────────

class MandiPriceResponse(BaseModel):
    crop: str
    min_price: float = Field(..., description="Minimum price ₹/quintal")
    max_price: float = Field(..., description="Maximum price ₹/quintal")
    modal_price: float = Field(..., description="Modal (most common) price ₹/quintal")
    mandi_name: str
    last_updated: str = Field(..., description="ISO 8601 timestamp from data source")


# ── Schemes ───────────────────────────────────────────────────────────────────

class SchemeRecord(BaseModel):
    id: Optional[str] = None
    name: str
    description: str
    eligibility: str
    benefits: str
    required_documents: list[str] = Field(default_factory=list)
    application_process: str
    official_link: str
    source_url: str
    applicable_states: list[str] = Field(default_factory=list)
    applicable_enterprise_types: list[str] = Field(default_factory=list)
    last_fetched: Optional[str] = None
    cache_timestamp: Optional[str] = Field(None, description="Set when serving from cache after source failure")


class SchemesResponse(BaseModel):
    schemes: list[SchemeRecord]
    served_from_cache: bool = False
    cache_timestamp: Optional[str] = None


# ── Training Resources ────────────────────────────────────────────────────────

class TrainingResource(BaseModel):
    id: Optional[str] = None
    topic: str
    crop_activity: str
    language: Optional[str] = None  # 'en', 'hi', 'mr'
    duration: Optional[str] = None
    material_description: str
    source_link: str
    enterprise_type: str
    last_fetched: Optional[str] = None
    cache_timestamp: Optional[str] = Field(None, description="Set when serving from cache after source failure")


class TrainingResponse(BaseModel):
    resources: list[TrainingResource]
    served_from_cache: bool = False
    cache_timestamp: Optional[str] = None


# ── Error ─────────────────────────────────────────────────────────────────────

class ErrorResponse(BaseModel):
    error: str
    retryable: bool = True
    detail: Optional[str] = None
