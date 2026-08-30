"""
Mandi Price Tool - Wrapper around existing Farmer.in integration
Reuses: backend/data_sources/mandi_source.py

Location is injected by the orchestrator via the context dict.
The Mistral Agent should pass state + district that match the farmer's location.
"""

from typing import Dict, Any, Optional
from data_sources.mandi_source import MandiSource
import logging

logger = logging.getLogger(__name__)

# Mistral Agent function schema
mandi_tool = {
    "type": "function",
    "function": {
        "name": "get_mandi_price",
        "description": (
            "Get current mandi/market prices for agricultural commodities in India. "
            "Uses live data from Farmer.in (Agmarknet). Returns modal/min/max price per quintal "
            "and market trends. "
            "IMPORTANT: Always pass the farmer's state and district from the location context — "
            "do NOT ask the farmer for their location when it is already available. "
            "Supports Hindi/Marathi commodity names: प्याज (onion), सोयाबीन (soybean), "
            "कापूस (cotton), कांदा (onion), टमाटर (tomato), आलू (potato), etc."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "commodity": {
                    "type": "string",
                    "description": (
                        "Commodity name in English, Hindi, or Marathi. "
                        "Examples: 'Soybean', 'Onion', 'Cotton', 'Wheat', 'Rice', "
                        "'Tomato', 'Potato', 'Maize', 'Chickpea', "
                        "'प्याज', 'सोयाबीन', 'कापूस', 'गेहूं', 'मक्का', 'कांदा'"
                    )
                },
                "state": {
                    "type": "string",
                    "description": (
                        "State name for location context — use the farmer's state from location context. "
                        "Examples: 'Maharashtra', 'Punjab', 'Madhya Pradesh', 'Uttar Pradesh', 'Rajasthan'"
                    )
                },
                "district": {
                    "type": "string",
                    "description": (
                        "District or market name — use the farmer's district from location context. "
                        "Examples: 'Jalgaon', 'Nashik', 'Pune', 'Nagpur', 'Amravati', 'Kopergaon'"
                    )
                }
            },
            "required": ["commodity"]
        }
    }
}

# Commodity name mappings — Hindi, Marathi, and common STT errors → canonical English
COMMODITY_ALIASES: Dict[str, str] = {
    # Hindi
    "प्याज":       "Onion",
    "टमाटर":       "Tomato",
    "आलू":         "Potato",
    "गेहूं":       "Wheat",
    "गेहू":        "Wheat",
    "चावल":        "Rice",
    "धान":         "Paddy",
    "बाजरा":       "Bajra",
    "ज्वार":       "Jowar",
    "मक्का":       "Maize",
    "सोयाबीन":     "Soyabean",
    "कपास":        "Cotton",
    "मूंगफली":     "Groundnut",
    "गन्ना":       "Sugarcane",
    "सरसों":       "Mustard",
    "सूरजमुखी":   "Sunflower",
    "अरहर":        "Arhar",
    "तुअर":        "Arhar",
    "मूंग":        "Moong",
    "उड़द":        "Urad",
    "चना":         "Chickpea",
    "हरभरा":       "Chickpea",
    "हल्दी":       "Turmeric",
    "मिर्च":       "Chilli",
    "लहसुन":       "Garlic",
    "अदरक":        "Ginger",
    "बैंगन":       "Brinjal",
    "गोभी":        "Cauliflower",
    "पत्तागोभी":   "Cabbage",
    "मटर":         "Peas",
    "भिंडी":       "Okra",
    # Marathi
    "कांदा":       "Onion",
    "कापूस":       "Cotton",
    "भात":         "Rice",
    "तांदूळ":      "Rice",
    "हळद":         "Turmeric",
    "मिरची":       "Chilli",
    "लसूण":        "Garlic",
    "आलं":         "Ginger",
    "वांगी":       "Brinjal",
    "फ्लॉवर":      "Cauliflower",
    "कोबी":        "Cabbage",
    "वाटाणा":      "Peas",
    "भेंडी":       "Okra",
    "टोमॅटो":     "Tomato",
    # English STT variants / normalizations (from agriNormalize)
    "soybean":     "Soyabean",
    "soyabean":    "Soyabean",
    "soya bean":   "Soyabean",
    "paddy":       "Paddy",
    "groundnut":   "Groundnut",
    "chickpea":    "Chickpea",
    "gram":        "Chickpea",
    "mustard":     "Mustard",
    "arhar":       "Arhar",
    "toor":        "Arhar",
    "tur":         "Arhar",
    "moong":       "Moong",
    "urad":        "Urad",
    "bajra":       "Bajra",
    "jowar":       "Jowar",
}


async def get_mandi_price(
    commodity: str,
    state: Optional[str] = None,
    district: Optional[str] = None,
    market: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Get mandi prices for a commodity using existing Farmer.in integration.

    Args:
        commodity: Commodity name (English, Hindi, or Marathi)
        state:     State name from location context (preferred over market)
        district:  District/market name from location context
        market:    Alias for district (accepted for backward compatibility)

    Returns:
        Structured response with price data and navigation action
    """
    # district and market are the same concept — unify
    market_name = district or market

    logger.info(
        f"[TOOL:get_mandi_price] commodity='{commodity}', state='{state}', "
        f"district/market='{market_name}'"
    )

    try:
        # Normalize commodity name (case-insensitive lookup)
        commodity_lower = commodity.lower().strip()
        commodity_normalized = (
            COMMODITY_ALIASES.get(commodity)               # exact match (Hindi/Marathi)
            or COMMODITY_ALIASES.get(commodity_lower)      # lowercase English variant
            or commodity                                    # pass through as-is
        )

        logger.info(f"[TOOL:get_mandi_price] Normalized: '{commodity}' → '{commodity_normalized}'")

        # Call existing Farmer.in integration (NO DUPLICATION)
        result = await MandiSource.fetch_mandi_prices(
            commodity=commodity_normalized,
            state=state,
            market=market_name
        )

        # Check availability
        availability = result.get("availability", "available")
        prices       = result.get("prices", [])

        if availability == "not_available" or not prices:
            # Build a location-aware unavailable message
            loc_hint = ""
            if market_name:
                loc_hint = f" ({market_name}"
                if state:
                    loc_hint += f", {state}"
                loc_hint += ")"
            elif state:
                loc_hint = f" ({state})"

            logger.warning(f"[TOOL:get_mandi_price] No data for '{commodity_normalized}'{loc_hint}")
            return {
                "status":    "unavailable",
                "message":   (
                    f"{commodity_normalized}{loc_hint} चा आजचा भाव सध्या उपलब्ध नाही। "
                    "कृपया थोड्या वेळाने पुन्हा प्रयत्न करा."
                ),
                "commodity":  commodity,
                "state":      state,
                "district":   market_name,
                "navigation": None
            }

        # Extract price data
        price_data        = prices[0]
        price_per_quintal = price_data.get("price_per_quintal", 0)
        min_price         = price_data.get("min_price", 0)
        max_price         = price_data.get("max_price", 0)
        trend             = price_data.get("trend", "")
        change            = price_data.get("change", 0)
        date              = price_data.get("date", "")
        state_name        = price_data.get("state", "") or (state or "")
        major_states      = price_data.get("major_states", [])

        response = {
            "status":           "available",
            "commodity":        commodity,
            "commodity_english": commodity_normalized,
            "price_per_quintal": price_per_quintal,
            "min_price":        min_price,
            "max_price":        max_price,
            "trend":            trend,
            "change":           change,
            "date":             date,
            "state":            state_name or (major_states[0] if major_states else ""),
            "district":         market_name or "",
            "source":           "Farmer.in (Agmarknet)",
            "navigation": {
                "enabled":       True,
                "label":         "अधिक जानकारी देखें",
                "label_english": "View more details",
                "route":         "/bazaar",
                "params": {
                    "commodity": commodity_normalized.lower()
                }
            }
        }

        logger.info(
            f"[TOOL:get_mandi_price] ₹{price_per_quintal}/quintal for '{commodity_normalized}' "
            f"(state={state_name}, district={market_name})"
        )
        return response

    except Exception as e:
        logger.error(f"[TOOL:get_mandi_price] Error: {e}")
        return {
            "status":    "error",
            "message":   f"मंडी भाव प्राप्त करने में त्रुटि: {str(e)}",
            "commodity": commodity,
            "navigation": None
        }
