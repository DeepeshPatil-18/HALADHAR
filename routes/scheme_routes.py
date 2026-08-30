"""
Scheme API Routes
Endpoints for government scheme and subsidy information
"""

from fastapi import APIRouter, HTTPException
from typing import List, Optional
from services.scheme_service import scheme_service

router = APIRouter(prefix="/api/v1", tags=["schemes"])

@router.get("/schemes")
async def get_schemes(category: Optional[str] = None, query: Optional[str] = None):
    """
    Get government schemes
    
    Query Parameters:
    - category: Filter by category (equipment, irrigation, solar, polyhouse, allied, modern, etc.)
    - query: Search by name or description
    """
    try:
        if query:
            schemes = scheme_service.search_schemes(query)
        elif category:
            schemes = scheme_service.get_schemes_by_category(category)
        else:
            schemes = scheme_service.get_all_schemes()
        
        return {
            "success": True,
            "count": len(schemes),
            "schemes": schemes
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/schemes/{scheme_id}")
async def get_scheme_details(scheme_id: str):
    """Get detailed information about a specific scheme"""
    try:
        scheme = scheme_service.get_scheme_by_id(scheme_id)
        
        if not scheme:
            raise HTTPException(status_code=404, detail="Scheme not found")
        
        return {
            "success": True,
            "scheme": scheme
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/schemes/category/{category}")
async def get_schemes_by_category(category: str):
    """Get all schemes for a specific category"""
    try:
        schemes = scheme_service.get_schemes_by_category(category)
        
        return {
            "success": True,
            "category": category,
            "count": len(schemes),
            "schemes": schemes
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
