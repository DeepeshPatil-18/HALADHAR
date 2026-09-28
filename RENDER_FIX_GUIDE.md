# Render Production Issues - Fix Guide

## Current Issues

### 1. ❌ AI Returning Placeholder Responses Instead of Real Answers
**Symptom:** Every question gets generic "KrishiMitra Assistance" response with "AI service is temporarily limited"

**Root Cause:** Mistral Agent API is not working - either:
- Agent ID `ag_01a0e4287799724cba04f2bfcb235ce8` doesn't exist or was deleted
- Mistral API key is invalid
- Agent ID environment variable not set correctly on Render

**Logs to Check:**
```
[MISTRAL] No Agent ID configured, using regular chat completion
[MISTRAL] Fallback chat completion failed: ...
```

**Fix Steps:**
1. **Verify Mistral Agent exists:**
   - Go to: https://console.mistral.ai/
   - Login with your Mistral account
   - Navigate to "Agents" section
   - Check if Agent ID `ag_01a0e4287799724cba04f2bfcb235ce8` exists
   - If not, you need to create a new Agent specifically for KrishiMitra

2. **Create New Mistral Agent (if needed):**
   - Go to Mistral Console → Agents → Create New Agent
   - Name: "KrishiMitra Agricultural Assistant"
   - Model: Choose `mistral-large-latest` or `mistral-medium-latest`
   - System Instructions: (Paste the agricultural assistant instructions)
   - Enable Function Calling
   - Save and copy the new Agent ID

3. **Update Render Environment Variables:**
   - Go to: https://dashboard.render.com
   - Service: haladhar
   - Settings → Environment
   - Update or add:
     ```
     MISTRAL_AGENT_ID=ag_<your_new_agent_id>
     MISTRAL_API_KEY=mstrl_<your_api_key>
     ```
   - Click "Save Changes" (this will trigger auto-redeploy)

4. **Verify After Deploy:**
   - Check Render logs for:
     ```
     ✓ AI Orchestrator loaded
       - Mistral available: True
     ```
   - Test chat: Send "नमस्कार" - should get real response, not placeholder

---

### 2. ❌ Sarvam TTS Voice Error
**Symptom:** 
```
Speech synthesis failed: Sarvam TTS error: 400 - 
{"error":{"message":"Validation Error(s):\n- model: Input should be 'bulbul:v2', 'bulbul:v3-beta', 'bulbul:v3' or 'bulbul:v4-flash'"}}
```

**Root Cause:** The `SARVAM_TTS_MODEL` environment variable on Render is either:
- Not set (unlikely, as default is `bulbul:v3`)
- Set to an incorrect value like `bulbul:v3-beta` (old syntax)
- Being overridden somewhere

**Fix Steps:**

1. **Check Render Environment Variables:**
   - Go to: https://dashboard.render.com
   - Service: haladhar
   - Settings → Environment
   - Look for `SARVAM_TTS_MODEL`

2. **Set Correct Value:**
   ```
   SARVAM_TTS_MODEL=bulbul:v3
   ```
   (Note: NO `-beta` suffix, just `bulbul:v3`)

3. **Optional Models (choose ONE):**
   - `bulbul:v2` - Older version
   - `bulbul:v3` - **RECOMMENDED** (best quality)
   - `bulbul:v4-flash` - Faster but may have quality tradeoff

4. **Also Verify These:**
   ```
   SARVAM_API_KEY=sk_axazbxdv_fBgxtCwIImUfdBgpwvRdKCcR
   SARVAM_STT_MODEL=saaras:v3
   SARVAM_TTS_SPEAKER=shubh
   ```

5. **Save and Redeploy**

6. **Test Voice:**
   - Send a message in the chat
   - Click the voice/speaker icon
   - Should synthesize speech without errors

---

### 3. ❌ Remove "AI service is temporarily limited" Message

**Location:** This message is in the `_placeholder_response` method

**Files to Update:**
- `backend/services/ai/providers/mistral_provider.py`

**Change:** Remove or modify the generic placeholder response to be more helpful

---

## Complete Render Environment Variables Checklist

```bash
# Supabase
SUPABASE_URL=https://zlujxzsuqmzfmwermwap.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Mappls
MAPPLS_ACCESS_TOKEN=hcpflekjwzdubcfnryyhbzmxqhhuyxjfxmwo

# Mistral AI (CRITICAL - VERIFY THESE)
MISTRAL_API_KEY=mstrl_QvYWYGXykENawCxbSE1WSrtQYlPE72WY_3BBlfa
MISTRAL_AGENT_ID=ag_01a0e4287799724cba04f2bfcb235ce8

# Sarvam AI (CRITICAL - VERIFY MODEL NAME)
SARVAM_API_KEY=sk_axazbxdv_fBgxtCwIImUfdBgpwvRdKCcR
SARVAM_STT_MODEL=saaras:v3
SARVAM_TTS_MODEL=bulbul:v3
SARVAM_TTS_SPEAKER=shubh

# Python Version
PYTHON_VERSION=3.11.9
```

---

## Debugging Steps

### Check Render Logs After Deploy:
```
2026-09-29 XX:XX:XX - KrishiMitra Backend Starting Up
2026-09-29 XX:XX:XX - ✓ Cleared XX __pycache__ directories
2026-09-29 XX:XX:XX - Git commit: d8479b7 - fix(production): resolve...
2026-09-29 XX:XX:XX - MISTRAL_API_KEY: ✓ Set
2026-09-29 XX:XX:XX - MISTRAL_AGENT_ID: ag_01a0e4287799724cba04f2bfcb235ce8
2026-09-29 XX:XX:XX - SARVAM_API_KEY: ✓ Set
2026-09-29 XX:XX:XX - SARVAM_TTS_MODEL: bulbul:v3
2026-09-29 XX:XX:XX - ✓ AI Orchestrator loaded
2026-09-29 XX:XX:XX -   - Mistral available: True
```

### Test Endpoints:
1. **Health:** `https://haladhar.onrender.com/health`
2. **Chat:** POST to `https://haladhar.onrender.com/api/v1/ai/chat`
   ```json
   {
     "message": "what is crop cost in nashik of onion",
     "language": "english"
   }
   ```
   Expected: Real answer about onion prices, NOT placeholder response

3. **Voice:** Test TTS by sending chat message and requesting audio

---

## Priority Order:
1. **Fix Mistral Agent** (most critical - this makes AI work)
2. **Fix Sarvam TTS Model** (secondary - voice feature)
3. **Remove "temporarily limited" message** (cosmetic)

---

## Need Help?
- Mistral Console: https://console.mistral.ai/
- Sarvam Docs: https://docs.sarvam.ai/
- Render Dashboard: https://dashboard.render.com/
