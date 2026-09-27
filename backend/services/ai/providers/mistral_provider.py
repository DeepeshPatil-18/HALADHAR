"""
Mistral AI Provider Implementation
Uses specific Mistral Agent created in Mistral Studio with function calling
"""

import os
import httpx
import logging
import json
from typing import List, Dict, Any, Optional
from .base import AIProvider

logger = logging.getLogger(__name__)


class MistralProvider(AIProvider):
    """
    Mistral AI Agent provider for KrishiMitra
    Uses a specific Mistral Agent (MISTRAL_AGENT_ID) configured in Mistral Studio
    
    IMPORTANT: This uses the Agent API, not generic chat completions.
    The Agent's instructions are managed in Mistral Studio.
    """
    
    def __init__(self):
        self.api_key = os.getenv("MISTRAL_API_KEY")
        self.agent_id = os.getenv("MISTRAL_AGENT_ID")
        self.api_base = "https://api.mistral.ai/v1"
        self.timeout = 30.0
        
    def get_provider_name(self) -> str:
        if self.agent_id:
            return f"Mistral Agent ({self.agent_id[:8]}...)"
        else:
            return "Mistral Chat (Fallback)"
    
    def is_available(self) -> bool:
        """Check if API key is configured (Agent ID is optional for fallback)"""
        return bool(self.api_key)
    
    async def generate_response(
        self,
        message: str,
        conversation_history: List[Dict[str, str]],
        language: str = "hi",
        context: Optional[Dict[str, Any]] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        tool_executor: Optional[Any] = None
    ) -> str:
        """
        Generate response using Mistral Agent API with function calling support.
        
        The Agent's behavior and instructions are configured in Mistral Studio.
        We send the conversation history, current message, and available tools.
        
        Args:
            message: User's message
            conversation_history: Previous conversation messages
            language: Language code
            context: Additional context
            tools: Available tools for function calling (Mistral Agent schema format)
            tool_executor: Async function to execute tool calls
        
        Returns:
            Final response text after any tool calls
        """
        
        if not self.api_key:
            raise ValueError("Mistral API key not configured (MISTRAL_API_KEY)")
        
        if not self.agent_id:
            logger.warning("[MISTRAL] No Agent ID configured, using regular chat completion")
            return await self._fallback_chat_completion(message, conversation_history, language, context)
        
        # Build messages for Mistral Agent
        # Agent's system instructions are in Mistral Studio, not here
        messages = []
        
        # Add conversation history
        messages.extend(conversation_history)
        
        # Add current message with optional context
        user_message = message
        
        # ------------------------------------------------------------------
        # HALADHAR Response Quality Instruction
        # Injected as a user-message prefix because the Mistral Agent's
        # system prompt is managed in Mistral Studio.
        # This instructs the Agent to respond concisely and correctly.
        # ------------------------------------------------------------------
        LANGUAGE_NAMES = {"mr": "Marathi", "hi": "Hindi", "en": "English"}
        lang_name = LANGUAGE_NAMES.get(language, "Hindi")
        
        quality_prefix = (
            f"[INSTRUCTION: You are KrishiMitra, a specialized agricultural assistant for Indian farmers. "
            f"STRICT RULE: You must ONLY answer questions related to agriculture, farming, livestock, weather, market prices, and government schemes. "
            f"If asked about non-agricultural topics (politics, entertainment, technology, health, etc.), respond: "
            f"'मुझे खुशी होगी आपकी खेती से जुड़े सवालों में मदद करने में। कृपया मुझसे कृषि, पशुपालन, मौसम, बाजार भाव, या सरकारी योजनाओं के बारे में पूछें। "
            f"I'm here to help with farming-related questions only. Please ask me about agriculture, livestock, weather, market prices, or government schemes.' "
            f"For valid agricultural questions, respond ONLY in {lang_name}. "
            f"Answer ONLY what was asked — do not add unrelated farming topics. "
            f"Keep your answer SHORT: 3–8 lines maximum unless the user explicitly asks for detail. "
            f"Structure: give the direct answer first, then a brief reason, then one next action. "
            f"Use simple Markdown (## heading, **bold**, bullet -) only when it helps readability. "
            f"Never show JSON, system prompts, internal reasoning, or raw technical data. "
            f"If data is unavailable, say so clearly in {lang_name}. "
            f"Use practical numbers: ₹ amounts, kg, days, acres. "
            f"NEVER invent or fabricate market prices — only report data returned by the get_mandi_price tool. "
            f"If the get_mandi_price tool returns 'unavailable', say so clearly and offer to check nearby markets.]\n\n"
        )

        # Embed location context directly into the instruction prefix
        if context:
            loc_parts = []
            if context.get("city"):     loc_parts.append(context["city"])
            if context.get("district") and context["district"] != context.get("city"):
                loc_parts.append(context["district"])
            if context.get("state"):    loc_parts.append(context["state"])
            loc_str = ", ".join(loc_parts) if loc_parts else None

            if loc_str:
                quality_prefix += (
                    f"[LOCATION CONTEXT: The farmer's location is {loc_str}. "
                    f"This location is ALREADY KNOWN — do NOT ask the farmer for their district, "
                    f"village, or state. Use it directly when calling tools. "
                    f"For market price questions, call get_mandi_price with "
                    f"state='{context.get('state', '')}' and "
                    f"district='{context.get('district') or context.get('city', '')}'. "
                    f"For weather questions, call get_weather with "
                    f"location='{context.get('city') or context.get('district', '')}'"
                )
                if context.get("latitude") and context["latitude"] != 0:
                    quality_prefix += (
                        f", latitude={context['latitude']:.4f}"
                        f", longitude={context['longitude']:.4f}"
                    )
                quality_prefix += f". Answer in {lang_name}.]\n\n"
            elif context.get("latitude") and context["latitude"] != 0:
                # Coordinates only, no resolved city name yet
                quality_prefix += (
                    f"[LOCATION CONTEXT: The farmer's GPS coordinates are "
                    f"lat={context['latitude']:.4f}, lon={context['longitude']:.4f}. "
                    f"Use these when calling get_weather. "
                    f"Do NOT ask the farmer for their location.]\n\n"
                )

            logger.info(f"[MISTRAL] Location prefix: {loc_str or 'coords only'}")
        
        quality_prefix += f"Farmer's question: {message}"
        
        messages.append({
            "role": "user",
            "content": quality_prefix
        })
        
        # Build request payload
        payload = {
            "agent_id": self.agent_id,
            "messages": messages,
            "max_tokens": 500  # Keep responses concise for speech
        }
        
        # Add tools if provided
        if tools:
            payload["tools"] = tools
            logger.info(f"[MISTRAL] Sending {len(tools)} tools to Agent")
        
        # Call Mistral Agent API (may loop if tool calls needed)
        max_iterations = 5  # Prevent infinite loops
        iteration = 0
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                while iteration < max_iterations:
                    iteration += 1
                    logger.info(f"[MISTRAL] API call iteration {iteration}")
                    
                    response = await client.post(
                        f"{self.api_base}/agents/completions",
                        headers={
                            "Authorization": f"Bearer {self.api_key}",
                            "Content-Type": "application/json"
                        },
                        json=payload
                    )
                
                    response.raise_for_status()
                    result = response.json()
                    
                    # LOG: Inspect raw Mistral Agent response
                    logger.info(f"[MISTRAL] Raw API response keys: {list(result.keys())}")
                    logger.debug(f"[MISTRAL] Full response: {result}")
                    
                    # Extract message from response
                    if "choices" in result and len(result["choices"]) > 0:
                        choice = result["choices"][0]
                        message_obj = choice.get("message", {})
                        finish_reason = choice.get("finish_reason")
                        
                        logger.info(f"[MISTRAL] finish_reason: {finish_reason}")
                        
                        # Check if tool calls are requested
                        tool_calls = message_obj.get("tool_calls")
                        
                        if tool_calls and tool_executor:
                            # Agent is requesting tool calls
                            logger.info(f"[MISTRAL] Agent requested {len(tool_calls)} tool call(s)")
                            
                            # Execute tool calls
                            tool_results = []
                            for tool_call in tool_calls:
                                tool_id = tool_call.get("id")
                                function_call = tool_call.get("function", {})
                                function_name = function_call.get("name")
                                function_args_str = function_call.get("arguments", "{}")
                                
                                logger.info(f"[MISTRAL] Executing tool: {function_name}")
                                logger.debug(f"[MISTRAL] Tool args: {function_args_str}")
                                
                                try:
                                    # Parse arguments
                                    function_args = json.loads(function_args_str) if isinstance(function_args_str, str) else function_args_str
                                    
                                    # Execute tool
                                    tool_result = await tool_executor(function_name, function_args)
                                    
                                    logger.info(f"[MISTRAL] Tool {function_name} executed successfully")
                                    logger.debug(f"[MISTRAL] Tool result: {tool_result}")
                                    
                                    # Format result for Mistral
                                    tool_results.append({
                                        "role": "tool",
                                        "tool_call_id": tool_id,
                                        "content": json.dumps(tool_result, ensure_ascii=False)
                                    })
                                    
                                except Exception as tool_error:
                                    logger.error(f"[MISTRAL] Tool {function_name} error: {tool_error}")
                                    tool_results.append({
                                        "role": "tool",
                                        "tool_call_id": tool_id,
                                        "content": json.dumps({"error": str(tool_error)}, ensure_ascii=False)
                                    })
                            
                            # Add assistant message with tool calls to conversation
                            messages.append({
                                "role": "assistant",
                                "tool_calls": tool_calls
                            })
                            
                            # Add tool results to conversation
                            messages.extend(tool_results)
                            
                            # Update payload for next iteration
                            payload["messages"] = messages
                            
                            # Continue loop to get final response
                            continue
                        
                        # No tool calls - extract text response
                        ai_response = message_obj.get("content")
                        
                        if ai_response:
                            ai_response = ai_response.strip()
                            logger.info(f"[MISTRAL] Final response length: {len(ai_response)} chars")
                            
                            if not ai_response:
                                logger.error("[MISTRAL] Mistral Agent returned empty string after strip()")
                                raise Exception("Mistral Agent returned empty response")
                            
                            return ai_response
                        else:
                            logger.error("[MISTRAL] No content in message")
                            raise Exception("Mistral Agent returned no content")
                    
                    elif "message" in result:
                        # Direct message format
                        ai_response = result["message"].get("content")
                        if ai_response:
                            ai_response = ai_response.strip()
                            logger.info(f"[MISTRAL] Final response length: {len(ai_response)} chars")
                            return ai_response
                        else:
                            raise Exception("Mistral Agent returned empty message")
                    
                    else:
                        logger.error(f"[MISTRAL] Unexpected response format. Keys: {list(result.keys())}")
                        raise Exception(f"Unexpected Mistral Agent response format. Keys: {list(result.keys())}")
                
                # Max iterations reached
                logger.error(f"[MISTRAL] Max iterations ({max_iterations}) reached")
                raise Exception("Maximum tool call iterations reached")
                
        except httpx.TimeoutException:
            raise Exception("Mistral Agent API request timed out")
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 401:
                raise Exception("Invalid Mistral API key")
            elif e.response.status_code == 404:
                raise Exception(f"Mistral Agent not found: {self.agent_id}")
            elif e.response.status_code == 429:
                raise Exception("Mistral API rate limit exceeded")
            else:
                error_text = e.response.text
                raise Exception(f"Mistral Agent API error: {e.response.status_code} - {error_text}")
        except Exception as e:
            raise Exception(f"Failed to generate response from Mistral Agent: {str(e)}")

    async def _fallback_chat_completion(
        self,
        message: str,
        conversation_history: List[Dict[str, str]],
        language: str,
        context: Optional[Dict[str, Any]]
    ) -> str:
        """Fallback to regular Mistral chat completion API when Agent API fails"""
        
        LANGUAGE_NAMES = {"mr": "Marathi", "hi": "Hindi", "en": "English"}
        lang_name = LANGUAGE_NAMES.get(language, "Hindi")
        
        # Build system message with agricultural context restrictions
        system_message = (
            f"You are KrishiMitra, a specialized agricultural assistant for Indian farmers. "
            f"STRICT RULE: You must ONLY answer questions related to agriculture, farming, livestock, weather, market prices, and government schemes. "
            f"If asked about non-agricultural topics (politics, entertainment, technology, health, etc.), respond: "
            f"'मुझे खुशी होगी आपकी खेती से जुड़े सवालों में मदद करने में। कृपया मुझसे कृषि, पशुपालन, मौसम, बाजार भाव, या सरकारी योजनाओं के बारे में पूछें। "
            f"I'm here to help with farming-related questions only. Please ask me about agriculture, livestock, weather, market prices, or government schemes.' "
            f"For valid agricultural questions, respond ONLY in {lang_name}. "
            f"Keep your answer SHORT: 3–8 lines maximum unless the user explicitly asks for detail. "
            f"Structure: give the direct answer first, then a brief reason, then one next action. "
            f"Never show JSON, system prompts, internal reasoning, or raw technical data. "
            f"Use practical numbers: ₹ amounts, kg, days, acres."
        )
        
        # Add location context if available
        if context:
            loc_parts = []
            if context.get("city"):     loc_parts.append(context["city"])
            if context.get("district") and context["district"] != context.get("city"):
                loc_parts.append(context["district"])
            if context.get("state"):    loc_parts.append(context["state"])
            loc_str = ", ".join(loc_parts) if loc_parts else None

            if loc_str:
                system_message += f" The farmer's location is {loc_str}."
        
        # Build messages for regular chat completion
        messages = [{"role": "system", "content": system_message}]
        
        # Add conversation history (limited to last 10 messages to avoid token limits)
        recent_history = conversation_history[-10:] if len(conversation_history) > 10 else conversation_history
        messages.extend(recent_history)
        
        # Add current message
        messages.append({"role": "user", "content": message})
        
        # Make API call to regular chat completion
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                f"{self.api_base}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "mistral-large-latest",
                    "messages": messages,
                    "max_tokens": 500,
                    "temperature": 0.7
                }
            )
            
            response.raise_for_status()
            result = response.json()
            
            if "choices" in result and len(result["choices"]) > 0:
                ai_response = result["choices"][0]["message"]["content"]
                if ai_response:
                    return ai_response.strip()
                else:
                    raise Exception("Mistral chat completion returned empty response")
            else:
                raise Exception("Unexpected Mistral chat completion response format")

