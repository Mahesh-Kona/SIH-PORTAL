# 🚀 Complete Render Deployment Guide - SIH Web Portal

## 🎯 Architecture Overview

```
Frontend (Render Web Service) ←→ Backend (Render Web Service) ←→ SQLite Database
     [Node.js + Express]           [Node.js + Express]           [File-based]
```

## 📋 Prerequisites

1. ✅ **Code is ready** - All configurations updated
2. ✅ **GitHub repo** - Your code is pushed to GitHub
3. ✅ **Render account** - Free account at render.com

## 🚀 Deployment Steps

### Step 1: Deploy Backend Service

1. **Login to Render** → New + → Web Service
2. **Connect GitHub** → Select `SIH_Web_Portal` repository
3. **Service Configuration:**
   ```
   Name: sih-backend
   Root Directory: server
   Environment: Node
   Build Command: npm install
   Start Command: node index-simple.js
   Instance Type: Free
   ```

4. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   ADMIN_EMAIL=admin@rgukt.ac.in
   ADMIN_PASSWORD=SIH2024@Admin
   ```

5. **Deploy** → Wait for "Live" status

### Step 2: Deploy Frontend Service

1. **New + → Web Service** (same repo)
2. **Service Configuration:**
   ```
   Name: sih-frontend
   Root Directory: / (leave empty)
   Environment: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   Instance Type: Free
   ```

3. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   VITE_API_BASE=/api
   BACKEND_URL=https://sih-backend.onrender.com
   ```

4. **Deploy** → Wait for "Live" status

## 🔧 How It Works

### Frontend Service:
- ✅ **Serves static files** from `dist` folder
- ✅ **Proxies API calls** to backend service at `/api/*`
- ✅ **Handles SPA routing** - all routes go to `index.html`
- ✅ **Express server** with proper host binding (`0.0.0.0`)

### Backend Service:
- ✅ **SQLite database** - no external DB needed
- ✅ **Auto-seeded data** - admin user and demo juries
- ✅ **CORS configured** - allows frontend domain
- ✅ **All API endpoints** - submissions, evaluations, jury management

## 🧪 Testing After Deployment

### URLs You'll Get:
- **Frontend**: `https://sih-frontend.onrender.com`
- **Backend**: `https://sih-backend.onrender.com`

### Test Checklist:
1. **✅ Landing Page** - RGUKT branding loads correctly
2. **✅ Admin Login** - `admin@rgukt.ac.in` / `SIH2024@Admin`
3. **✅ Jury Management** - Add/edit juries (404 errors fixed!)
4. **✅ Team Registration** - Submit presentations
5. **✅ Jury Login** - Demo accounts work
6. **✅ Evaluation System** - Scoring functionality

## 🔐 Login Credentials

### Admin Panel:
- **Email**: `admin@rgukt.ac.in`
- **Password**: `SIH2024@Admin`

### Demo Juries:
- `jury1@sih2025.com` / `jury1pass`
- `jury2@sih2025.com` / `jury2pass`
- `jury3@sih2025.com` / `jury3pass`
- `jury4@sih2025.com` / `jury4pass`

## ⚡ Performance Notes

### First Load:
- **Backend**: 15-30 seconds (cold start)
- **Frontend**: Instant after backend is warm

### Render Free Tier:
- ✅ **500 build hours/month** - plenty for this project
- ✅ **No sleeping** - both services stay active
- ✅ **Custom domains** - can add your own domain later

## 🐛 Troubleshooting

### Common Issues:

1. **"No open ports detected"**
   - ✅ **Fixed** - Server now binds to `0.0.0.0`

2. **"Backend connection failed"**
   - ✅ **Fixed** - Frontend proxies to backend URL

3. **"CORS errors"**
   - ✅ **Fixed** - Backend allows Render domains

4. **"404 errors in admin panel"**
   - ✅ **Fixed** - Added missing `/admin/jury-mapping` endpoint

### Health Checks:
- **Backend**: `https://sih-backend.onrender.com/api/health`
- **Frontend**: `https://sih-frontend.onrender.com/health`

## 🎉 Features Available

- ✅ **Complete SIH Portal** - Team registration to final scoring
- ✅ **Admin Dashboard** - Full jury and submission management
- ✅ **Responsive Design** - Works on all devices
- ✅ **RGUKT Branding** - University colors and logos
- ✅ **Security** - Password hashing, input validation
- ✅ **Real-time Updates** - Auto-refresh capabilities

## 📈 Next Steps

1. **Custom Domain** - Add your university domain
2. **Email Integration** - Add email notifications
3. **Backup System** - Export/import database
4. **Analytics** - Track submission statistics

Your SIH Web Portal is now production-ready on Render! 🚀