# KrishiMitra 🌾

> Voice-First Agricultural Advisory Platform for Indian Farmers

**KrishiMitra** is a mobile-first Progressive Web App (PWA) designed to empower Indian farmers running allied enterprises (poultry, fisheries, apiculture, mushroom cultivation, vermicomposting, dairy, etc.) with real-time agricultural information, AI-powered advisory, and community access.

🌐 **Live Demo**: [krishimitra.vercel.app](https://krishimitra.vercel.app) (Coming Soon)

## 🎯 Features

- **Multi-Language Support** - English, Hindi (हिंदी), Marathi (मराठी)
- **Voice-First Interface** - Speak your questions, hear responses
- **Real-Time Data** - Live weather and mandi (market) prices
- **AI Advisory** - KisanSLM-powered agricultural advice with grounding
- **Government Schemes** - Personalized scheme recommendations
- **Market Linkage** - Connect farmers with buyers through intelligent matching
- **Community Access** - WhatsApp groups and expert helpline (Kisan Call Centre)
- **Business Planner** - Financial projections for agricultural enterprises
- **Offline Support** - PWA with service worker for offline access

## 🏗️ Architecture

```
Frontend (React PWA)
    ↓
Supabase (Auth + PostgreSQL + Edge Functions)
    ↓
FastAPI Backend (Data Source Isolation)
    ↓
External APIs (Weather, Mandi Prices, Schemes, Training)
```

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS
- Vite
- Supabase JS Client
- React Router

**Backend:**
- FastAPI (Python 3.11+)
- Uvicorn ASGI Server
- Supabase (PostgreSQL + Auth + RLS)
- Supabase Edge Functions (Deno/TypeScript)

**External Integrations:**
- Open-Meteo (Weather)
- AGMARKNET/e-NAM (Mandi Prices)
- myScheme.gov.in (Government Schemes)
- ICAR/KVK (Training Resources)
- KisanSLM (AI Model)
- Sarvam AI (Voice Services)

## 📋 Prerequisites

- **Node.js** 20+ (for frontend)
- **Python** 3.11+ (for backend)
- **Supabase Account** (free tier works)
- Modern web browser (Chrome, Firefox, Safari)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/krishimitra.git
cd krishimitra
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and add your Supabase credentials:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add:
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Start backend server
uvicorn main:app --reload
```

Backend API will be available at `http://localhost:8000`

### 4. Supabase Setup

#### Create Supabase Project

1. Go to https://supabase.com
2. Create a new project
3. Copy your project URL and keys

#### Run Database Migrations

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

Or manually run the SQL files in `supabase/migrations/` in your Supabase SQL Editor.

#### Deploy Edge Functions

```bash
cd supabase/functions

# Deploy AI advisory function
supabase functions deploy ai-advisory

# Deploy voice service function
supabase functions deploy voice-service

# Set secrets
supabase secrets set KISANSLM_API_URL=your-kisanslm-url
supabase secrets set ANTHROPIC_API_KEY=your-claude-key
supabase secrets set SARVAM_API_KEY=your-sarvam-key
```

## 📱 Demo Mode (Without Backend)

The frontend can run in demo mode without Supabase configuration:

1. Leave `.env` with placeholder values
2. Start frontend: `npm run dev`
3. The app will detect missing credentials and run in demo mode
4. All UI will be visible and interactive (without real data)

## 🗂️ Project Structure

```
krishimitra/
├── frontend/                 # React PWA
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts (Auth, Language)
│   │   ├── i18n/            # Translation system
│   │   ├── lib/             # Utilities (Supabase client, etc.)
│   │   ├── modules/         # Business logic modules
│   │   ├── pages/           # Page components
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                  # FastAPI backend
│   ├── data_sources/        # External API integrations
│   │   ├── weather_source.py
│   │   ├── mandi_source.py
│   │   ├── scheme_source.py
│   │   └── training_source.py
│   ├── main.py              # FastAPI app
│   ├── config.py            # Configuration
│   ├── models.py            # Pydantic models
│   └── requirements.txt
│
├── supabase/
│   ├── functions/           # Edge Functions
│   │   ├── ai-advisory/
│   │   └── voice-service/
│   └── migrations/          # Database migrations
│
└── README.md
```

## 🧪 Testing

### Frontend Tests

```bash
cd frontend

# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run property-based tests
npm run test:pbt
```

### Backend Tests

```bash
cd backend

# Run tests with pytest
pytest

# Run with coverage
pytest --cov
```

## 📦 Building for Production

### Frontend

```bash
cd frontend
npm run build
```

Build output will be in `frontend/dist/`

### Backend

```bash
cd backend
# Backend runs with uvicorn in production
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 🔧 Configuration

### Environment Variables

**Frontend (`.env`):**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_FASTAPI_BASE_URL=http://localhost:8000
```

**Backend (`.env`):**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Supabase Secrets (Edge Functions):**
```bash
KISANSLM_API_URL=https://your-kisanslm-endpoint
ANTHROPIC_API_KEY=sk-ant-...
SARVAM_API_KEY=your-sarvam-key
```

## 🎨 Design Philosophy

KrishiMitra follows **Government of India** design guidelines:

- **Official Color Palette**: Primary green (#0b5e2c), Saffron/Orange (#f5820a)
- **Trustworthy Branding**: Ashoka Emblem badge, bilingual attribution
- **Accessibility First**: Minimum 48px tap targets, 4.5:1 contrast ratio
- **Mobile-Optimized**: Designed for 360-420px viewports
- **Voice-First**: Primary interaction through speech, typing secondary

## 📊 Database Schema

Key tables in Supabase PostgreSQL:

- `farmer_profiles` - User profiles with location and preferences
- `schemes` - Cached government schemes from myScheme.gov.in
- `training_resources` - Cached training from ICAR/KVK
- `produce_listings` - Farmer produce for market matching
- `buyer_requirements` - Buyer/FPO demand records
- `local_needs` - Shortage/surplus alerts
- `chat_history` - AI conversation logs
- `groups` - WhatsApp community groups directory

All tables use **Row Level Security (RLS)** for data protection.

## 🔐 Security

- ✅ All API keys stored server-side only
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ CORS configured for production domains
- ✅ No sensitive data in localStorage
- ✅ Supabase Auth for authentication
- ✅ Service worker for secure offline caching

## 🌐 API Endpoints

### FastAPI Backend

| Endpoint | Method | Parameters | Description |
|----------|--------|-----------|-------------|
| `/api/weather` | GET | `latitude`, `longitude` | Real-time weather from Open-Meteo |
| `/api/mandi-price` | GET | `crop`, `state`, `district` | Live mandi prices from AGMARKNET |
| `/api/schemes` | GET | `state`, `district`, `enterprise_type` | Government schemes (cached) |
| `/api/training` | GET | `enterprise_type`, `language?` | Training resources (cached) |

### Supabase Edge Functions

| Function | Method | Description |
|----------|--------|-------------|
| `ai-advisory` | POST | AI advisory with KisanSLM → Claude → Q&A fallback |
| `voice-service/stt` | POST | Speech-to-text via Sarvam AI or Web Speech |
| `voice-service/tts` | POST | Text-to-speech via Sarvam AI or Web Speech |

## 🐛 Troubleshooting

### White Screen on Load

- Check browser console (F12) for errors
- Verify `.env` file exists with correct format
- Clear browser cache and reload
- Try demo mode (remove Supabase credentials from `.env`)

### API Errors

- Verify FastAPI backend is running on port 8000
- Check CORS configuration in `backend/main.py`
- Confirm Supabase credentials are correct
- Check network tab in browser DevTools

### Database Errors

- Verify all migrations have been run
- Check RLS policies are enabled
- Confirm user has proper permissions
- Check Supabase project status

## 📚 Documentation

- [Technical Documentation](./Technical_Documentation_KrishiMitra.md) - Complete technical specs
- [Design Document](./.kiro/specs/krishimitra/design.md) - System design and architecture
- [Requirements Document](./.kiro/specs/krishimitra/requirements.md) - Feature requirements
- [Tasks Document](./.kiro/specs/krishimitra/tasks.md) - Implementation tasks

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Government of India - Design guidelines and data sources
- Supabase - Backend infrastructure
- Open-Meteo - Weather data
- AGMARKNET - Market price data
- myScheme.gov.in - Government schemes
- ICAR/KVK - Training resources
- Kisan Call Centre - Expert support (1800-180-1551)

## 📞 Support

For questions or support:
- Email: codex5622@gmail.com
- Kisan Call Centre: 1800-180-1551

---

**Built with ❤️ for Indian Farmers by Team Airavata**
