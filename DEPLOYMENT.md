# VibeCheck AI - Deployment Guide

## 🚀 Deployment Options

### Option 1: Render (Recommended for Production)

**Using Blueprint (Easiest):**

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository: `https://github.com/bhuvant18/VibeCheck_AI`
4. Render will automatically detect `render.yaml` and create:
   - Backend service (vibecheck-backend)
   - Frontend service (vibecheck-frontend)
5. Deploy! (No API key needed - users provide their own through the UI)

**Manual Deployment (Alternative):**

Backend:
1. New Web Service → Docker
2. Set Dockerfile path: `./backend/Dockerfile`
3. Set Docker context: `./backend`
4. No API key needed (users provide their own)

Frontend:
1. New Web Service → Docker  
2. Set Dockerfile path: `./frontend-react/Dockerfile`
3. Set Docker context: `./frontend-react`

### Option 2: Docker Compose (Local Development)

```bash
# Start all services
docker-compose up --build

# Access:
# - Frontend: http://localhost
# - Backend: http://localhost:8000
# - API Docs: http://localhost:8000/docs

# Stop services
docker-compose down
```

### Option 3: Manual Local Setup

**Backend:**
```bash
cd backend
pip install -r requirements.txt
# Add GEMINI_API_KEY to .env file
uvicorn api:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend-react
npm install
npm run dev
# Access: http://localhost:5173
```

## 🔧 Environment Variables

### Backend (.env) - Optional for Local Development
```env
HOST=0.0.0.0
PORT=8000
DEBUG=false
# GEMINI_API_KEY=optional_fallback_key (not needed - users enter their own)
```

### User API Keys
- Users enter their own Gemini API key through the frontend UI
- Keys are stored in browser localStorage (not sent to server for storage)
- Each API request includes the user's key

### Get Your Gemini API Key (For Users)
1. Visit: https://aistudio.google.com/apikey
2. Create a new API key
3. Enter it in the VibeCheck app when prompted

## 📝 Important Notes

- **For Render**: Use `render.yaml` blueprint file (already configured)
- **For Docker Compose**: Use `docker-compose.yml`
- **For Individual Dockerfiles**: Available in `backend/Dockerfile` and `frontend-react/Dockerfile`

## 🔍 Health Checks

- Backend: `GET /health` → Returns `{"status": "healthy"}`
- Frontend: Access root URL → Should load the React app

## 🐛 Troubleshooting"No API key provided" error
- **Solution**: Make sure you entered your Gemini API key in the frontend modal. The key is required for each request.
**Issue**: "docker-compose.yml parse error"
- **Solution**: You're trying to use docker-compose.yml as a Dockerfile. Use render.yaml for Render deployment or individual Dockerfiles.

**Issue**: Backend returns 500 errors
- **Solution**: Check that GEMINI_API_KEY is set correctly in environment variables

**Issue**: Frontend can't connect to backend
- **Solution**: Ensure backend URL is correctly configured (automatic in Docker Compose and Render)
