"""
Weather Tool - Wrapper around existing Open-Meteo integration
Reuses: backend/services/weather_service.py

Location priority:
  1. latitude + longitude passed directly (from device GPS via location context)
  2. location name string → LOCATION_COORDS lookup
  3. fallback: center-of-India coordinates (no city label)
"""

from typing import Dict, Any, Optional
from services.weather_service import WeatherService
import logging

logger = logging.getLogger(__name__)

# Mistral Agent function schema
weather_tool = {
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": (
            "Get current weather conditions and forecast for farmers in India. "
            "Includes temperature, rain prediction, 7-day forecast, and farmer advisory. "
            "Pass latitude/longitude if GPS coordinates are available — this gives the most "
            "accurate local result. Otherwise pass a city/district name."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": (
                        "Location name in India. Examples: 'Jalgaon', 'Nashik', 'Pune', 'Mumbai', "
                        "'Nagpur', 'Aurangabad', 'Kolhapur'. "
                        "Use the farmer's city or district from the location context."
                    )
                },
                "latitude": {
                    "type": "number",
                    "description": "GPS latitude of the farmer's location (from location context). Use when available."
                },
                "longitude": {
                    "type": "number",
                    "description": "GPS longitude of the farmer's location (from location context). Use when available."
                },
                "state": {
                    "type": "string",
                    "description": "State name (e.g. 'Maharashtra', 'Punjab'). Used for advisory context."
                }
            },
            "required": []
        }
    }
}

# Fallback city → coordinates lookup (expanded with common Indian agricultural cities)
LOCATION_COORDS = {
    # Maharashtra
    "kopergaon":    (19.8826, 74.4764),
    "ahmednagar":   (19.0948, 74.7480),
    "nashik":       (19.9975, 73.7898),
    "pune":         (18.5204, 73.8567),
    "mumbai":       (19.0760, 72.8777),
    "nagpur":       (21.1458, 79.0882),
    "aurangabad":   (19.8762, 75.3433),
    "jalgaon":      (21.0077, 75.5626),
    "solapur":      (17.6599, 75.9064),
    "kolhapur":     (16.7050, 74.2433),
    "amravati":     (20.9320, 77.7523),
    "latur":        (18.4088, 76.5604),
    "nanded":       (19.1383, 77.3210),
    "akola":        (20.7002, 77.0082),
    "washim":       (20.1116, 77.1434),
    "buldhana":     (20.5292, 76.1842),
    "yavatmal":     (20.3888, 78.1204),
    "dhule":        (20.9042, 74.7748),
    "nandurbar":    (21.3703, 74.2432),
    "sangli":       (16.8524, 74.5815),
    "satara":       (17.6805, 74.0183),
    # Punjab / Haryana
    "ludhiana":     (30.9010, 75.8573),
    "amritsar":     (31.6340, 74.8723),
    "chandigarh":   (30.7333, 76.7794),
    "patiala":      (30.3398, 76.3869),
    "bathinda":     (30.2110, 74.9455),
    "karnal":       (29.6857, 76.9905),
    "hisar":        (29.1492, 75.7217),
    # UP / MP
    "lucknow":      (26.8467, 80.9462),
    "kanpur":       (26.4499, 80.3319),
    "agra":         (27.1767, 78.0081),
    "meerut":       (28.9845, 77.7064),
    "varanasi":     (25.3176, 82.9739),
    "bhopal":       (23.2599, 77.4126),
    "indore":       (22.7196, 75.8577),
    "gwalior":      (26.2183, 78.1828),
    "jabalpur":     (23.1815, 79.9864),
    # Rajasthan / Gujarat
    "jaipur":       (26.9124, 75.7873),
    "jodhpur":      (26.2389, 73.0243),
    "kota":         (25.2138, 75.8648),
    "ahmedabad":    (23.0225, 72.5714),
    "surat":        (21.1702, 72.8311),
    "vadodara":     (22.3072, 73.1812),
    "rajkot":       (22.3039, 70.8022),
    # Karnataka / AP / Telangana
    "bangalore":    (12.9716, 77.5946),
    "bengaluru":    (12.9716, 77.5946),
    "mysore":       (12.2958, 76.6394),
    "hubli":        (15.3647, 75.1240),
    "hyderabad":    (17.3850, 78.4867),
    "vizag":        (17.6868, 83.2185),
    "visakhapatnam":(17.6868, 83.2185),
    # Tamil Nadu / Kerala
    "chennai":      (13.0827, 80.2707),
    "coimbatore":   (11.0168, 76.9558),
    "madurai":      (9.9252, 78.1198),
    "thiruvananthapuram": (8.5241, 76.9366),
    "kochi":        (9.9312, 76.2673),
    # Others
    "delhi":        (28.6139, 77.2090),
    "patna":        (25.5941, 85.1376),
    "ranchi":       (23.3441, 85.3096),
    "kolkata":      (22.5726, 88.3639),
    "guwahati":     (26.1445, 91.7362),
    "bhubaneswar":  (20.2961, 85.8245),
    # Hindi/Marathi city name aliases
    "कोपरगांव":    (19.8826, 74.4764),
    "अहमदनगर":    (19.0948, 74.7480),
    "नाशिक":       (19.9975, 73.7898),
    "पुणे":         (18.5204, 73.8567),
    "मुंबई":        (19.0760, 72.8777),
    "नागपूर":       (21.1458, 79.0882),
    "औरंगाबाद":    (19.8762, 75.3433),
    "जळगाव":       (21.0077, 75.5626),
    "दिल्ली":       (28.6139, 77.2090),
}

# Center of India — used only when no location is resolved
_INDIA_CENTER = (20.5937, 78.9629)


async def get_weather(
    location: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    state: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Get weather forecast using existing Open-Meteo integration.

    Location resolution order:
      1. lat + lon directly (most accurate — from device GPS)
      2. location name string → LOCATION_COORDS dict
      3. Center-of-India fallback (no useful city label)

    Args:
        location: City/district name (optional)
        latitude: GPS latitude (optional, preferred)
        longitude: GPS longitude (optional, preferred)
        state: State name for advisory context (optional)

    Returns:
        Structured response with weather data and navigation action
    """

    lat: Optional[float] = None
    lon: Optional[float] = None
    location_display: str = location or "India"
    state_for_service: str = (state or "india").lower()

    # ── Priority 1: Direct GPS coordinates ────────────────────────
    if latitude is not None and longitude is not None:
        lat = latitude
        lon = longitude
        # Use provided city name as display label; fall back to district-level coords label
        location_display = location or f"{latitude:.2f}°N {longitude:.2f}°E"
        logger.info(f"[TOOL:get_weather] Using GPS coords: lat={lat}, lon={lon}, display='{location_display}'")

    # ── Priority 2: City/district name lookup ──────────────────────
    elif location:
        location_key = location.lower().strip()
        if location_key in LOCATION_COORDS:
            lat, lon = LOCATION_COORDS[location_key]
            location_display = location
            logger.info(f"[TOOL:get_weather] Resolved '{location}' → lat={lat}, lon={lon}")
        else:
            # Unknown city name — use center-of-India as fallback
            lat, lon = _INDIA_CENTER
            location_display = location  # keep the user's city name in the label
            logger.warning(
                f"[TOOL:get_weather] Unknown location '{location}' — using center-of-India coords. "
                f"Consider adding this city to LOCATION_COORDS."
            )

    # ── Priority 3: No location at all ────────────────────────────
    else:
        lat, lon = _INDIA_CENTER
        location_display = "India"
        logger.warning("[TOOL:get_weather] No location provided — using center-of-India coords")

    logger.info(f"[TOOL:get_weather] Final: location='{location_display}', lat={lat}, lon={lon}, state='{state_for_service}'")

    try:
        # Call existing Open-Meteo integration (NO DUPLICATION)
        weather_data = await WeatherService.get_farmer_weather(
            latitude=lat,
            longitude=lon,
            location_name=location_display,
            state=state_for_service
        )

        # Extract relevant data from existing service response
        current       = weather_data.get("current", {})
        next_rain     = weather_data.get("next_rain")
        daily_forecast = weather_data.get("daily_forecast", [])
        alerts        = weather_data.get("alerts", [])
        farmer_advisory = weather_data.get("farmer_advisory", "")

        response = {
            "status": "available",
            "location": location_display,
            "current": {
                "temperature_c":       current.get("temperature_c"),
                "weather_description": current.get("weather_description"),
                "weather_icon":        current.get("weather_icon"),
                "windspeed_kmh":       current.get("windspeed_kmh"),
                "humidity_percent":    current.get("humidity_percent")
            },
            "next_rain": next_rain,
            "daily_summary": {
                "today":     daily_forecast[0] if daily_forecast else None,
                "tomorrow":  daily_forecast[1] if len(daily_forecast) > 1 else None,
                "day_after": daily_forecast[2] if len(daily_forecast) > 2 else None
            },
            "alerts": alerts,
            "farmer_advisory": farmer_advisory,
            "source": "Open-Meteo",
            "navigation": {
                "enabled":       True,
                "label":         "पूरा मौसम देखें",
                "label_english": "View full weather",
                "route":         "/weather",
                "params":        {}
            }
        }

        logger.info(
            f"[TOOL:get_weather] Success: {current.get('temperature_c')}°C, "
            f"{current.get('weather_description')} at {location_display}"
        )
        return response

    except Exception as e:
        logger.error(f"[TOOL:get_weather] Error for location='{location_display}': {e}")
        return {
            "status": "error",
            "message": f"मौसम की जानकारी प्राप्त करने में त्रुटि: {str(e)}",
            "location": location_display,
            "navigation": None
        }
