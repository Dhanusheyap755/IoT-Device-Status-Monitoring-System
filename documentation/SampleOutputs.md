# Representative API Sample Outputs

**Student Register Number:** 24ITR018  
**Project Title:** IoT Device Status Monitoring System  
**College:** Velalar College of Engineering and Technology, Erode  
**Department:** Information Technology  

---

## 1. Health & Automata Specification Check (`GET /api/health`)

**Status Code:** `200 OK`

```json
{
  "status": "healthy",
  "project": "IoT Device Status Monitoring System",
  "studentRegNo": "24ITR018",
  "institution": "Velalar College of Engineering and Technology, Erode",
  "department": "Department of Information Technology",
  "course": "Full Stack Web Development, Computer Networks, FLAT",
  "uptimeSeconds": 342,
  "timestamp": "2026-11-13T15:50:00.000Z",
  "database": {
    "connected": true,
    "state": "Connected",
    "host": "127.0.0.1",
    "databaseName": "iot_monitoring"
  },
  "fsmSpecification": {
    "formalTuple": "M = (Q, Σ, δ, q0, F)",
    "states": ["Registered", "Active", "Disconnected"],
    "initialState": "Registered",
    "activeState": "Active",
    "events": [
      "ValidMessage",
      "InvalidMessage",
      "CommunicationFailure",
      "Timeout",
      "Reconnect"
    ]
  }
}
```

---

## 2. Device Registration Output (`POST /api/devices/register`)

**Status Code:** `201 Created`

```json
{
  "success": true,
  "message": "Device IOT004 registered successfully in state [Registered].",
  "data": {
    "_id": "6734c56890ab1234567890ef",
    "deviceId": "IOT004",
    "deviceName": "Warehouse Thermal Monitor",
    "state": "Registered",
    "temperature": null,
    "humidity": null,
    "lastSeen": "2026-11-13T15:51:00.000Z",
    "createdAt": "2026-11-13T15:51:00.000Z",
    "updatedAt": "2026-11-13T15:51:00.000Z"
  }
}
```

---

## 3. Valid Sensor Message Processing (`POST /api/devices/message`)

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "Sensor message processed successfully for device IOT001. FSM transitioned to [Active].",
  "data": {
    "reading": {
      "_id": "6734c57090ab1234567890fa",
      "deviceId": "IOT001",
      "temperature": 28.5,
      "humidity": 62.0,
      "status": "online",
      "receivedAt": "2026-11-13T15:52:10.000Z"
    },
    "device": {
      "deviceId": "IOT001",
      "deviceName": "Temperature Sensor",
      "state": "Active",
      "temperature": 28.5,
      "humidity": 62.0,
      "lastSeen": "2026-11-13T15:52:10.000Z"
    },
    "fsmTransition": {
      "previousState": "Registered",
      "event": "ValidMessage",
      "currentState": "Active",
      "stateChanged": true,
      "action": "Promote device from Registered to Active and record sensor telemetry",
      "timestamp": "2026-11-13T15:52:10.000Z"
    }
  }
}
```

---

## 4. Invalid Message Rejection (Temperature $= 200^\circ\text{C}$)

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "error": "Message Validation Failed",
  "deviceId": "IOT001",
  "validationErrors": [
    "Temperature (200°C) is out of range. Allowed range is -40°C to 125°C."
  ],
  "message": "The submitted IoT sensor message violates validation constraints. State remains unchanged and an alert was logged."
}
```

---

## 5. Communication Failure Simulation (`POST /api/devices/failure`)

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "Communication failure simulated for device IOT001. State changed to [Disconnected].",
  "data": {
    "deviceId": "IOT001",
    "previousState": "Active",
    "currentState": "Disconnected",
    "event": "CommunicationFailure",
    "stateChanged": true,
    "action": "Transition from Active to Disconnected due to simulated/actual network failure",
    "alert": {
      "id": "6734c59990ab12345678910a",
      "type": "COMMUNICATION_FAILURE",
      "message": "Communication failure detected on device IOT001: Gateway socket timeout. Device state changed to [Disconnected].",
      "severity": "Error"
    }
  }
}
```

---

## 6. Device Reconnection Output (`POST /api/devices/IOT001/reconnect`)

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "Device IOT001 reconnected successfully. Current state is [Active].",
  "data": {
    "deviceId": "IOT001",
    "previousState": "Disconnected",
    "currentState": "Active",
    "event": "Reconnect",
    "stateChanged": true,
    "action": "Restore device to Active state via operator reconnection trigger"
  }
}
```
