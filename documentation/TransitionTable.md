# State Transition Table (δ: Q × Σ → Q)

**Student Register Number:** 24ITR018  
**Project Title:** IoT Device Status Monitoring System  
**College:** Velalar College of Engineering and Technology, Erode  
**Department:** Information Technology  
**Course:** Formal Languages and Automata Theory (FLAT)  

---

## 1. Formal Transition Function Representation

The transition function $\delta$ maps the Cartesian product of the finite state set $Q$ and the input alphabet $\Sigma$ back into $Q$:

$$\delta : Q \times \Sigma \longrightarrow Q$$

Where:
- $Q = \{\text{Registered}, \text{Active}, \text{Disconnected}\}$
- $\Sigma = \{\text{ValidMessage}, \text{InvalidMessage}, \text{CommunicationFailure}, \text{Timeout}, \text{Reconnect}\}$
- $q_0 = \text{Registered}$ (Initial State)
- $F = \{\text{Active}\}$ (Operational Accepting State)

---

## 2. Complete State Transition Table

| Current State ($q$) | Input / Event ($\sigma$) | Next State ($\delta(q, \sigma)$) | System Action & Database Side Effect | Alert Generated? |
| :--- | :--- | :--- | :--- | :--- |
| **Registered** | `ValidMessage` | **Active** | Promote device to operational state; persist sensor telemetry record; update `lastSeen`. | No |
| **Registered** | `InvalidMessage` | **Registered** | Reject corrupted/out-of-range payload with HTTP 400; maintain Registered state; log validation warning alert. | Yes (Warning) |
| **Registered** | `CommunicationFailure` | **Disconnected** | Demote device to Disconnected; log communication error alert. | Yes (Error) |
| **Registered** | `Timeout` | **Disconnected** | Demote device to Disconnected due to silence window expiration. | Yes (Warning) |
| **Registered** | `Reconnect` | **Active** | Explicit operator activation; transition to Active; log info alert. | Yes (Info) |
| **Active** | `ValidMessage` | **Active** | Maintain Active state (self-loop); append sensor telemetry to MongoDB; refresh `lastSeen`. | No |
| **Active** | `InvalidMessage` | **Active** | Maintain Active state (self-loop); reject payload with HTTP 400; discard reading; raise warning alert. | Yes (Warning) |
| **Active** | `CommunicationFailure` | **Disconnected** | Demote device from Active to Disconnected; raise high-priority network failure alert. | Yes (Error) |
| **Active** | `Timeout` | **Disconnected** | Demote device to Disconnected; record heartbeat silence window expiration alert. | Yes (Warning) |
| **Active** | `Reconnect` | **Active** | Reaffirm operational status; maintain Active state; log info alert. | Yes (Info) |
| **Disconnected** | `ValidMessage` | **Active** | Automatic recovery: promote device back to Active; persist valid telemetry; raise reconnection alert. | Yes (Info) |
| **Disconnected** | `Reconnect` | **Active** | Manual operator restoration; promote device to Active state; log info alert. | Yes (Info) |
| **Disconnected** | `CommunicationFailure` | **Disconnected** | Maintain Disconnected state (self-loop); record recurrent network outage alert. | Yes (Error) |
| **Disconnected** | `Timeout` | **Disconnected** | Maintain Disconnected state (self-loop); record recurrent timeout alert. | Yes (Warning) |
| **Disconnected** | `InvalidMessage` | **Disconnected** | Maintain Disconnected state (self-loop); reject corrupted payload with HTTP 400; raise validation alert. | Yes (Warning) |

---

## 3. Core Automata Invariants Guaranteed

1. **Safety Invariant 1 (Strict Operational Eligibility):**  
   $$\forall q \in Q, \quad \delta(q, \text{InvalidMessage}) = q$$  
   An invalid message can *never* cause a state transition into $\text{Active}$. Malformed payloads are strictly rejected at the middleware boundary.

2. **Safety Invariant 2 (Fault Containment):**  
   $$\forall q \in Q, \quad \delta(q, \text{CommunicationFailure}) = \text{Disconnected}$$  
   Any network partition or packet failure deterministically transitions the node to $\text{Disconnected}$.

3. **Liveness & Recovery Invariant:**  
   $$\delta(\text{Disconnected}, \text{ValidMessage}) = \text{Active} \quad \land \quad \delta(\text{Disconnected}, \text{Reconnect}) = \text{Active}$$  
   An offline device immediately resumes normal operational reporting upon transmitting an authenticated, validated telemetry packet or receiving an operator reconnect command.
