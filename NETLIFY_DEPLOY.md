# 🚀 Netlify Deployment Guide for SIH Web Portal

## Quick Deploy (Drag & Drop)

1. **Build the project:**
   ```bash
   npm install
   npm run build
   ```

2. **Go to [netlify.com](https://netlify.com)**

3. **Drag the `dist` folder** to the deploy area

4. **Your site is live!** You'll get a URL like `https://amazing-name-123.netlify.app`

## Git-Based Deploy (Recommended)

1. **Push your updated code to GitHub**

2. **Netlify Dashboard** → New site from Git

3. **Connect GitHub repository**

4. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`

5. **Deploy site**

## Backend Integration

✅ **Backend API**: `https://sih-backend-9ub9.onrender.com/api`
✅ **CORS configured** for Netlify domains
✅ **Admin credentials**: admin / sih2025admin

## Features Available

- ✅ **Team Registration** with problem statement selection
- ✅ **Jury Login & Evaluation** system
- ✅ **Admin Panel** with jury management and scoring
- ✅ **Responsive Design** for all devices
- ✅ **RGUKT Branding** preserved

## Test After Deployment

1. **Landing Page** - Check RGUKT branding and navigation
2. **Admin Panel** - Login with admin credentials
3. **Jury Management** - Add/edit juries (fixed 404 errors)
4. **Team Registration** - Test submission flow
5. **Jury Login** - Test evaluation system

## Troubleshooting

- If you get CORS errors, the backend will auto-allow your Netlify domain
- For custom domains, update the CORS settings in the backend
- First load might be slow due to Render's cold start

Your SIH Web Portal is now ready for production! 🎉