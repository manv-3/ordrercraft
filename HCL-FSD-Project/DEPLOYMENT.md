# OrderCraft — Cloud Deployment Guide

This guide covers deploying the **Spring Boot Backend** to **Render.com** (100% Free Tier) and the **Angular Material Frontend** to **Vercel** (Free Tier).

---

## 🚀 Part 1: Deploy Backend to Render (Free Tier)

### 1. Pre-configured Files (Ready in Repo)
* [**`Dockerfile`**](file:///D:/Ordercraft/HCL-FSD-Project/Dockerfile): Multi-stage Docker build with Maven 3.9.9 and OpenJDK 21.
* [**`render.yaml`**](file:///D:/Ordercraft/render.yaml): Blueprint configuration with memory optimization (`-Xmx400m`) for Render's 512MB free tier limit.
* [**`application.properties`**](file:///D:/Ordercraft/HCL-FSD-Project/src/main/resources/application.properties): Dynamic port binding (`${PORT:8082}`) and self-contained embedded H2 database pre-seeded with sample data and test users (`admin`/`admin123`, `user`/`user123`).
* [**`CorsConfig.java`**](file:///D:/Ordercraft/HCL-FSD-Project/src/main/java/com/ordercraft/config/CorsConfig.java): Pre-configured to allow cross-origin requests from Vercel deployments.

---

### 2. Deploy via Render (Choose Method A or B)

#### Method A: 1-Click Blueprint (Recommended)
1. Open **[dashboard.render.com](https://dashboard.render.com/)** and sign in with GitHub.
2. Click **New +** (top right) ➔ **Blueprint**.
3. Select your repository: **`manv-3/ordrercraft`**.
4. Render detects [`render.yaml`](file:///D:/Ordercraft/render.yaml) automatically:
   * **Service Name**: `ordercraft-backend`
   * **Runtime**: `Docker`
   * **Root Directory**: `HCL-FSD-Project`
   * **Instance Type**: `Free`
5. Click **Apply**. Render will pull the repo, build the Docker container, and deploy your live Spring Boot app!

#### Method B: Manual Web Service
1. In Render Dashboard, click **New +** ➔ **Web Service**.
2. Select your repository: **`manv-3/ordrercraft`**.
3. Configure the following fields:
   * **Name**: `ordercraft-backend`
   * **Region**: Choose any (e.g., Oregon or Frankfurt)
   * **Branch**: `main`
   * **Root Directory**: `HCL-FSD-Project`
   * **Runtime**: `Docker`
   * **Instance Type**: `Free` ($0/month)
4. Under **Environment Variables**, add:
   * `PORT` = `8082`
   * `JAVA_TOOL_OPTIONS` = `-Xmx400m` *(prevents out-of-memory on Render's 512MB free instance)*
5. Click **Deploy Web Service**.

> **Note on Render Free Tier**: Web services spin down after 15 minutes of inactivity to save resources. When a new request arrives, it wakes up within 30–45 seconds.

Once deployed, copy your Render service URL (e.g. `https://ordercraft-backend-xxxx.onrender.com`).

---

## ⚡ Part 2: Deploy Frontend to Vercel

### 1. Import Project into Vercel
1. Open **[vercel.com/new](https://vercel.com/new)** and sign in with GitHub.
2. Under "Import Git Repository", select **`manv-3/ordrercraft`**.
3. Configure the deployment settings:
   * **Framework Preset**: `Angular`
   * **Root Directory**: Click **Edit** and set it to:
     ```text
     HCL-FSD-Project/frontend
     ```
   * **Build and Output Settings**:
     * Build Command: `npm run build`
     * Output Directory: `dist/frontend/browser`
4. Click **Deploy**. Vercel will build and launch your Angular Material application globally within ~1 minute.

---

## 🔗 Part 3: Connect Frontend to Render Backend

Once your backend URL is generated on Render (e.g. `https://ordercraft-backend-xxxx.onrender.com`):

### Option A: Via `vercel.json` API Proxy (Recommended — Avoids CORS)
In [`HCL-FSD-Project/frontend/vercel.json`](file:///D:/Ordercraft/HCL-FSD-Project/frontend/vercel.json), replace `YOUR_RENDER_URL` with your Render backend URL:
```json
{
  "version": 2,
  "framework": "angular",
  "buildCommand": "npm run build",
  "outputDirectory": "dist/frontend/browser",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://YOUR_RENDER_URL/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Option B: Via `environment.prod.ts`
In [`HCL-FSD-Project/frontend/src/environments/environment.prod.ts`](file:///D:/Ordercraft/HCL-FSD-Project/frontend/src/environments/environment.prod.ts):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://YOUR_RENDER_URL/api'
};
```

Commit and push your change:
```bash
git add .
git commit -m "Connect frontend to Render backend"
git push origin main
```
Vercel will automatically redeploy and your entire OrderCraft ERP will be live!
