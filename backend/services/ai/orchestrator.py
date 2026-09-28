"""
AI Orchestrator for KrishiMitra
Coordinates AI providers, conversation management, context, and tool calling
"""

import os
import logging
from typing import Dict, Any, Optional, List, Callable
from .providers import AIProvider, MistralProvider, KisanSLMProvider
from .conversation import conversation_manager
from .tools import ALL_TOOLS, TOOL_FUNCTIONS

logger = logging.getLogger(__name__)


class AIOrchestrator:
    """
    Central orchestrator for AI operations
    
    Responsibilities:
    - Select appropriate AI provider
    - Manage conversation context
    - Coordinate between different AI services
    """
    
    def __init__(self):
        # Initialize providers
        self.mistral = MistralProvider()
        self.kisan_slm = KisanSLMProvider()
        
        # Default provider
        self.default_provider = "mistral"
        
        # Conversation manager
        self.conversation_manager = conversation_manager
        
        # Tools registry
        self.tools = ALL_TOOLS
        self.tool_functions = TOOL_FUNCTIONS

        # Default (no-location) tool executor — will be replaced per-request
        self.tool_executor = self._create_tool_executor()
    
    def _create_tool_executor(self, location_context: Optional[Dict[str, Any]] = None) -> Callable:
        """
        Create async tool executor function for Mistral provider.

        The executor automatically enriches tool arguments with location fields
        (state, district, latitude, longitude) from the current request's location
        context when the tool accepts those parameters and the agent hasn't already
        provided them.

        Args:
            location_context: Location dict from the current user request
                              (city, district, state, latitude, longitude, …)

        Returns:
            Async function that executes tool calls
        """
        # Snapshot location at executor-creation time so it is request-scoped
        loc = location_context or {}

        async def execute_tool(function_name: str, function_args: Dict[str, Any]) -> Dict[str, Any]:
            """
            Execute a tool function by name with given arguments.

            Automatically fills in location params (state, district, latitude,
            longitude) from the request-level location context when the tool
            accepts those params and the agent hasn't supplied them explicitly.

            Args:
                function_name: Name of the tool function
                function_args: Arguments supplied by the Mistral Agent

            Returns:
                Tool execution result
            """
            logger.info(f"[ORCHESTRATOR:TOOL] Executing {function_name} with args: {function_args}")

            if function_name not in self.tool_functions:
                logger.error(f"[ORCHESTRATOR:TOOL] Unknown tool: {function_name}")
                return {
                    "status": "error",
                    "message": f"Unknown tool: {function_name}"
                }

            # ── Location enrichment ──────────────────────────────────────
            # Enrich args with location context for location-aware tools.
            # We only fill missing args — if the agent already passed a value
            # we keep it (the agent may have extracted location from the text).
            enriched_args = dict(function_args)

            if loc:
                if function_name == "get_weather":
                    # Prefer GPS coords; fall back to city name
                    if "latitude" not in enriched_args and loc.get("latitude") and loc["latitude"] != 0:
                        enriched_args["latitude"] = loc["latitude"]
                    if "longitude" not in enriched_args and loc.get("longitude") and loc["longitude"] != 0:
                        enriched_args["longitude"] = loc["longitude"]
                    if "state" not in enriched_args and loc.get("state"):
                        enriched_args["state"] = loc["state"]
                    if "location" not in enriched_args:
                        # Use city, then district as the display name
                        city_label = loc.get("city") or loc.get("district")
                        if city_label:
                            enriched_args["location"] = city_label

                elif function_name == "get_mandi_price":
                    if "state" not in enriched_args and loc.get("state"):
                        enriched_args["state"] = loc["state"]
                    if "district" not in enriched_args and loc.get("district"):
                        enriched_args["district"] = loc["district"]

                elif function_name == "get_selling_points":
                    if "state" not in enriched_args and loc.get("state"):
                        enriched_args["state"] = loc["state"]
                    if "district" not in enriched_args and loc.get("district"):
                        enriched_args["district"] = loc["district"]
                    if "latitude" not in enriched_args and loc.get("latitude") and loc["latitude"] != 0:
                        enriched_args["latitude"] = loc["latitude"]
                    if "longitude" not in enriched_args and loc.get("longitude") and loc["longitude"] != 0:
                        enriched_args["longitude"] = loc["longitude"]

            if enriched_args != function_args:
                logger.info(
                    f"[ORCHESTRATOR:TOOL] Location-enriched args for {function_name}: "
                    f"{enriched_args}"
                )

            try:
                tool_func = self.tool_functions[function_name]
                result = await tool_func(**enriched_args)

                logger.info(f"[ORCHESTRATOR:TOOL] Tool {function_name} returned status: {result.get('status')}")
                return result

            except Exception as e:
                logger.error(f"[ORCHESTRATOR:TOOL] Tool {function_name} error: {e}")
                return {
                    "status": "error",
                    "message": f"Tool execution error: {str(e)}"
                }

        return execute_tool
    
    def get_provider(self, provider_name: Optional[str] = None) -> AIProvider:
        """
        Get AI provider instance
        
        Args:
            provider_name: "mistral" or "kisan_slm". If None, uses default.
            
        Returns:
            AIProvider instance
        """
        if provider_name is None:
            provider_name = self.default_provider
        
        if provider_name == "mistral":
            if not self.mistral.is_available():
                raise ValueError("Mistral provider is not configured. Please set MISTRAL_API_KEY.")
            return self.mistral
        
        elif provider_name == "kisan_slm":
            if not self.kisan_slm.is_available():
                raise ValueError("Kisan SLM provider is not yet available.")
            return self.kisan_slm
        
        else:
            raise ValueError(f"Unknown provider: {provider_name}")
    
    async def generate_response(
        self,
        message: str,
        conversation_id: Optional[str] = None,
        language: str = "hi",
        context: Optional[Dict[str, Any]] = None,
        provider_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate AI response for a message
        
        Args:
            message: User's input message
            conversation_id: Conversation ID (creates new if None)
            language: Language code (hi, mr, en)
            context: Additional context (location, weather, etc.)
            provider_name: AI provider to use
            
        Returns:
            Dictionary with response_text, conversation_id, and metadata
        """
        
        # Create or get conversation
        if conversation_id is None:
            conversation_id = self.conversation_manager.create_conversation(
                language=language
            )
        
        # Get conversation history
        conversation_history = self.conversation_manager.get_conversation_history(
            conversation_id,
            limit=20  # Last 20 messages for context
        )
        
        # Get AI provider
        provider = self.get_provider(provider_name)

        # Build a per-request tool executor scoped to this request's location context.
        # This ensures tools like get_weather and get_mandi_price automatically receive
        # the farmer's GPS/district/state without the agent having to extract it from text.
        request_tool_executor = self._create_tool_executor(context) if context else self.tool_executor

        # Log location debug info
        if context:
            logger.info(
                f"[ORCHESTRATOR] Location context: "
                f"city={context.get('city')}, district={context.get('district')}, "
                f"state={context.get('state')}, "
                f"lat={context.get('latitude')}, lon={context.get('longitude')}, "
                f"source={context.get('source')}"
            )
        else:
            logger.info("[ORCHESTRATOR] No location context provided")

        # Generate response with tool calling support
        try:
            # Determine if tools should be provided
            # For now, always provide tools to Mistral Agent
            tools = self.tools if provider_name == "mistral" or provider_name is None else None
            tool_executor = request_tool_executor if tools else None
            
            if tools:
                logger.info(f"[ORCHESTRATOR] Providing {len(tools)} tools to {provider.get_provider_name()}")
            
            # Generate response (may include tool calls)
            try:
                response_text = await provider.generate_response(
                    message=message,
                    conversation_history=conversation_history,
                    language=language,
                    context=context,
                    tools=tools,
                    tool_executor=tool_executor
                )
            except Exception as provider_error:
                error_msg = str(provider_error)
                logger.warning(f"[ORCHESTRATOR] Provider error: {error_msg}")
                
                # If rate limit or API error, use placeholder response
                if "rate limit" in error_msg.lower() or "429" in error_msg:
                    logger.info("[ORCHESTRATOR] Using placeholder response due to rate limit")
                    # Import placeholder response method
                    if hasattr(provider, '_placeholder_response'):
                        response_text = await provider._placeholder_response(message, language, context)
                    else:
                        # Generic fallback
                        response_text = "मुझे खेद है, मैं अभी अस्थायी रूप से अनुपलब्ध हूं। कृपया कुछ समय बाद पुनः प्रयास करें। तत्काल सहायता के लिए कृषि हेल्पलाइन 1800-180-1551 पर संपर्क करें।"
                else:
                    raise provider_error
            
            # LOG: Orchestrator received response
            logger.info(f"[ORCHESTRATOR] Received final response from {provider.get_provider_name()}")
            logger.info(f"[ORCHESTRATOR] Response type: {type(response_text)}, length: {len(response_text) if response_text else 0}")
            
            # Validate response
            if not response_text:
                logger.error(f"[ORCHESTRATOR] Provider {provider.get_provider_name()} returned empty/None response")
                raise Exception(f"Provider {provider.get_provider_name()} returned empty response")
            
            # Store messages in conversation
            self.conversation_manager.add_message(
                conversation_id=conversation_id,
                role="user",
                content=message,
                message_type="text"
            )
            
            self.conversation_manager.add_message(
                conversation_id=conversation_id,
                role="assistant",
                content=response_text,
                message_type="text"
            )
            
            # Return response without navigation (routes will extract navigation from context)
            return {
                "success": True,
                "response_text": response_text,
                "conversation_id": conversation_id,
                "provider": provider.get_provider_name(),
                "language": language
            }
            
        except Exception as e:
            # Log and return error response
            logger.error(f"[ORCHESTRATOR] Error generating response: {e}")
            return {
                "success": False,
                "error": str(e),
                "conversation_id": conversation_id,
                "provider": provider.get_provider_name() if provider else "unknown"
            }
    
    def get_conversation(self, conversation_id: str) -> Dict[str, Any]:
        """
        Get full conversation details
        """
        messages = self.conversation_manager.get_full_conversation(conversation_id)
        metadata = self.conversation_manager.get_conversation_metadata(conversation_id)
        
        return {
            "conversation_id": conversation_id,
            "messages": messages,
            "metadata": metadata
        }
    
    def create_conversation(
        self,
        language: str = "hi",
        user_id: Optional[str] = None
    ) -> str:
        """Create a new conversation"""
        return self.conversation_manager.create_conversation(
            language=language,
            user_id=user_id
        )
    
    def delete_conversation(self, conversation_id: str) -> bool:
        """Delete a conversation"""
        return self.conversation_manager.delete_conversation(conversation_id)


# Global orchestrator instance
ai_orchestrator = AIOrchestrator()
