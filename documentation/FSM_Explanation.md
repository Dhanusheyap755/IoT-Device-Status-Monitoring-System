# Finite State Machine (FSM) Theoretical & Practical Explanation

**Student Register Number:** 24ITR018  
**Project Title:** IoT Device Status Monitoring System  
**College:** Velalar College of Engineering and Technology, Erode  
**Department:** Information Technology  
**Course:** Formal Languages and Automata Theory (FLAT)  

---

## 1. Introduction & Theoretical Motivation

In Formal Languages and Automata Theory (FLAT), a **Deterministic Finite Automaton (DFA)** is a 5-tuple:

$$M = (Q, \Sigma, \delta, q_0, F)$$

Where:
- $Q$ is a non-empty, finite set of states.
- $\Sigma$ is a finite set of input symbols (the alphabet).
- $\delta : Q \times \Sigma \to Q$ is the state transition function.
- $q_0 \in Q$ is the designated start (initial) state.
- $F \subseteq Q$ is the set of final (or operational accepting) states.

In distributed computing and Internet of Things (IoT) systems, devices transition between distinct physical and logical operating conditions. Managing these states via ad-hoc boolean flags (e.g. `isOnline = true`) inevitably introduces race conditions, illegal states (e.g. storing data from an unauthenticated device), and unhandled edge cases. Implementing an explicit **Finite State Machine** guarantees:
1. **Determinism:** For every pair of current state and incoming event $(q, \sigma)$, there exists exactly one well-defined next state $\delta(q, \sigma)$.
2. **Completeness:** The transition table exhaustively defines behaviors across the entire domain $Q \times \Sigma$.
3. **Auditable Integrity:** State transitions are logged chronologically in MongoDB as non-repudiable events.

---

## 2. State Set Definition ($Q$)

$$Q = \{\text{Registered}, \text{Active}, \text{Disconnected}\}$$

1. **`Registered` ($q_0$ - Initial State):**
   - The device record has been provisioned in MongoDB (`deviceId` and `deviceName` saved).
   - No valid telemetry packet has yet been ingested.
   - The device is not yet certified operational.

2. **`Active` ($F$ - Operational Accepting State):**
   - The device has transmitted an authentic, schema-validated sensor telemetry packet or has been explicitly reconnected.
   - Valid temperature and humidity values are being stored in the time-series collection.
   - Heartbeat timestamps are actively updated.

3. **`Disconnected` (Fault / Outage State):**
   - The device has encountered a communication outage, simulated physical drop, or keepalive timeout.
   - Telemetry reception has ceased or become unreachable.

---

## 3. Input Alphabet ($\Sigma$)

$$\Sigma = \{\text{ValidMessage}, \text{InvalidMessage}, \text{CommunicationFailure}, \text{Timeout}, \text{Reconnect}\}$$

1. **`ValidMessage`:** An incoming HTTP POST request containing valid numeric telemetry ($-40^\circ\text{C} \le \text{temp} \le 125^\circ\text{C}$, $0\% \le \text{humidity} \le 100\%$) for a registered `deviceId`.
2. **`InvalidMessage`:** A corrupted, malformed, or out-of-range HTTP transmission (e.g., temperature $= 200^\circ\text{C}$, missing fields).
3. **`CommunicationFailure`:** A network partition, gateway socket failure, or simulated physical packet drop.
4. **`Timeout`:** An expired silence threshold where no telemetry packet was received within the allowable keepalive duration.
5. **`Reconnect`:** An explicit operator command or gateway re-handshake signal restoring connectivity.

---

## 4. Backend Implementation Architecture

The FSM logic is completely encapsulated within `backend/fsm/deviceStateMachine.js`:

```javascript
// Pure evaluation function δ(currentState, event)
const evaluation = evaluateTransition(currentState, event);

// Atomic database persistence:
// 1. Update device state in 'devices' collection
// 2. Append ledger event in 'deviceevents' collection
// 3. Emit alert in 'alerts' collection if required
```

### Determinism Proof
Let $S = |Q| = 3$ and $A = |\Sigma| = 5$.  
The Cartesian product $|Q \times \Sigma| = 3 \times 5 = 15$ distinct inputs.  
All 15 inputs have explicit, unambiguous definitions in `TRANSITION_TABLE`. Hence, the machine is strictly deterministic.

---

## 5. Handling the Critical FLAT Constraint

> **Academic Rule:** *"InvalidMessage from any state must keep current state unchanged, reject the message with HTTP 400, and generate an alert."*

In `backend/middleware/validateMessage.js`:
- If temperature $> 125^\circ\text{C}$ or humidity $> 100\%$, execution halts before the sensor insertion controller is reached.
- The FSM evaluates $\delta(q, \text{InvalidMessage}) = q$.
- The current state in MongoDB remains unmodified.
- An alert record with severity `Warning` and type `INVALID_MESSAGE` is persisted.
- HTTP `400 Bad Request` is returned with full diagnostic JSON.
