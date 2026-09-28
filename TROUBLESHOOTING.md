# 🔧 KrishiMitra Troubleshooting Guide

**Last Updated**: January 2025

---

## 🚨 Common Issues & Solutions

### **Issue 1: Website Not Loading**

#### **Symptoms:**
- Blank page
- "Cannot connect" error
- Infinite loading

#### **Solutions:**

**A. Check Vercel Deployment:**
1. Go to: https://vercel.com/dashboard
2. Check deployment status
3. Look for build errors
4. Verify environment variables are set

**B. Check if Frontend URL Changed:**
- Vercel may have assigned a new URL
- Check your Vercel dashboard for the current URL

**C. Clear Browser Cache:**
```
Ctrl + Shift + Delete (Windows)
Cmd + Shift + Delete (Mac)
```

---

### **Issue 2: Chat Not Working / 500 Errors**

#### **Symptoms:**
- Chat sends message but no response
- Console shows "500 Internal Server Error"
- "Failed to load resource" errors

#### **Solutions:**

**A. Check Render Backend Status:**
1. Go to: https://dashboard.render.com
2. Find your service (haladhar)
3. Check if it's running (should show green "Live")
4. Check logs for errors

**B. Verify Backend is Deployed:**
Test in browser or terminal:
```bash
curl https://haladhar.onrender.com/health
```
**Expected**: `{"status":"ok"}`

**C. Check Environment Variables on Render:**
Ensure these are set:
```
MISTRAL_API_KEY=mstrl_QvYWYGXykENawCxbSE1WSrtQYlPE72WY_3BBlfa
MISTRAL_AGENT_ID=ag_01a0e4287799724cba04f2bfcb235ce8
SARVAM_API_KEY=sk_axazbxdv_fBgxtCwIImUfdBgpwvRdKCcR
```

**D. Redeploy Render Service:**
1. Dashboard → Your Service
2. "Manual Deploy" → "Deploy latest commit"
3. Wait 5-10 minutes

---

### **Issue 3: Mistral API Rate Limit Exceeded**

#### **Symptoms:**
- Error: "Mistral API rate limit exceeded"
- Chat works intermittently
- Some messages fail

#### **Solutions:**

**A. Check Mistral API Usage:**
1. Go to: https://console.mistral.ai/usage
2. Check if you've exceeded free tier limits
3. Verify API key is valid

**B. Temporary Solution - Use Fallback:**
The system has a 3-level fallback:
1. Mistral Agent (primary)
2. Mistral Chat (fallback)
3. Placeholder responses (emergency)

If rate limited, system should automatically use placeholder responses.

**C. Upgrade Mistral Plan:**
- Go to console.mistral.ai
- Upgrade to paid plan for higher limits

---

### **Issue 4: Backend Not Deploying on Render**

#### **Symptoms:**
- "Root directory 'backend' does not exist"
- Build fails
- Deploy button doesn't work

#### **Solutions:**

**A. Fix Root Directory Setting:**
1. Render Dashboard → Your Service → Settings
2. **Root Directory**: Leave EMPTY or put "."
3. **Build Command**: `pip install -r backend/requirements.txt`
4. **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Save and redeploy

**B. Check GitHub Connection:**
1. Verify repository is: `DeepeshPatil-18/HALADHAR`
2. Verify branch is: `main`
3. Verify Render has access to the repository

**C. Check Build Logs:**
- Dashboard → Your Service → Logs
- Look for Python errors
- Look for missing dependencies

---

### **Issue 5: Icons Not Displaying**

#### **Symptoms:**
- Manifest error in console
- Icons show as broken images
- PWA installation fails

#### **Solution:**
✅ **Already Fixed** - manifest.json now uses SVG icons
- If still seeing errors, clear browser cache
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

### **Issue 6: Voice Features Not Working**

#### **Symptoms:**
- Microphone button doesn't work
- "Speech-to-text service not available"
- Audio doesn't play

#### **Solutions:**

**A. Check Sarvam API Key:**
```bash
# Test if backend has Sarvam configured
curl https://haladhar.onrender.com/api/v1/ai/status
```
Look for `"sarvam_stt": {"available": true}`

**B. Browser Permissions:**
- Allow microphone access when prompted
- Check browser settings → Privacy → Microphone

**C. HTTPS Required:**
- Voice features only work over HTTPS
- Vercel provides HTTPS automatically
- Works on deployed site, not localhost

---

### **Issue 7: Wrong Backend URL**

#### **Symptoms:**
- Network errors
- CORS errors
- "Failed to fetch"

#### **Solution:**
Verify frontend is pointing to correct backend:

**File**: `frontend/.env.production`
```bash
VITE_FASTAPI_BASE_URL=https://haladhar.onrender.com
```

If you changed Render URL, update this file and redeploy.

---

## 🧪 **Testing Checklist**

### **Step 1: Test Backend**
```bash
# Health check
curl https://haladhar.onrender.com/health

# Should return: {"status":"ok"}
```

### **Step 2: Test Chat API**
```bash
curl -X POST https://haladhar.onrender.com/api/v1/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test","language":"hindi"}'
```

### **Step 3: Test Frontend**
1. Open: https://frontend-36soxtmyo-mahascorer-8533s-projects.vercel.app
2. Check console for errors (F12)
3. Try sending a chat message
4. Check network tab for failed requests

---

## 📊 **Quick Diagnosis**

### **Website doesn't load at all:**
→ Vercel deployment issue or wrong URL

### **Website loads but chat doesn't work:**
→ Backend issue (Render not deployed or API keys missing)

### **Chat works sometimes:**
→ API rate limits or network issues

### **Everything broken:**
→ Start from Step 1: Check backend health endpoint

---

## 🆘 **Emergency Reset Steps**

If nothing works:

### **1. Redeploy Backend:**
```bash
cd "d:\KrishiMitra 2.0\KrishiMitra"
git add .
git commit -m "force redeploy"
git push
```
Then manually deploy on Render.

### **2. Redeploy Frontend:**
- Vercel auto-deploys on push
- Or go to Vercel dashboard → Deployments → Redeploy

### **3. Verify Environment Variables:**
- Render: Check all API keys
- Vercel: Check VITE_FASTAPI_BASE_URL

### **4. Check Logs:**
- Render: Dashboard → Logs
- Vercel: Dashboard → Deployments → View Function Logs
- Browser: F12 → Console

---

## 📞 **Still Not Working?**

### **Collect This Information:**

1. **What's not working?**
   - [ ] Website doesn't load
   - [ ] Chat doesn't respond
   - [ ] Voice features broken
   - [ ] Specific error message

2. **Backend Status:**
   ```bash
   curl https://haladhar.onrender.com/health
   ```
   Response: _____________

3. **Browser Console Errors:**
   - Open F12 → Console
   - Copy error messages

4. **Render Logs:**
   - Last 50 lines from Render dashboard

5. **Vercel Deployment Status:**
   - Latest deployment status (success/failed)

---

## ✅ **Success Indicators**

Your website is working when:
- ✅ Backend `/health` returns `{"status":"ok"}`
- ✅ Frontend loads without console errors
- ✅ Chat responds to messages
- ✅ No red errors in browser console
- ✅ Render service shows "Live" (green)
- ✅ Vercel deployment shows "Ready" (green)

---

**For more details, see `DEPLOYMENT_GUIDE.md` and `DEPLOYMENT_STATUS.md`**
