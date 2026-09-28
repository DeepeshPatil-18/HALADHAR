"""
Quick test script to check if Sarvam API key is working
"""
import httpx
import asyncio

async def test_sarvam_key():
    api_key = "sk_axazbxdv_fBgxtCwIImUfdBgpwvRdKCcR"
    
    # Test the Sarvam API
    headers = {
        "api-subscription-key": api_key,
        "Content-Type": "application/json"
    }
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Try a simple endpoint (this might vary based on Sarvam's API)
            response = await client.get(
                "https://api.sarvam.ai/",
                headers=headers
            )
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text[:200]}")
            
            if response.status_code == 200:
                print("✅ API Key is VALID and working!")
                return True
            elif response.status_code == 401:
                print("❌ API Key is INVALID or expired")
                return False
            else:
                print(f"⚠️ Unexpected status: {response.status_code}")
                return False
                
    except Exception as e:
        print(f"❌ Error testing API key: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_sarvam_key())
