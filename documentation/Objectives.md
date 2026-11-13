# Project Objectives & Scope

**Student Register Number:** 24ITR018  
**Project Title:** IoT Device Status Monitoring System  
**College:** Velalar College of Engineering and Technology, Erode  
**Department:** Information Technology  

---

## 1. Primary Academic & Technical Objectives

1. **Deterministic State Modeling (FLAT Integration):**
   - Design and implement a formal Finite State Machine (FSM) in pure backend JavaScript (`backend/fsm/deviceStateMachine.js`).
   - Mathematically formalize all state transitions according to the DFA tuple $M = (Q, \Sigma, \delta, q_0, F)$.
   - Enforce the foundational automata invariant: corrupted or invalid messages ($\text{InvalidMessage}$) must maintain current state ($\delta(q, \text{InvalidMessage}) = q$) and must never transition a node into the operational accepting state ($\text{Active}$).

2. **Full-Stack REST Architecture:**
   - Develop a high-throughput, non-blocking REST API server using Node.js and Express.js.
   - Engineer a responsive, modern single-page dashboard using React.js and Vite following clean design principles (professional blue, white, and light-grey palette).
   - Implement real-time HTTP polling and API service integration for live telemetry and alert notifications.

3. **Database Integrity & Schema Design:**
   - Structure a scalable MongoDB schema utilizing Mongoose with strict validation constraints, indexes, and referential integrity.
   - Maintain isolated collections for `devices`, `sensorreadings`, `alerts`, and `deviceevents` (state transition ledgers).
   - Reject unpersisted mock operations; provide explicit 503 error handling if the database connection is interrupted.

4. **Network & Sensor Fault Simulation:**
   - Implement simulated hardware and network faults allowing an examiner or operator to induce:
     - Synthetic packet drop / gateway disconnection.
     - Keepalive silence window timeouts.
     - Out-of-bounds telemetry injections (e.g., $200^\circ\text{C}$ temperature, $150\%$ humidity).
     - Manual and automated device reconnection flows.

5. **Industrial-Grade Validation & Error Management:**
   - Execute dual-layer validation (client-side form guards and server-side express middleware).
   - Emit categorized, filterable alerts with timestamps and diagnostic metadata.

---

## 2. Project Scope

- **In-Scope:**
  - Automated simulation of multiple IoT hardware devices (e.g., `IOT001` - Temperature Sensor, `IOT002` - Humidity Sensor, `IOT003` - Environmental Sensor).
  - Explicit backend FSM state transitions persisted to MongoDB on every event.
  - Interactive React dashboard with metric overview, device management, sensor history, alert audit logs, interactive FSM visualizer, and simulation control deck.
  - Complete test suite verifying FSM mathematical transitions and input validation schemas.

- **Out-of-Scope (Not Required):**
  - Physical embedded microcontrollers (ESP32/Arduino) are not mandated; HTTP payload simulation fulfills the college specification.
  - Proprietary cloud lock-in (e.g., AWS IoT Core, Firebase) is avoided in favor of open, runnable MERN technologies.
