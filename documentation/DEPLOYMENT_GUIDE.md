# Complete Production Deployment Guide

**Project:** IoT Device Status Monitoring System  
**Student Register Number:** 24ITR018  
**College:** Velalar College of Engineering and Technology, Erode  
**Department:** Information Technology  
**Architecture:** React.js (GitHub Pages) &rarr; Node.js/Express.js (Render) &rarr; MongoDB Atlas Cloud  

---

## 1. Deployment Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│             GitHub Pages (Static Hosting)              │
│       https://<YOUR-USERNAME>.github.io/               │
│       IoT-Device-Status-Monitoring-System/             │
│                                                        │
│  • React 19 Single Page App                            │
│  • Client-side Hash Routing (#overview, #simulation)   │
│  • Built with VITE_API_BASE_URL pointing to Render     │
└──────────────────────────┬─────────────────────────────┘
                           │
                           │ HTTPS Cross-Origin Requests (JSON)
                           ▼
┌────────────────────────────────────────────────────────┐
│             Render.com (Web Service)                   │
│       https://<YOUR-RENDER-APP>.onrender.com           │
│                                                        │
│  • Node.js & Express REST API Server                   │
│  • Deterministic FSM Engine (FLAT)                     │
│  • Automatic CORS authorization for *.github.io        │
│  • Reads MONGODB_URI & PORT from environment           │
└──────────────────────────┬─────────────────────────────┘
                           │
                           │ Encrypted TLS Wire Protocol
                           ▼
┌────────────────────────────────────────────────────────┐
│            MongoDB Atlas (Managed Database)            │
│       mongodb+srv://<cluster>.mongodb.net/             │
│                                                        │
│  • Collections: devices, sensorreadings, alerts,       │
│    deviceevents                                        │
│  • Network Access IP Rule: 0.0.0.0/0                   │
└────────────────────────────────────────────────────────┘
```

### Why GitHub Pages Hosts Only the Frontend:
GitHub Pages is a static file server designed to serve HTML, CSS, JavaScript, and client-side assets. It does not run a Node.js runtime process, cannot bind to dynamic TCP ports, and cannot execute persistent database daemons. Therefore:
- The React application is built into static web bundles (`dist/`) and hosted on **GitHub Pages**.
- The Express API and FSM state machine are hosted as an active web service on **Render**.
- Persistent data is stored securely in the cloud via **MongoDB Atlas**.

---

## 2. Step 1: Set Up MongoDB Atlas (Cloud Database)

1. **Sign Up / Log In:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and sign in.
2. **Create a Free Cluster:**
   - Click **Create Deployment** &rarr; Select **M0 Free Tier** &rarr; Choose the nearest region (e.g. AWS / Mumbai or Singapore).
   - Click **Create Deployment**.
3. **Configure Database Credentials:**
   - Go to **Security** &rarr; **Database Access**.
   - Click **Add New Database User**.
   - Authentication Method: **Password**.
   - Enter a username (e.g., `iot_admin`) and a secure password (avoid special characters like `@` or `/`, or URL-encode them).
   - Set Database User Privileges: **Read and write to any database**.
   - Click **Add User**.
4. **Configure Network Access (Crucial for Render):**
   - Go to **Security** &rarr; **Network Access**.
   - Click **Add IP Address**.
   - Select **Allow Access from Anywhere** (`0.0.0.0/0`).
   - *Reason:* Render dynamic instances use elastic IP pools. Allowing `0.0.0.0/0` ensures Render can connect to your database.
   - Click **Confirm**.
5. **Obtain Connection String:**
   - Go to **Deployments** &rarr; **Database** &rarr; Click **Connect**.
   - Select **Drivers** (Node.js).
   - Copy the connection string format:
     ```
     mongodb+srv://<username>:<password>@<cluster>.mongodb.net/iot_monitoring?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your database user credentials. Replace the database name with `iot_monitoring`.

---

## 3. Step 2: Push Code to Your GitHub Repository

1. **Create an Empty GitHub Repository:**
   - Go to [GitHub](https://github.com/new).
   - Repository Name: `IoT-Device-Status-Monitoring-System`
   - Visibility: **Public**.
   - Leave "Initialize with README" **unchecked** (we already have a complete README and initial commit).
   - Click **Create repository**.

2. **Push the Project from Your Machine:**
   Open PowerShell or Terminal in the project root:
   ```bash
   cd C:\Users\abidh\.gemini\antigravity\scratch\IoT-Device-Status-Monitoring-System

   # Rename branch to main if not already on main
   git branch -M main

   # Link your newly created GitHub repository
   git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/IoT-Device-Status-Monitoring-System.git

   # Push your code
   git push -u origin main
   ```

---

## 4. Step 3: Deploy Backend on Render

1. **Log in to Render:**
   - Go to [Render Dashboard](https://dashboard.render.com/) and sign in with GitHub.
2. **Create New Web Service:**
   - Click **New +** &rarr; Select **Web Service**.
   - Select **Build and deploy from a Git repository**.
   - Choose your repository: `IoT-Device-Status-Monitoring-System`.
3. **Configure Service Settings:**
   - **Name:** `iot-monitoring-backend` (or a name of your choice)
   - **Region:** Nearest region (e.g., Singapore or Frankfurt)
   - **Branch:** `main`
   - **Root Directory:** `backend` *(CRUCIAL: Do not leave blank)*
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
4. **Configure Environment Variables:**
   Click **Advanced** &rarr; **Add Environment Variable**:

   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production mode |
   | `MONGODB_URI` | `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/iot_monitoring?retryWrites=true&w=majority` | Your MongoDB Atlas connection URI |
   | `FRONTEND_URL` | `https://<YOUR-GITHUB-USERNAME>.github.io` | Your GitHub Pages origin |

5. **Deploy:**
   - Click **Create Web Service**.
   - Render will run `npm install` and `npm start`.
   - Once deployed, your backend URL will be displayed at the top:
     `https://<YOUR-RENDER-BACKEND-URL>.onrender.com`

6. **Verify Backend Health:**
   - Open in your browser:
     `https://<YOUR-RENDER-BACKEND-URL>.onrender.com/api/health`
   - Verify it returns HTTP 200 with:
     ```json
     {
       "status": "healthy",
       "project": "IoT Device Status Monitoring System",
       "studentRegNo": "24ITR018",
       "database": {
         "connected": true,
         "state": "Connected"
       }
     }
     ```

---

## 5. Step 4: Configure GitHub Pages & Actions for Frontend

1. **Add Repository Variable in GitHub:**
   - In your GitHub repository, click **Settings** (top tab).
   - In the left sidebar, click **Secrets and variables** &rarr; **Actions**.
   - Click the **Variables** tab (next to Secrets).
   - Click **New repository variable**.
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** `https://<YOUR-RENDER-BACKEND-URL>.onrender.com/api`  
     *(Include `/api` or the raw root URL; our frontend normalizes both automatically)*
   - Click **Add variable**.

2. **Configure GitHub Pages Source:**
   - In repository **Settings** &rarr; click **Pages** (in the left sidebar under "Code and automation").
   - Under **Build and deployment** &rarr; **Source**:
     Select **GitHub Actions** (do NOT choose "Deploy from a branch").

3. **Trigger Frontend Deployment:**
   - Go to the **Actions** tab in your GitHub repository.
   - Click on the **Deploy Frontend to GitHub Pages** workflow in the left menu.
   - Click **Run workflow** &rarr; **Run workflow** (or simply push a git commit).
   - The workflow will:
     1. Validate that `VITE_API_BASE_URL` is configured.
     2. Install frontend dependencies.
     3. Build React with base path `/IoT-Device-Status-Monitoring-System/`.
     4. Deploy static artifacts to GitHub Pages.

4. **Access Your Live Website:**
   - Once the action completes (green checkmark), your live URL will be:
     `https://<YOUR-GITHUB-USERNAME>.github.io/IoT-Device-Status-Monitoring-System/`

---

## 6. Live Testing & Verification Checklist

Once both services are live, perform this complete test walkthrough:

- [ ] **1. Dashboard Launch:** Open `https://<YOUR-USERNAME>.github.io/IoT-Device-Status-Monitoring-System/` in Chrome. Verify the page renders with styling, logo, and student register number `24ITR018`.
- [ ] **2. Database Connection Indicator:** Verify the top bar shows **"MongoDB Connected"** with a glowing green dot.
- [ ] **3. Device Registration:**
  - Navigate to **Device Management** (`#devices`).
  - Enter `deviceId: IOT004` and `deviceName: Server Room Sensor`.
  - Click **Register Device**. Verify it appears in the table with state `Registered (q0)`.
- [ ] **4. Valid Message Telemetry:**
  - Go to **Simulation Controls** (`#simulation`).
  - Select `IOT001`.
  - Click **Send Valid Message**.
  - Verify the HTTP Response console returns `HTTP 200` and the state transitions to `Active`.
- [ ] **5. Invalid Message Rejection (FLAT FSM Test):**
  - Click **Invalid Temperature (200°C)**.
  - Verify the console displays `HTTP 400 Bad Request`.
  - Verify the device state remains `Active` (state unchanged).
  - Check **System Alerts** (`#alerts`) to verify the `INVALID_MESSAGE` warning was logged.
- [ ] **6. Failure Simulation:**
  - In **Simulation Controls**, click **Simulate Failure**.
  - Verify state transitions to `Disconnected` and an `Error` alert is recorded.
- [ ] **7. Timeout Simulation:**
  - Click **Simulate Timeout (45s)**.
  - Verify state is `Disconnected` and a `Warning` alert is recorded.
- [ ] **8. Reconnection:**
  - Click **Reconnect Device**. Verify the state returns to `Active`.
- [ ] **9. Refresh Persistence:**
  - Refresh the page (`F5`).
  - Verify all registered devices, telemetry readings, and alerts are reloaded from MongoDB Atlas.
- [ ] **10. Cross-Browser Verification:**
  - Open the GitHub Pages link in an incognito window or on your smartphone.
  - Verify that the identical live database records appear.

---

## 7. Troubleshooting Common Deployment Errors

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **GitHub Actions fails on "Validate Production API URL"** | `VITE_API_BASE_URL` repository variable is missing | Go to GitHub Repo &rarr; Settings &rarr; Secrets and variables &rarr; Actions &rarr; Variables &rarr; Add `VITE_API_BASE_URL` with your Render backend URL. |
| **Website shows blank screen on GitHub Pages** | Incorrect base path or absolute asset paths | Ensure `vite.config.js` has `base: '/IoT-Device-Status-Monitoring-System/'`. Re-run GitHub Actions. |
| **Banner displays "MongoDB is currently offline"** | Render cannot connect to Atlas | In MongoDB Atlas, go to **Network Access** &rarr; Ensure IP `0.0.0.0/0` is active. In **Database Access**, verify user credentials. |
| **API calls fail with "Unable to reach backend API"** | Render free instance is sleeping | Render free tier spins down web services after 15 minutes of inactivity. The first request takes 30-50 seconds to spin up. Wait 45 seconds and click "Retry Connection". |
| **CORS error in browser console** | Backend blocking origin | Ensure Render environment variable `FRONTEND_URL` is set to `https://<YOUR-GITHUB-USERNAME>.github.io`. Our `backend/server.js` automatically allows all `*.github.io` origins. |

---

## 8. How to Redeploy After Code Changes

Whenever you make improvements to the code in the future:
```bash
git add .
git commit -m "fix: update monitoring features"
git push origin main
```
- **Backend on Render:** Render automatically detects pushes to `main` and redeploys the web service within 1-2 minutes.
- **Frontend on GitHub Pages:** GitHub Actions automatically runs `.github/workflows/deploy.yml`, builds React with your production API URL, and deploys the new static site.
