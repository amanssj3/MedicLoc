# MedRoute — Medical College Distance Finder 🏥📍

A responsive web application that calculates and visualizes driving and direct distances from your home location to 73 medical colleges and hospitals across Gujarat, Maharashtra, and Rajasthan.

## Features
- 📍 **Multi-location support**: Set home addresses (e.g. Kaziwad Bhavnagar) with coordinates.
- 📏 **Interactive Map Lines**: Dynamic polylines with distance labels in kilometers.
- 🚗 **Real-Time Distance & Drive Times**: OSRM road routes and Haversine direct distances.
- 📱 **100% Mobile Responsive**: Seamless list/map switching, mobile slide-out drawer, touch-friendly UI.
- 📄 **PDF & Bulk Import**: Pre-seeded with 73 NEET PG DNB hospitals, plus import your own list.
- ⚡ **Zero-backend Static**: 100% client-side HTML, CSS, JavaScript — instant, private, and ultra-fast.

## Deploying to Vercel

### Option 1: Vercel Web Dashboard (Easiest)
1. Push this directory to your GitHub / GitLab / Bitbucket repository.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Framework Preset: Choose **"Other"** (it is a static site).
5. Click **"Deploy"**. Vercel will build and launch your live URL in seconds!

### Option 2: Vercel CLI
```bash
# Install Vercel CLI globally (if not already installed)
npm i -g vercel

# Deploy directly from this directory
vercel

# Deploy to production
vercel --prod
```
