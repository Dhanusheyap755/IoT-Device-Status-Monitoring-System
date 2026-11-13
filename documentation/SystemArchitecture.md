# System Architecture & Technical Design

**Student Register Number:** 24ITR018  
**Project Title:** IoT Device Status Monitoring System  
**College:** Velalar College of Engineering and Technology, Erode  
**Department:** Information Technology  

---

## 1. High-Level Architectural Overview

The IoT Device Status Monitoring System follows a classic, decoupled three-tier architectural paradigm:

```
[ Simulated IoT Nodes / Dashboard ]
                 │
                 │ HTTP / REST (JSON)
                 ▼
┌────────────────────────────────────────────────────────┐
│             Node.js / Express.js Backend               │
│                                                        │
│  ┌──────────────────────┐    ┌──────────────────────┐  │
│  │ Validation Middleware│───▶│  FSM Engine (FLAT)   │  │
│  └──────────────────────┘    └──────────────────────┘  │
│            │                             │             │
│            ▼                             ▼             │
│  ┌──────────────────────────────────────────────────┐  │
│  │    REST Controllers & Service Dispatchers        │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────┬───────────────────────────────┘
                         │
                         │ Mongoose ODM / TCP Wire Protocol
                         ▼
┌────────────────────────────────────────────────────────┐
│                   MongoDB Database                     │
│                                                        │
│  • devices         • sensorreadings                    │
│  • alerts          • deviceevents (FSM History)        │
└────────────────────────────────────────────────────────┘
```

---

## 2. Tier Details

### A. Presentation Tier (Frontend UI)
- **Framework:** React 19 / Vite.
- **Styling:** Modern, professional blue (`#1e40af`, `#2563eb`), white, and light-grey palette with subtle borders, rounded containers, and responsive desktop/tablet/mobile layouts.
- **Modular Components:**
  - `Header.jsx`: Displays system branding, student register number (`24ITR018`), and a live database connectivity pulse indicator.
  - `Sidebar.jsx`: Accessible navigation between Overview, Device Roster, Sensor Logs, Alerts, FSM Visualizer, Simulation Controls, and FLAT Documentation.
  - `OverviewDashboard.jsx`: Executive summary cards, operational percentages, and quick telemetry tables.
  - `DeviceManagementPage.jsx`: Device registration with client-side pattern validation and detailed inspection modals.
  - `SensorMonitoringPage.jsx`: Numerical readings with engineering units ($^\circ\text{C}$, $\%$ RH), filters, and historical logs.
  - `AlertsPage.jsx`: Filterable anomaly logs categorized by severity (`Info`, `Warning`, `Error`).
  - `FsmVisualizerPage.jsx`: Real-time active state highlight and chronological state transition audit trail.
  - `SimulationControlsPage.jsx`: Interactive command deck with live HTTP API response inspector.
  - `Footer.jsx`: Academic institutional attribution.

### B. Application & Logic Tier (Backend API)
- **Runtime:** Node.js v25+ with Express.js framework.
- **Validation Layer:** `backend/middleware/validateMessage.js` acts as the network gatekeeper, enforcing strict schema compliance before any business logic executes.
- **Automata Engine:** `backend/fsm/deviceStateMachine.js` isolates all state evaluation, guaranteeing that device state transitions adhere strictly to automata theoretical constraints.
- **Error Handling:** Centralized middleware (`backend/middleware/errorHandler.js`) catching schema violations, duplicate keys (HTTP 409), malformed parameters (HTTP 400), and database connection drops (HTTP 503).

### C. Data Persistence Tier (MongoDB)
- **Collections:**
  - `devices`: Primary device records (`deviceId`, `deviceName`, `state`, `temperature`, `humidity`, `lastSeen`).
  - `sensorreadings`: Time-series telemetry logs (`deviceId`, `temperature`, `humidity`, `status`, `receivedAt`).
  - `alerts`: Security and operational alerts (`deviceId`, `alertType`, `message`, `severity`, `createdAt`).
  - `deviceevents`: Non-repudiable state transition ledger (`deviceId`, `previousState`, `event`, `currentState`, `details`, `timestamp`).
