# Academic & Practical Test Cases

**Student Register Number:** 24ITR018  
**Project Title:** IoT Device Status Monitoring System  
**College:** Velalar College of Engineering and Technology, Erode  
**Department:** Information Technology  

---

## Complete Test Case Execution Matrix

| Test ID | Test Scenario | Input Payload / Action | Expected HTTP Status | Expected FSM State Transition | Expected Action & Output | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Register New Device | `POST /api/devices/register`<br>`{"deviceId": "IOT001", "deviceName": "Temperature Sensor"}` | `201 Created` | `None` &rarr; `Registered` | Device created with initial FSM state $q_0 = \text{Registered}$. Registration alert generated. | **PASSED** |
| **TC-02** | Send Valid Message | `POST /api/devices/message`<br>`{"deviceId": "IOT001", "temperature": 28.5, "humidity": 62, "status": "online"}` | `200 OK` | `Registered` &rarr; `Active` | Reading saved in MongoDB; device promoted to Active operational state; timestamp refreshed. | **PASSED** |
| **TC-03** | Send Subsequent Valid Message | `POST /api/devices/message`<br>`{"deviceId": "IOT001", "temperature": 29.1, "humidity": 60, "status": "online"}` | `200 OK` | `Active` &rarr; `Active` (Self-Loop) | Second reading persisted; device maintains Active state; state history reflects self-loop. | **PASSED** |
| **TC-04** | Ingest Temperature $> 125^\circ\text{C}$ | `POST /api/devices/message`<br>`{"deviceId": "IOT001", "temperature": 200, "humidity": 65, "status": "online"}` | `400 Bad Request` | `Active` &rarr; `Active` (Unchanged) | Message rejected; no reading saved; `INVALID_MESSAGE` warning alert logged. State remains Active. | **PASSED** |
| **TC-05** | Ingest Humidity $> 100\%$ | `POST /api/devices/message`<br>`{"deviceId": "IOT001", "temperature": 25, "humidity": 150, "status": "online"}` | `400 Bad Request` | `Active` &rarr; `Active` (Unchanged) | Message rejected; `INVALID_MESSAGE` warning alert logged. Reading discarded. | **PASSED** |
| **TC-06** | Telemetry with Missing `deviceId` | `POST /api/devices/message`<br>`{"temperature": 27.5, "humidity": 55, "status": "online"}` | `400 Bad Request` | N/A | Server rejects request with error `"Device ID is mandatory"`. Global alert logged. | **PASSED** |
| **TC-07** | Simulate Communication Failure | `POST /api/devices/failure`<br>`{"deviceId": "IOT001", "reason": "Gateway packet drop"}` | `200 OK` | `Active` &rarr; `Disconnected` | Device demoted to Disconnected; `COMMUNICATION_FAILURE` error alert logged; dashboard reflects red badge. | **PASSED** |
| **TC-08** | Simulate Heartbeat Timeout | `POST /api/devices/timeout`<br>`{"deviceId": "IOT001", "durationSeconds": 45}` | `200 OK` | `Active` &rarr; `Disconnected` | Device demoted to Disconnected; `TIMEOUT` warning alert recorded; event ledger updated. | **PASSED** |
| **TC-09** | Reconnect Disconnected Device | `POST /api/devices/IOT001/reconnect` | `200 OK` | `Disconnected` &rarr; `Active` | Device state restored to Active; `RECONNECTION` informational alert logged. | **PASSED** |
| **TC-10** | Register Duplicate Device ID | `POST /api/devices/register`<br>`{"deviceId": "IOT001", "deviceName": "Duplicate Sensor"}` | `409 Conflict` | Unchanged | Registration rejected with `"A device with ID IOT001 already exists"`. Database integrity preserved. | **PASSED** |
| **TC-11** | Submit Invalid Form Data in UI | Submit registration form with invalid format (e.g., `SENSOR_99`) | N/A (Client Block) | Unchanged | Form input border turns red; error text `"Must follow format IOT followed by 3+ digits"` displayed; submission blocked. | **PASSED** |
| **TC-12** | Inspect Historical Sensor Readings | `GET /api/readings/IOT001` | `200 OK` | Read-only | Returns list of all previously persisted valid sensor readings with timestamps and units. | **PASSED** |
