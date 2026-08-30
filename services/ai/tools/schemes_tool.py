"""
Government Schemes Tool - Wrapper around existing schemes provider
Reuses: backend/services/data_provider.py (SchemeProvider)
"""

from typing import Dict, Any, Optional
from services.data_provider import SchemeProvider
import logging

logger = logging.getLogger(__name__)

# Mistral Agent function schema
schemes_tool = {
    "type": "function",
    "function": {
        "name": "search_schemes",
        "description": "Search for government schemes and subsidies for farmers and agricultural enterprises in India. Includes schemes from central and state governments with eligibility criteria, benefits, and application process.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Search term for schemes. Examples: 'subsidy', 'सब्सिडी', 'loan', 'ऋण', 'apiculture', 'मधुमक्खी पालन'"
                },
                "enterprise": {
                    "type": "string",
                    "description": "Enterprise type filter. Examples: 'apiculture', 'poultry', 'fish', 'dairy', 'mushroom', 'goat'"
                },
                "state": {
                    "type": "string",
                    "description": "State name filter. Examples: 'maharashtra', 'punjab', 'all_india'"
                }
            },
            "required": []
        }
    }
}


async def search_schemes(
    query: Optional[str] = None,
    enterprise: Optional[str] = None,
    state: Optional[str] = "maharashtra"
) -> Dict[str, Any]:
    """
    Search government schemes using existing SchemeProvider.
    
    This is a thin wrapper - all logic is in the existing SchemeProvider.
    
    Args:
        query: Search term
        enterprise: Enterprise type filter
        state: State filter
        
    Returns:
        Structured response with schemes data and navigation action
    """
    logger.info(f"[TOOL:search_schemes] query={query}, enterprise={enterprise}, state={state}")
    
    try:
        # Call existing SchemeProvider (NO DUPLICATION)
        if enterprise:
            schemes = SchemeProvider.get_schemes_by_enterprise(enterprise, state)
        else:
            schemes = SchemeProvider.get_all_schemes()
        
        # Apply text search filter if query provided
        if query:
            query_lower = query.lower()
            filtered_schemes = []
            for scheme in schemes:
                searchable_text = " ".join([
                    scheme.get("name", ""),
                    scheme.get("description", ""),
                    scheme.get("department", ""),
                    scheme.get("enterprise", ""),
                ]).lower()
                
                if query_lower in searchable_text:
                    filtered_schemes.append(scheme)
            
            schemes = filtered_schemes
        
        # Apply state filter if not already filtered by enterprise
        if state and state.lower() != "all" and not enterprise:
            state_lower = state.lower()
            schemes = [
                s for s in schemes
                if s.get("state", "").lower() in [state_lower, "all_india"]
            ]
        
        # Check if any schemes found
        if not schemes:
            logger.warning(f"[TOOL:search_schemes] No schemes found for query={query}, enterprise={enterprise}")
            return {
                "status": "unavailable",
                "message": "वर्तमान में कोई योजना नहीं मिली। कृपया अन्य खोज शब्द आज़माएं।",
                "total_count": 0,
                "schemes": [],
                "navigation": {
                    "enabled": True,
                    "label": "सभी योजनाएं देखें",
                    "label_english": "View all schemes",
                    "route": "/help",
                    "params": {}
                }
            }
        
        # Format schemes summary for Agent (first 3 schemes with key info)
        schemes_summary = []
        for scheme in schemes[:3]:
            schemes_summary.append({
                "name": scheme.get("name", ""),
                "description": scheme.get("description", "")[:200] + "..." if len(scheme.get("description", "")) > 200 else scheme.get("description", ""),
                "department": scheme.get("department", ""),
                "enterprise": scheme.get("enterprise", ""),
                "subsidy_percentage": scheme.get("subsidy_percentage"),
                "subsidy_amount_rupees": scheme.get("subsidy_amount_rupees")
            })
        
        response = {
            "status": "available",
            "total_count": len(schemes),
            "schemes": schemes_summary,
            "showing": len(schemes_summary),
            "query": query,
            "enterprise": enterprise,
            "state": state,
            "navigation": {
                "enabled": True,
                "label": "सभी योजनाएं देखें",
                "label_english": "View all schemes",
                "route": "/help",
                "params": {}
            }
        }
        
        logger.info(f"[TOOL:search_schemes] Success: Found {len(schemes)} schemes")
        return response
        
    except Exception as e:
        logger.error(f"[TOOL:search_schemes] Error: {e}")
        return {
            "status": "error",
            "message": f"योजनाएं खोजने में त्रुटि: {str(e)}",
            "total_count": 0,
            "navigation": None
        }
