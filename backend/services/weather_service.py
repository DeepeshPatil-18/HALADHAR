"""Weather processing service with rain detection and farmer advisory"""

from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime, timedelta
from data_sources.weather_source import WeatherSource
from data_sources.sachet_source import SACHETSource
import asyncio


class WeatherService:
    """
    Processes weather data with focus on rainfall detection and farmer advisory.
    
    Key features:
    - Rain event detection (groups consecutive rainy hours)
    - Meaningful rainfall threshold filtering
    - Farmer-friendly advisory generation
    - Response caching
    """
    
    # Rain threshold: 0.5mm+ considered meaningful
    RAIN_THRESHOLD_MM = 0.5
    
    # Cache duration: 30 minutes
    CACHE_DURATION_SECONDS = 30 * 60
    
    # In-memory cache
    _cache: Dict[str, Tuple[Dict[str, Any], datetime]] = {}
    
    @staticmethod
    def _get_cache_key(latitude: float, longitude: float) -> str:
        """Generate cache key for location."""
        return f"{latitude:.4f},{longitude:.4f}"
    
    @staticmethod
    def _is_cache_valid(cached_at: datetime) -> bool:
        """Check if cached data is still valid."""
        age = datetime.utcnow() - cached_at
        return age.total_seconds() < WeatherService.CACHE_DURATION_SECONDS
    
    @staticmethod
    def _weather_code_to_icon(code: int) -> str:
        """Convert WMO weather code to emoji icon."""
        if code == 0:
            return "☀️"  # Clear sky
        elif code in [1, 2]:
            return "🌤️"  # Partly cloudy
        elif code == 3:
            return "☁️"  # Cloudy
        elif code in [45, 48]:
            return "🌫️"  # Fog
        elif code in [51, 53, 55, 56, 57]:
            return "🌦️"  # Drizzle
        elif code in [61, 63, 65, 66, 67]:
            return "🌧️"  # Rain
        elif code in [71, 73, 75, 77]:
            return "🌨️"  # Snow
        elif code in [80, 81, 82]:
            return "🌧️"  # Rain showers
        elif code in [85, 86]:
            return "🌨️"  # Snow showers
        elif code in [95, 96, 99]:
            return "⛈️"  # Thunderstorm
        else:
            return "🌤️"  # Default
    
    @staticmethod
    def _weather_code_to_hindi(code: int) -> str:
        """Convert WMO weather code to Hindi description."""
        if code == 0:
            return "साफ आसमान"
        elif code in [1, 2]:
            return "आंशिक बादल"
        elif code == 3:
            return "बादल छाए"
        elif code in [45, 48]:
            return "कोहरा"
        elif code in [51, 53, 55, 56, 57]:
            return "हल्की बारिश"
        elif code in [61, 63]:
            return "बारिश"
        elif code in [65, 66, 67]:
            return "भारी बारिश"
        elif code in [71, 73, 75, 77]:
            return "बर्फबारी"
        elif code in [80, 81, 82]:
            return "बौछार"
        elif code in [85, 86]:
            return "बर्फ की बौछार"
        elif code in [95, 96, 99]:
            return "आंधी तूफान"
        else:
            return "बदली"
    
    @staticmethod
    def _detect_rain_events(hourly_forecast: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Detect meaningful rain events by grouping consecutive rainy hours.
        
        Returns list of rain events with:
        - start_time: ISO timestamp
        - end_time: ISO timestamp
        - total_rain_mm: Total rainfall during event
        - avg_probability: Average precipitation probability
        - duration_hours: Duration in hours
        """
        events = []
        current_event = None
        
        for hour in hourly_forecast:
            rain_mm = hour.get("rain_mm") or hour.get("precipitation_mm") or 0
            precip_prob = hour.get("precipitation_probability") or 0
            
            # Check if this hour has meaningful rain
            if rain_mm >= WeatherService.RAIN_THRESHOLD_MM:
                if current_event is None:
                    # Start new rain event
                    current_event = {
                        "start_time": hour["time"],
                        "end_time": hour["time"],
                        "total_rain_mm": rain_mm,
                        "probabilities": [precip_prob],
                        "duration_hours": 1
                    }
                else:
                    # Continue existing event
                    current_event["end_time"] = hour["time"]
                    current_event["total_rain_mm"] += rain_mm
                    current_event["probabilities"].append(precip_prob)
                    current_event["duration_hours"] += 1
            else:
                # No rain - finalize current event if exists
                if current_event is not None:
                    current_event["avg_probability"] = int(
                        sum(current_event["probabilities"]) / len(current_event["probabilities"])
                    )
                    del current_event["probabilities"]
                    events.append(current_event)
                    current_event = None
        
        # Finalize last event if exists
        if current_event is not None:
            current_event["avg_probability"] = int(
                sum(current_event["probabilities"]) / len(current_event["probabilities"])
            )
            del current_event["probabilities"]
            events.append(current_event)
        
        return events
    
    @staticmethod
    def _get_next_rain_event(rain_events: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        """Get the next meaningful rain event from now."""
        now = datetime.utcnow()
        
        for event in rain_events:
            start_time = datetime.fromisoformat(event["start_time"].replace("Z", "+00:00"))
            if start_time > now:
                return event
        
        return None
    
    @staticmethod
    def _format_time_relative(iso_time: str) -> str:
        """Format time relative to now in Hindi."""
        dt = datetime.fromisoformat(iso_time.replace("Z", "+00:00"))
        now = datetime.utcnow()
        
        # Convert to IST (UTC+5:30)
        dt = dt + timedelta(hours=5, minutes=30)
        now_ist = now + timedelta(hours=5, minutes=30)
        
        # Check if today, tomorrow, or day after
        if dt.date() == now_ist.date():
            return f"आज {dt.strftime('%I %p')}"
        elif dt.date() == (now_ist + timedelta(days=1)).date():
            return f"कल {dt.strftime('%I %p')}"
        elif dt.date() == (now_ist + timedelta(days=2)).date():
            return f"परसों {dt.strftime('%I %p')}"
        else:
            # Day name in Hindi
            day_names = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"]
            return f"{day_names[dt.weekday()]} {dt.strftime('%I %p')}"
    
    @staticmethod
    def _generate_farmer_advisory(
        next_rain: Optional[Dict[str, Any]],
        daily_forecast: List[Dict[str, Any]],
        current: Dict[str, Any]
    ) -> str:
        """Generate actionable farmer advisory based on weather conditions."""
        
        # Check for upcoming rain
        if next_rain:
            total_rain = next_rain["total_rain_mm"]
            if total_rain > 20:
                return "भारी बारिश की संभावना है। खेत में पानी निकासी की व्यवस्था जांचें।"
            elif total_rain > 5:
                return "बारिश की संभावना है। सिंचाई की योजना बनाते समय इसे ध्यान में रखें।"
            else:
                return "हल्की बारिश हो सकती है। खेती के काम सामान्य रख सकते हैं।"
        
        # Check for heavy wind
        max_wind = max((d.get("max_windspeed_kmh") or 0 for d in daily_forecast[:3]), default=0)
        if max_wind > 40:
            return "तेज हवाओं की संभावना है। कमजोर सहारे और संरचनाएं जांचें।"
        
        # Check for high temperature
        current_temp = current.get("temperature_c") or 0
        if current_temp > 35:
            return "गर्मी ज्यादा है। फसलों को पर्याप्त पानी दें और मिट्टी की नमी जांचें।"
        
        # No significant weather events
        return "अगले कुछ समय में कोई बड़ी मौसम चुनौती नहीं है। खेती के काम सामान्य जारी रखें।"
    
    @staticmethod
    def _detect_weather_alerts(
        next_rain: Optional[Dict[str, Any]],
        daily_forecast: List[Dict[str, Any]]
    ) -> List[Dict[str, str]]:
        """Detect weather alerts based on forecast (fallback if SACHET unavailable)."""
        alerts = []
        
        # Heavy rain alert
        if next_rain and next_rain["total_rain_mm"] > 50:
            start_time_relative = WeatherService._format_time_relative(next_rain["start_time"])
            alerts.append({
                "type": "heavy_rain",
                "icon": "⚠️",
                "title": "भारी बारिश की संभावना",
                "description": f"{start_time_relative} से {next_rain['total_rain_mm']:.0f}mm+ बारिश हो सकती है"
            })
        
        # Strong wind alert
        for day in daily_forecast[:3]:
            max_wind = day.get("max_windspeed_kmh") or 0
            if max_wind > 40:
                alerts.append({
                    "type": "strong_wind",
                    "icon": "💨",
                    "title": "तेज हवाओं की संभावना",
                    "description": f"हवा की गति: {max_wind:.0f} km/h तक"
                })
                break
        
        return alerts
    
    @staticmethod
    async def _fetch_sachet_alerts(
        state: str = "maharashtra",
        district: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Fetch official NDMA SACHET disaster alerts.
        
        Returns formatted alerts from SACHET CAP feed.
        Falls back to empty list if SACHET is unavailable.
        """
        try:
            # Fetch SACHET alerts
            sachet_alerts = await SACHETSource.fetch_alerts(state=state, district=district)
            
            # Format for UI
            formatted_alerts = []
            for alert in sachet_alerts:
                formatted = SACHETSource.format_alert_for_ui(alert)
                formatted_alerts.append(formatted)
            
            return formatted_alerts
            
        except Exception as e:
            print(f"Error fetching SACHET alerts: {str(e)}")
            return []
    
    @staticmethod
    def _merge_alerts(
        sachet_alerts: List[Dict[str, Any]],
        forecast_alerts: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Merge SACHET official alerts with forecast-based alerts.
        
        Priority: SACHET official alerts > forecast-based alerts
        """
        # If we have SACHET alerts, prioritize them
        if sachet_alerts:
            return sachet_alerts
        
        # Otherwise use forecast-based alerts as fallback
        return forecast_alerts
    
    @classmethod
    async def get_farmer_weather(
        cls,
        latitude: float,
        longitude: float,
        location_name: str = "Kopergaon",
        state: str = "maharashtra",
        district: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get comprehensive farmer-focused weather forecast with SACHET alerts.
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            location_name: Display name for location
            state: State name for SACHET alerts (default: maharashtra)
            district: District name for filtering SACHET alerts (optional)
        
        Returns:
        - location info
        - current conditions
        - next rain event
        - hourly rainfall (today)
        - 7-day forecast
        - weather alerts (SACHET + forecast-based)
        - farmer advisory
        """
        
        # Check cache first
        cache_key = cls._get_cache_key(latitude, longitude)
        if cache_key in cls._cache:
            cached_data, cached_at = cls._cache[cache_key]
            if cls._is_cache_valid(cached_at):
                return cached_data
        
        # Fetch weather data and SACHET alerts in parallel
        weather_task = WeatherSource.fetch_weather(latitude, longitude, days=7)
        sachet_task = cls._fetch_sachet_alerts(state=state, district=district)
        
        raw_weather, sachet_alerts = await asyncio.gather(
            weather_task,
            sachet_task,
            return_exceptions=True
        )
        
        # Handle exceptions in parallel tasks
        if isinstance(raw_weather, Exception):
            raise raw_weather
        if isinstance(sachet_alerts, Exception):
            sachet_alerts = []  # Graceful degradation
        
        # Extract data
        current = raw_weather["current"]
        hourly_forecast = raw_weather["hourly_forecast"]
        daily_forecast = raw_weather["daily_forecast"]
        
        # Detect rain events
        rain_events = cls._detect_rain_events(hourly_forecast)
        next_rain = cls._get_next_rain_event(rain_events)
        
        # Generate farmer advisory
        advisory = cls._generate_farmer_advisory(next_rain, daily_forecast, current)
        
        # Detect forecast-based alerts (fallback)
        forecast_alerts = cls._detect_weather_alerts(next_rain, daily_forecast)
        
        # Merge SACHET and forecast alerts (prioritize SACHET)
        alerts = cls._merge_alerts(sachet_alerts, forecast_alerts)
        
        # Format next rain event
        next_rain_formatted = None
        if next_rain:
            start_time_relative = cls._format_time_relative(next_rain["start_time"])
            end_time_relative = cls._format_time_relative(next_rain["end_time"])
            
            next_rain_formatted = {
                "time_start": start_time_relative,
                "time_end": end_time_relative,
                "total_rain_mm": round(next_rain["total_rain_mm"], 1),
                "probability": next_rain["avg_probability"],
                "duration_hours": next_rain["duration_hours"]
            }
        
        # Get today's hourly rain (next 24 hours)
        now = datetime.utcnow()
        today_hourly = [
            {
                "time": h["time"],
                "rain_mm": round(h.get("rain_mm") or h.get("precipitation_mm") or 0, 1),
                "probability": h.get("precipitation_probability") or 0,
                "temperature_c": round(h.get("temperature_c") or 0, 1)
            }
            for h in hourly_forecast[:24]
        ]
        
        # Format 7-day forecast
        formatted_daily = []
        for day in daily_forecast:
            formatted_daily.append({
                "date": day["date"],
                "max_temp_c": round(day.get("max_temp_c") or 0, 1),
                "min_temp_c": round(day.get("min_temp_c") or 0, 1),
                "rain_mm": round(day.get("rain_sum_mm") or day.get("precipitation_sum_mm") or 0, 1),
                "rain_probability": day.get("precipitation_probability_max") or 0,
                "weather_code": day.get("weather_code") or 0,
                "weather_icon": cls._weather_code_to_icon(day.get("weather_code") or 0),
                "weather_description": cls._weather_code_to_hindi(day.get("weather_code") or 0)
            })
        
        # Current conditions
        current_formatted = {
            "temperature_c": round(current.get("temperature_c") or 0, 1),
            "weather_code": current.get("weather_code") or 0,
            "weather_icon": cls._weather_code_to_icon(current.get("weather_code") or 0),
            "weather_description": cls._weather_code_to_hindi(current.get("weather_code") or 0),
            "windspeed_kmh": round(current.get("windspeed_kmh") or 0, 1),
            "time": current.get("time")
        }
        
        # Add current humidity from first hourly entry
        if hourly_forecast:
            current_formatted["humidity_percent"] = hourly_forecast[0].get("humidity_percent") or 0
        
        # Build response
        response = {
            "location": {
                "name": location_name,
                "latitude": latitude,
                "longitude": longitude
            },
            "current": current_formatted,
            "next_rain": next_rain_formatted,
            "hourly_rain": today_hourly,
            "daily_forecast": formatted_daily,
            "alerts": alerts,
            "farmer_advisory": advisory,
            "source": "Open-Meteo",
            "cached_at": datetime.utcnow().isoformat(),
            "cache_duration_minutes": cls.CACHE_DURATION_SECONDS // 60
        }
        
        # Cache the response
        cls._cache[cache_key] = (response, datetime.utcnow())
        
        return response
