# Official Problem Statement

**Project Number:** 18  
**Project Title:** IoT Device Status Monitoring System  
**Student Register Number:** 24ITR018  
**Department:** Information Technology  
**Institution:** Velalar College of Engineering and Technology, Erode  
**Courses:** Full Stack Web Development, Computer Networks, Formal Languages and Automata Theory (FLAT)  

---

## 1. Context and Background
Modern Internet of Things (IoT) ecosystems rely heavily on low-power sensor nodes transmitting continuous telemetry (e.g., ambient temperature, relative humidity, pressure) over distributed networks to central monitoring stations. In production environments, network unreliability, power depletion, sensor degradation, and malicious or corrupted payload transmissions present persistent challenges. A robust IoT ingestion backend must not merely display sensor values; it must rigorously validate incoming packet syntax, detect communication blackouts and keepalive timeouts, and deterministically govern the life-cycle and operational state of every edge device.

## 2. Official Problem Statement
> *"Create a web application that receives sample messages from simulated IoT devices over HTTP and displays their connectivity and sensor values. The backend validates each message, and a finite-state machine manages device states such as Registered, Active, and Disconnected. Invalid messages and simulated communication failures must generate visible alerts."*

## 3. Core Requirements Breakdown

1. **HTTP Ingestion Pipeline:**
   - Establish RESTful endpoints to receive simulated device telemetry payloads via HTTP POST.
   - Accept sensor readings formatted as structured JSON packets containing `deviceId`, `temperature`, `humidity`, and `status`.

2. **Strict Server-Side Validation:**
   - Verify device identity against registered database entities.
   - Restrict numerical temperature ranges ($-40^\circ\text{C}$ to $125^\circ\text{C}$) and relative humidity ranges ($0\%$ to $100\%$).
   - Reject malformed, out-of-range, null, or unknown device transmissions with standard HTTP error codes (`400 Bad Request`, `404 Not Found`).

3. **FLAT Finite State Machine (FSM) Engine:**
   - Implement an explicit backend Deterministic Finite Automaton (DFA) defined as $M = (Q, \Sigma, \delta, q_0, F)$.
   - States: $Q = \{\text{Registered}, \text{Active}, \text{Disconnected}\}$.
   - Input Alphabet: $\Sigma = \{\text{ValidMessage}, \text{InvalidMessage}, \text{CommunicationFailure}, \text{Timeout}, \text{Reconnect}\}$.
   - Prevent invalid messages from elevating devices into operational states.
   - Maintain historical transition ledgers in a persistent database.

4. **Failure & Timeout Simulation:**
   - Provide manual and programmatic mechanisms to simulate gateway packet loss, network disconnection, and heartbeat silence window expiration.
   - Raise contextual alarms categorized by severity (`Info`, `Warning`, `Error`, `Critical`).

5. **Full Stack Integration:**
   - React.js frontend communicating via HTTP REST APIs with an Express.js / Node.js backend.
   - MongoDB database for non-volatile storage of devices, sensor logs, alerts, and state history.
