"""
AI Agent Tools for KrishiMitra
Thin adapters that wrap existing backend services for Mistral Agent function calling
"""

from .mandi_tool import mandi_tool, get_mandi_price
from .weather_tool import weather_tool, get_weather
from .schemes_tool import schemes_tool, search_schemes
from .selling_points_tool import selling_points_tool, get_selling_points

# Tool registry for Mistral Agent
ALL_TOOLS = [
    mandi_tool,
    weather_tool,
    schemes_tool,
    selling_points_tool
]

# Tool execution functions
TOOL_FUNCTIONS = {
    "get_mandi_price": get_mandi_price,
    "get_weather": get_weather,
    "search_schemes": search_schemes,
    "get_selling_points": get_selling_points
}

__all__ = [
    "ALL_TOOLS",
    "TOOL_FUNCTIONS",
    "get_mandi_price",
    "get_weather",
    "search_schemes",
    "get_selling_points"
]
