# OrderCraft — Cloud Deployment Guide

This guide covers deploying the **Spring Boot Backend** to **Railway** and the **Angular Material Frontend** to **Vercel**.

---

## 🚂 Part 1: Deploy Backend to Railway

### 1. Preparation (Already Configured)
* **[`Dockerfile`](file:///D:/Ordercraft/HCL-FSD-Project/Dockerfile)**: Multi-stage Docker build with Maven 3.9.9 and OpenJDK 21.
* **[`railway.json`](file:///D:/Ordercraft/HCL-FSD-Project/railway.json)**: Configured to use Dockerfile builder.
* **[`application.properties`](file:///D:/Ordercraft/HCL-FSD-Project/src/main/resources/application.properties)**: Listens on dynamic `PORT` assigned by Railway (`server.port=${PORT:8082}`) and supports environment-based database configuration.
* **[`CorsConfig.java`](file:///D:/Ordercraft/HCL-FSD-Project/src/main/java/com/ordercraft/config/CorsConfig.java)**: Enabled cross-origin requests from Vercel deployments.

### 2. Deploy via Railway Web Dashboard (Recommended)
1. Commit and push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "Configure Railway and Vercel cloud deployment"
   git push origin main
   ```
2. Go to **[railway.app](https://railway.app/)** and sign in with GitHub.
3. Click **"+ New Project"** ➔ **"Deploy from GitHub repo"**.
4. Select your **`HCL-FSD-Project`** repository.
5. Railway will automatically detect the **Dockerfile** in the root and start building.
6. Once deployed, go to **Settings ➔ Networking** and click **"Generate Domain"**.
   - Your backend URL will look like: `https://ordercraft-production.up.railway.app`

*(Optional) Add MySQL on Railway: In your Railway project, click **"+ New" ➔ "Database" ➔ "Add MySQL"**. Railway will provide MySQL environment variables automatically.*

---

## ▲ Part 2: Deploy Frontend to Vercel

### 1. Preparation (Already Configured)
* **[`frontend/vercel.json`](file:///D:/Ordercraft/HCL-FSD-Project/frontend/vercel.json)**: Handles Single Page Application (SPA) routing so page reloads do not return 404.
* **Environment Configuration**: API calls use `environment.apiUrl`.

### 2. Deploy via Vercel Web Dashboard (Recommended)
1. Go to **[vercel.com/new](https://vercel.com/new)** and sign in with GitHub.
2. Import your **`HCL-FSD-Project`** repository.
3. In **Project Configuration**, configure the following:
   * **Framework Preset**: `Angular`
   * **Root Directory**: Click *Edit* and select **`frontend`**
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist/frontend/browser`
4. Click **Deploy**.

### 3. Connect Frontend to Railway Backend
There are two ways to connect your Vercel frontend to your Railway backend:

#### Option A: Via `vercel.json` API Proxy (Recommended - Avoids all CORS issues)
In [`frontend/vercel.json`](file:///D:/Ordercraft/HCL-FSD-Project/frontend/vercel.json), update the rewrite destination with your Railway domain:
```json
{
  "version": 2,
  "framework": "angular",
  "buildCommand": "npm run build",
  "outputDirectory": "dist/frontend/browser",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://YOUR_RAILWAY_APP.up.railway.app/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### Option B: Via `environment.prod.ts`
In [`frontend/src/environments/environment.prod.ts`](file:///D:/Ordercraft/HCL-FSD-Project/frontend/src/environments/environment.prod.ts), set your Railway backend URL:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://YOUR_RAILWAY_APP.up.railway.app/api'
};
```
Push the commit, and Vercel will automatically redeploy!
