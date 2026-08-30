"""Weather data source — Open-Meteo integration"""

import httpx
from typing import Dict, Any, List
from datetime import datetime


class WeatherSource:
    """Fetches weather data from Open-Meteo API"""
    
    BASE_URL = "https://api.open-meteo.com/v1/forecast"
    
    @staticmethod
    async def fetch_weather(
        latitude: float,
        longitude: float,
        days: int = 7
    ) -> Dict[str, Any]:
        """
        Fetch comprehensive weather forecast from Open-Meteo API.
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            days: Number of forecast days (1-14)
            
        Returns:
            Dictionary containing weather forecast data with hourly and daily variables
            
        Raises:
            Exception: If API request fails
        """
        # Request comprehensive hourly and daily variables
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "hourly": ",".join([
                "temperature_2m",
                "precipitation",
                "rain",
                "precipitation_probability",
                "weathercode",
                "relativehumidity_2m",
                "windspeed_10m",
                "windgusts_10m"
            ]),
            "daily": ",".join([
                "temperature_2m_max",
                "temperature_2m_min",
                "precipitation_sum",
                "rain_sum",
                "precipitation_probability_max",
                "precipitation_hours",
                "weathercode",
                "windspeed_10m_max",
                "windgusts_10m_max"
            ]),
            "current_weather": "true",
            "timezone": "Asia/Kolkata",
            "forecast_days": min(days, 14)
        }
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(WeatherSource.BASE_URL, params=params)
            response.raise_for_status()
            data = response.json()
            
            # Parse current weather
            current = data.get("current_weather", {})
            
            # Parse hourly data
            hourly = data.get("hourly", {})
            hourly_forecast = []
            if hourly:
                times = hourly.get("time", [])
                temps = hourly.get("temperature_2m", [])
                precip = hourly.get("precipitation", [])
                rain = hourly.get("rain", [])
                precip_prob = hourly.get("precipitation_probability", [])
                weather_codes = hourly.get("weathercode", [])
                humidity = hourly.get("relativehumidity_2m", [])
                windspeed = hourly.get("windspeed_10m", [])
                windgusts = hourly.get("windgusts_10m", [])
                
                for i in range(len(times)):
                    hourly_forecast.append({
                        "time": times[i],
                        "temperature_c": temps[i] if i < len(temps) else None,
                        "precipitation_mm": precip[i] if i < len(precip) else None,
                        "rain_mm": rain[i] if i < len(rain) else None,
                        "precipitation_probability": precip_prob[i] if i < len(precip_prob) else None,
                        "weather_code": weather_codes[i] if i < len(weather_codes) else None,
                        "humidity_percent": humidity[i] if i < len(humidity) else None,
                        "windspeed_kmh": windspeed[i] if i < len(windspeed) else None,
                        "windgusts_kmh": windgusts[i] if i < len(windgusts) else None
                    })
            
            # Parse daily data
            daily = data.get("daily", {})
            daily_forecast = []
            if daily:
                dates = daily.get("time", [])
                max_temps = daily.get("temperature_2m_max", [])
                min_temps = daily.get("temperature_2m_min", [])
                precip_sum = daily.get("precipitation_sum", [])
                rain_sum = daily.get("rain_sum", [])
                precip_prob_max = daily.get("precipitation_probability_max", [])
                precip_hours = daily.get("precipitation_hours", [])
                weather_codes = daily.get("weathercode", [])
                windspeed_max = daily.get("windspeed_10m_max", [])
                windgusts_max = daily.get("windgusts_10m_max", [])
                
                for i in range(len(dates)):
                    daily_forecast.append({
                        "date": dates[i],
                        "max_temp_c": max_temps[i] if i < len(max_temps) else None,
                        "min_temp_c": min_temps[i] if i < len(min_temps) else None,
                        "precipitation_sum_mm": precip_sum[i] if i < len(precip_sum) else None,
                        "rain_sum_mm": rain_sum[i] if i < len(rain_sum) else None,
                        "precipitation_probability_max": precip_prob_max[i] if i < len(precip_prob_max) else None,
                        "precipitation_hours": precip_hours[i] if i < len(precip_hours) else None,
                        "weather_code": weather_codes[i] if i < len(weather_codes) else None,
                        "max_windspeed_kmh": windspeed_max[i] if i < len(windspeed_max) else None,
                        "max_windgusts_kmh": windgusts_max[i] if i < len(windgusts_max) else None
                    })
            
            return {
                "location": {
                    "latitude": latitude,
                    "longitude": longitude
                },
                "current": {
                    "temperature_c": current.get("temperature"),
                    "windspeed_kmh": current.get("windspeed"),
                    "weather_code": current.get("weathercode"),
                    "time": current.get("time")
                },
                "hourly_forecast": hourly_forecast,
                "daily_forecast": daily_forecast,
                "source": "Open-Meteo",
                "fetched_at": datetime.utcnow().isoformat()
            }
