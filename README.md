# IoT Device Status Monitoring System

**Course:** Full Stack Web Development | Computer Networks | Formal Languages and Automata Theory (FLAT)  
**Project Number:** 18  
**Student Register Number:** 24ITR018  
**Department:** Department of Information Technology  
**Institution:** Velalar College of Engineering and Technology, Erode  

---

## 1. Official Problem Statement
> *"Create a web application that receives sample messages from simulated IoT devices over HTTP and displays their connectivity and sensor values. The backend validates each message, and a finite-state machine manages device states such as Registered, Active, and Disconnected. Invalid messages and simulated communication failures must generate visible alerts."*

---

## 2. Project Objectives
- Implement an explicit backend **Deterministic Finite Automaton (DFA)** $M = (Q, \Sigma, \delta, q_0, F)$ managing device states (`Registered`, `Active`, `Disconnected`).
- Ingest simulated IoT telemetry packets over HTTP POST with dual-layer validation (React frontend + Express backend).
- Guarantee that invalid messages strictly preserve device state while generating visible security/validation alerts.
- Provide interactive simulation controls for communication failures, heartbeat timeouts, out-of-range sensor injections, and manual/auto reconnections.
- Persist all device records, telemetry history, alerts, and state transition ledgers in MongoDB via Mongoose.

---

## 3. Technologies Used
- **Frontend:** React 19, Vite, Tailwind CSS, Lucide SVG Icons.
- **Backend Runtime:** Node.js (v20+ / v25+).
- **Web Framework:** Express.js 4.
- **Database:** MongoDB with Mongoose ODM (Local or MongoDB Atlas).
- **Communication Protocol:** RESTful HTTP JSON APIs with CORS.
- **Automata Modeling:** Pure JavaScript Deterministic FSM Engine (`backend/fsm/deviceStateMachine.js`).
- **Testing:** Node.js native test runner (`node --test`).

---

## 4. Finite State Machine (FLAT Requirement)

### Mathematical 5-Tuple Definition:
$$M = (Q, \Sigma, \delta, q_0, F)$$

- **States ($Q$):** `Registered`, `Active`, `Disconnected`
- **Alphabet ($\Sigma$):** `ValidMessage`, `InvalidMessage`, `CommunicationFailure`, `Timeout`, `Reconnect`
- **Initial State ($q_0$):** `Registered` (all newly provisioned devices)
- **Accepting / Operational State ($F$):** `Active`

### State Transition Diagram:
```
           [ Provision ]
                 │
                 ▼
          ( Registered ) [q0] ──[ ValidMessage ]───┐
                 │                                 │
                 │ [Failure / Timeout]             ▼
                 ▼                           ( Active ) [F] ↺ [ValidMessage: Store]
          ( Disconnected ) ──[ Valid / Reconnect ]─┘
                 ↺ [Failure / Timeout / Invalid]
```
*(Vector SVG diagram available at `documentation/StateTransitionDiagram.svg` and Mermaid source at `documentation/StateTransitionDiagram.mmd`)*

### State Transition Table ($\delta: Q \times \Sigma \to Q$):

| Current State ($q$) | Input / Event ($\sigma$) | Next State ($\delta(q, \sigma)$) | Action Taken & Persistence |
| :--- | :--- | :--- | :--- |
| **Registered** | `ValidMessage` | **Active** | Promote to Active; save reading in MongoDB; update lastSeen. |
| **Registered** | `InvalidMessage` | **Registered** | Reject with HTTP 400; state unchanged; log Warning alert. |
| **Registered** | `CommunicationFailure` | **Disconnected** | Demote to Disconnected; log Error alert. |
| **Registered** | `Timeout` | **Disconnected** | Demote to Disconnected; log Warning alert. |
| **Registered** | `Reconnect` | **Active** | Operator activation; state becomes Active; log Info alert. |
| **Active** | `ValidMessage` | **Active** | Self-loop: maintain Active; save telemetry; refresh lastSeen. |
| **Active** | `InvalidMessage` | **Active** | Self-loop: maintain Active; reject with HTTP 400; log alert. |
| **Active** | `CommunicationFailure` | **Disconnected** | Demote to Disconnected; raise communication outage alert. |
| **Active** | `Timeout` | **Disconnected** | Demote to Disconnected; raise keepalive timeout alert. |
| **Active** | `Reconnect` | **Active** | Reaffirm operational state; maintain Active. |
| **Disconnected** | `ValidMessage` | **Active** | Auto-recovery: restore to Active; save valid reading. |
| **Disconnected** | `Reconnect` | **Active** | Operator command: restore device to Active state. |
| **Disconnected** | `CommunicationFailure` | **Disconnected** | Self-loop: maintain Disconnected; log failure alert. |
| **Disconnected** | `Timeout` | **Disconnected** | Self-loop: maintain Disconnected; log timeout alert. |
| **Disconnected** | `InvalidMessage` | **Disconnected** | Self-loop: maintain Disconnected; reject with HTTP 400. |

---

## 5. Input Validation Rules

### Mandatory Validation Constraints (`backend/middleware/validateMessage.js`):
1. **`deviceId`:** Mandatory string matching regex pattern `/^IOT\d{3,}$/` (e.g., `IOT001`). Must match an already registered device.
2. **`temperature`:** Mandatory number between **$-40^\circ\text{C}$ and $125^\circ\text{C}$**.
3. **`humidity`:** Mandatory number between **$0\%$ and $100\%$**.
4. **`status`:** Mandatory string, must be either `"online"` or `"offline"`.
5. Non-numeric inputs, missing keys, nulls, and booleans are immediately rejected with **HTTP 400 Bad Request**.
6. Rejected messages trigger the FSM `InvalidMessage` event: the device's state remains untouched, and an alert is recorded in the `alerts` collection.

---

## 6. Database Collections & Schemas

### 1. `Device` Collection (`backend/models/Device.js`)
- `deviceId`: String, unique, uppercase, indexed.
- `deviceName`: String.
- `state`: String, enum: `['Registered', 'Active', 'Disconnected']`, default: `'Registered'`.
- `temperature`: Number, nullable.
- `humidity`: Number, nullable.
- `lastSeen`: Date.
- `createdAt`, `updatedAt`: Timestamps.

### 2. `SensorReading` Collection (`backend/models/SensorReading.js`)
- `deviceId`: String, indexed.
- `temperature`: Number ($-40$ to $125$).
- `humidity`: Number ($0$ to $100$).
- `status`: String (`online`/`offline`).
- `receivedAt`: Date, indexed.

### 3. `Alert` Collection (`backend/models/Alert.js`)
- `deviceId`: String, indexed.
- `alertType`: Enum (`INVALID_MESSAGE`, `COMMUNICATION_FAILURE`, `TIMEOUT`, `RECONNECTION`, `REGISTRATION`, `SYSTEM_INFO`).
- `message`: String.
- `severity`: Enum (`Info`, `Warning`, `Error`, `Critical`).
- `createdAt`: Date, indexed.

### 4. `DeviceEvent` Collection (`backend/models/DeviceEvent.js`)
- `deviceId`: String, indexed.
- `previousState`: String (`None`, `Registered`, `Active`, `Disconnected`).
- `event`: String (`Register`, `ValidMessage`, `InvalidMessage`, `CommunicationFailure`, `Timeout`, `Reconnect`).
- `currentState`: String.
- `details`: Mixed metadata (reasons, errors, telemetry IDs).
- `timestamp`: Date, indexed.

---

## 7. REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check, DB connection state, and formal FSM specifications |
| `GET` | `/api/devices` | List all registered devices with live states and last readings |
| `GET` | `/api/devices/:id` | Fetch single device details, recent readings, and state history |
| `POST` | `/api/devices/register` | Register new device (`{ deviceId, deviceName }`) in state `Registered` |
| `POST` | `/api/devices/message` | Ingest sensor telemetry (`{ deviceId, temperature, humidity, status }`) |
| `POST` | `/api/devices/failure` | Simulate network communication failure (`{ deviceId, reason }`) |
| `POST` | `/api/devices/timeout` | Simulate device silence timeout (`{ deviceId, durationSeconds }`) |
| `POST` | `/api/devices/:id/reconnect` | Manually restore device to `Active` state |
| `GET` | `/api/devices/stats` | Aggregated dashboard counts, state distribution, and recent logs |
| `GET` | `/api/alerts` | List system alerts with optional filters (`deviceId`, `severity`) |
| `DELETE` | `/api/alerts/:id` | Dismiss/delete a specific alert |
| `GET` | `/api/readings/:id` | Get telemetry history for a specific device |
| `GET` | `/api/readings` | Get recent telemetry streams across all devices |
| `GET` | `/api/history/:id` | Get chronological FSM state transition audit history |

---

## 8. Installation & Setup Instructions

### Prerequisites:
- **Node.js** (v18 or higher; tested on v25)
- **MongoDB** (Local Community Server running on `mongodb://127.0.0.1:27017` or a free MongoDB Atlas cloud URI)

### Step 1: Open Project in VS Code
Open the project directory in your terminal or VS Code:
```bash
cd IoT-Device-Status-Monitoring-System
```

### Step 2: Configure MongoDB
If running MongoDB locally, start the MongoDB service:
```bash
# Windows Command Prompt / PowerShell:
mongod
# Or if running as a Windows Service:
net start MongoDB
```
*Note: If using MongoDB Atlas, update `backend/.env` with your connection string:*
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/iot_monitoring
```

### Step 3: Install Dependencies
```bash
# Backend dependencies:
cd backend
npm install

# Frontend dependencies:
cd ../frontend
npm install
```

### Step 4: Run Automated Tests
Verify all 22 FSM and input validation test suites:
```bash
cd ../backend
npm test
```
*Output: 22 pass, 0 fail.*

### Step 5: Start the Backend Server
```bash
cd backend
npm start
```
*Server starts on `http://localhost:5000`.*  
*Health check URL: `http://localhost:5000/api/health`.*

### Step 6: Start the React Frontend
In a new terminal window:
```bash
cd frontend
npm run dev
```
*Frontend opens at `http://localhost:5173`.*

---

## 9. How to Test Each Simulation

Open Chrome at `http://localhost:5173` and navigate using the left sidebar:

1. **Test Registration:** Go to **Device Management**, enter `deviceId: IOT004` and `deviceName: Warehouse Climate Monitor`. Click **Register Device**. The device appears with state `Registered (q0)`.
2. **Test Valid Ingestion:** Go to **Simulation Controls**, choose `IOT001`, enter temperature `28.5`, humidity `62.0`, and click **Send Valid Message**. The state transitions to `Active`, readings are stored, and the response console displays HTTP 200.
3. **Test Invalid Temperature (200°C):** In **Simulation Controls**, click **Invalid Temperature (200°C)**. The response console shows HTTP 400 Bad Request, the device state remains unchanged, and an alert appears in **System Alerts**.
4. **Test Invalid Humidity (150%):** Click **Invalid Humidity (150%)**. HTTP 400 is returned, and an alert is logged.
5. **Test Communication Failure:** Click **Simulate Failure**. The device state changes to `Disconnected`, and an Error alert is logged.
6. **Test Heartbeat Timeout:** Click **Simulate Timeout**. The device state changes to `Disconnected`, and a Warning alert is logged.
7. **Test Reconnection:** Click **Reconnect Device**. The device state returns to `Active`.
8. **Test FSM Audit Trail:** Open **FSM Visualizer** to view the live highlighted state node and the chronological transition ledger.

---

## 10. Sample Test Payloads
Sample JSON files are prepared in the `sample-inputs/` folder:
- `sample-inputs/valid-message.json`: Valid 28.5°C, 62% RH message.
- `sample-inputs/invalid-temperature.json`: Out-of-bounds 200°C.
- `sample-inputs/invalid-humidity.json`: Out-of-bounds 150%.
- `sample-inputs/missing-field.json`: Missing `deviceId`.
- `sample-inputs/unknown-device.json`: Unregistered `IOT999`.
- `sample-inputs/communication-failure.json`: Gateway failure trigger.
- `sample-inputs/timeout.json`: Heartbeat timeout trigger.

---

## 11. GitHub Repository Push Commands

To initialize and push this project to your GitHub account:

```bash
# 1. Initialize Git repository
git init

# 2. Add all files (respecting .gitignore)
git add .

# 3. Create initial commit
git commit -m "feat: complete IoT Device Status Monitoring System with FLAT FSM and MERN stack - 24ITR018"

# 4. Set default branch to main
git branch -M main

# 5. Link your remote GitHub repository
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/IoT-Device-Status-Monitoring-System.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 12. Public Cloud Deployment (GitHub Pages + Render + MongoDB Atlas)

A complete step-by-step production deployment manual is provided in [`documentation/DEPLOYMENT_GUIDE.md`](documentation/DEPLOYMENT_GUIDE.md).

### Deployment Summary:
- **Frontend Hosting:** GitHub Pages (`https://<YOUR-USERNAME>.github.io/IoT-Device-Status-Monitoring-System/`)
- **Backend Hosting:** Render Web Service (`https://<YOUR-RENDER-BACKEND-URL>.onrender.com`)
- **Database:** MongoDB Atlas (Cloud Cluster M0)
- **CI/CD:** Automated GitHub Actions workflow (`.github/workflows/deploy.yml`) builds React with repository variable `VITE_API_BASE_URL` and deploys automatically upon pushing to `main`.

---

## 13. Troubleshooting Common Issues

1. **MongoDB Connection Warning (HTTP 503):**
   - Ensure `mongod` is running on your machine or configure `MONGODB_URI` in `backend/.env`.
   - The health endpoint `http://localhost:5000/api/health` indicates MongoDB status at all times.

2. **Port 5000 / 5173 already in use:**
   - Change `PORT=5001` in `backend/.env` and update `VITE_API_URL=http://localhost:5001/api` in `frontend/.env`.

3. **CORS Errors:**
   - The backend server is pre-configured with permissive CORS for `http://localhost:5173`. Ensure both servers are running.

---

**Developed & Submitted By:**  
Register Number: **24ITR018**  
Department of Information Technology  
Velalar College of Engineering and Technology, Erode - 638012
