"""
Test script to verify Mistral 429 rate limit fallback works correctly
"""
import asyncio
import sys
from services.ai.orchestrator import ai_orchestrator

async def test_fallback():
    """Test that rate limit errors return fallback response"""
    
    # Temporarily break the Mistral API key to force a 429-like error
    original_key = ai_orchestrator.mistral.api_key
    ai_orchestrator.mistral.api_key = "invalid_key_to_test_fallback"
    
    try:
        print("Testing rate limit fallback with invalid API key...")
        print("=" * 60)
        
        result = await ai_orchestrator.generate_response(
            message="नमस्कार",
            language="hi",
            context=None
        )
        
        print(f"Success: {result.get('success')}")
        print(f"Response text: {result.get('response_text')[:100]}...")
        print(f"Provider: {result.get('provider')}")
        
        if result.get('success') and '1800-180-1551' in result.get('response_text', ''):
            print("\n✅ PASS: Fallback mechanism works correctly!")
            print("   - Returns success=True")
            print("   - Provides fallback message with helpline")
            return True
        else:
            print("\n❌ FAIL: Fallback mechanism did not work")
            print(f"   - Result: {result}")
            return False
            
    finally:
        # Restore original key
        ai_orchestrator.mistral.api_key = original_key

if __name__ == "__main__":
    result = asyncio.run(test_fallback())
    sys.exit(0 if result else 1)
