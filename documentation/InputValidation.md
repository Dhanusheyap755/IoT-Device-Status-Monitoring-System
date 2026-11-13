# Input Validation Specifications & Rules

**Student Register Number:** 24ITR018  
**Project Title:** IoT Device Status Monitoring System  
**College:** Velalar College of Engineering and Technology, Erode  
**Department:** Information Technology  

---

## 1. Validation Philosophy
The IoT Device Status Monitoring System implements **defense-in-depth dual validation**:
1. **Client-Side (React.js):** Provides immediate user feedback, prevents accidental invalid form submissions, and highlights erroneous input fields in red.
2. **Server-Side (Express.js Middleware):** Mandatory authoritative validation. Even if an attacker or automated script bypasses the web UI (e.g., using `curl`, Postman, or Python `requests`), the backend middleware strictly validates the payload before any database operations occur.

---

## 2. Telemetry Payload Schema (`POST /api/devices/message`)

### Sample Valid Message Payload:
```json
{
  "deviceId": "IOT001",
  "temperature": 28.5,
  "humidity": 65.0,
  "status": "online"
}
```

---

## 3. Strict Server-Side Validation Rules

| Field Name | Data Type | Mandatory? | Constraint / Allowed Range | Rejection Behavior |
| :--- | :--- | :--- | :--- | :--- |
| `deviceId` | String | Yes | Must match regular expression `/^IOT\d{3,}$/` (e.g. `IOT001`, `IOT002`). | HTTP 400 Bad Request; message rejected. |
| `deviceId` Existence | Database Query | Yes | Must match an existing registered document in `devices` collection. | HTTP 404 Not Found; alert logged for unknown device. |
| `temperature` | Number (Float/Int) | Yes | $-40.0^\circ\text{C} \le \text{temperature} \le 125.0^\circ\text{C}$. Non-numeric, null, empty strings, and booleans rejected. | HTTP 400 Bad Request; FSM state remains unchanged; `INVALID_MESSAGE` alert logged. |
| `humidity` | Number (Float/Int) | Yes | $0.0\% \le \text{humidity} \le 100.0\%$. Non-numeric, null, empty strings, and booleans rejected. | HTTP 400 Bad Request; FSM state remains unchanged; `INVALID_MESSAGE` alert logged. |
| `status` | String | Yes | Case-insensitive enum: `["online", "offline"]`. | HTTP 400 Bad Request; message rejected. |

---

## 4. Device Registration Schema (`POST /api/devices/register`)

| Field Name | Data Type | Mandatory? | Constraint / Rule | Rejection Behavior |
| :--- | :--- | :--- | :--- | :--- |
| `deviceId` | String | Yes | Format `/^IOT\d{3,}$/`. Must be unique in MongoDB. | HTTP 400 for format errors; HTTP 409 Conflict if `deviceId` already registered. |
| `deviceName` | String | Yes | Length between 2 and 50 characters. Non-empty string. | HTTP 400 Bad Request. |

---

## 5. Sample Validation Error Response Body (HTTP 400)

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
