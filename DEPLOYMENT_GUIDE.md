# 🚀 KrishiMitra Deployment Guide

## Updated API Keys (January 2025)

### Backend Environment Variables (.env)
```bash
# Supabase Configuration
SUPABASE_URL=https://zlujxzsuqmzfmwermwap.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsdWp4enN1cW16Zm13ZXJtd2FwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODAyMjM0MCwiZXhwIjoyMTAzNTk4MzQwfQ.O4E78e7_WUbD--YrVyr4_dmLbg4zi0yLZClByovdZI4

# Sarvam AI (Voice Services) - UPDATED
SARVAM_API_KEY=sk_axazbxdv_fBgxtCwIImUfdBgpwvRdKCcR
SARVAM_STT_MODEL=saaras:v3
SARVAM_TTS_MODEL=bulbul:v3
SARVAM_TTS_SPEAKER=shubh

# Mistral AI (Chat Assistant) - UPDATED
MISTRAL_API_KEY=mstrl_S9eNTQab6Q4g0PHrCSd8Fshhgo4kGAD3_0Y7ACj
MISTRAL_AGENT_ID=ag_01a0e4287799724cba04f2bfcb235ce8

# Mappls (Location Services)
MAPPLS_ACCESS_TOKEN=hcpflekjwzdubcfnryyhbzmxqhhuyxjfxmwo
```

### Frontend Environment Variables (.env.production)
```bash
VITE_API_URL=https://krishimitra.onrender.com/api
VITE_API_BASE_URL=https://krishimitra.onrender.com
VITE_FASTAPI_BASE_URL=https://krishimitra.onrender.com
VITE_ENABLE_VOICE=true
VITE_ENABLE_LOCATION=true
VITE_FORCE_NORMAL_MODE=false
VITE_SUPABASE_URL=https://zlujxzsuqmzfmwermwap.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsdWp4enN1cW16Zm13ZXJtd2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMjIzNDAsImV4cCI6MjEwMzU5ODM0MH0.KqJveT4mHYYppwybpYBDrOD0mEM_Bv8RVUfblG6MgRs
```

## 🌐 Render.com Backend Deployment

### Step 1: Update Environment Variables
1. Go to your Render dashboard
2. Find your KrishiMitra backend service
3. Go to **Environment** tab
4. Update these variables:

```bash
SARVAM_API_KEY=sk_axazbxdv_fBgxtCwIImUfdBgpwvRdKCcR
MISTRAL_API_KEY=mstrl_S9eNTQab6Q4g0PHrCSd8Fshhgo4kGAD3_0Y7ACj
MISTRAL_AGENT_ID=ag_01a0e4287799724cba04f2bfcb235ce8
```

### Step 2: Trigger Redeploy
- Click **"Manual Deploy"** → **"Deploy latest commit"**
- Wait for deployment to complete

## 🚀 Vercel Frontend Deployment

### Step 1: Environment Variables in Vercel
1. Go to [vercel.com](https://vercel.com)
2. Find your KrishiMitra project
3. Go to **Settings** → **Environment Variables**
4. Add/Update these:

```bash
VITE_API_URL=https://krishimitra.onrender.com/api
VITE_API_BASE_URL=https://krishimitra.onrender.com
VITE_FASTAPI_BASE_URL=https://krishimitra.onrender.com
VITE_ENABLE_VOICE=true
VITE_ENABLE_LOCATION=true
VITE_FORCE_NORMAL_MODE=false
VITE_SUPABASE_URL=https://zlujxzsuqmzfmwermwap.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsdWp4enN1cW16Zm13ZXJtd2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMjIzNDAsImV4cCI6MjEwMzU5ODM0MH0.KqJveT4mHYYppwybpYBDrOD0mEM_Bv8RVUfblG6MgRs
```

### Step 2: Redeploy
- Go to **Deployments** tab
- Click **"Redeploy"** on latest deployment
- Or push any commit to trigger auto-deploy

## 🧪 Testing Updated APIs

### Test Sarvam AI (Voice)
```bash
curl -X POST "https://krishimitra.onrender.com/api/voice/stt" \
  -H "Content-Type: multipart/form-data" \
  -F "audio=@test.wav" \
  -F "language=hi"
```

### Test Mistral AI (Chat)
```bash
curl -X POST "https://krishimitra.onrender.com/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "मेरी फसल में कीड़े लगे हैं",
    "conversation_id": "test123"
  }'
```

### Test Off-Topic Refusal
```bash
curl -X POST "https://krishimitra.onrender.com/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me about movies",
    "conversation_id": "test123"
  }'
```
**Expected:** Should refuse and redirect to agricultural topics.

## 🎯 Deployment URLs

Once deployed:
- **Frontend**: https://krishimitra.vercel.app
- **Backend**: https://krishimitra.onrender.com
- **API Docs**: https://krishimitra.onrender.com/docs

## 🔧 Troubleshooting

### If Voice Features Don't Work:
1. Check Sarvam API key in Render environment
2. Verify API key format: starts with `sk_`
3. Check API quotas at sarvam.ai dashboard

### If Chat Doesn't Work:
1. Check Mistral API key in Render environment  
2. Verify Agent ID is correct
3. Check API quotas at console.mistral.ai

### If Agricultural Context Fails:
- The backend code now includes context restrictions
- No additional Mistral console configuration needed
- Test with off-topic questions to verify refusal

## 📊 Monitoring

### Check API Usage:
- **Sarvam**: https://www.sarvam.ai/dashboard
- **Mistral**: https://console.mistral.ai/usage
- **Supabase**: https://app.supabase.com/project/zlujxzsuqmzfmwermwap

### Check Deployment Logs:
- **Render**: Service dashboard → Logs tab
- **Vercel**: Project dashboard → Functions tab → View function logs

---
*Updated: January 2025 with new API keys and agricultural context restrictions*