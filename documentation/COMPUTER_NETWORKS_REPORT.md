# Computer Networks Analysis & Architecture Report
## IoT Device Status Monitoring System

**Course:** IT2302 – Computer Networks  
**Department:** Department of Information Technology  
**Institution:** Velalar College of Engineering and Technology (Autonomous), Erode – 638 012  
**Faculty In-Charge:** Prof. / Dr. Kavitha (Kavitha Mam), Department of Information Technology  
**Student Name:** DHANUSHEYA P  
**Register Number:** 24ITR018  
**Class:** B.Tech. Information Technology (Third Year / 2026 Batch)  
**Project GitHub Repository:** [https://github.com/Dhanusheyap755/IoT-Device-Status-Monitoring-System](https://github.com/Dhanusheyap755/IoT-Device-Status-Monitoring-System)  
**Live Deployed Application:** [https://dhanusheyap755.github.io/IoT-Device-Status-Monitoring-System/](https://dhanusheyap755.github.io/IoT-Device-Status-Monitoring-System/)  
**Backend API Service:** [https://iot-monitoring-backend-p9h0.onrender.com](https://iot-monitoring-backend-p9h0.onrender.com)  

---

## 1. Network Topology & Device Interconnection

### 1.1 Architecture & Topology Classification
The IoT Device Status Monitoring System operates on a **Hybrid Client-Server Star Topology** interconnected over a **Wide Area Network (WAN / Public Internet)**, integrated with Edge Computing and Distributed Cloud Infrastructure:

1. **Edge Client Tier (IoT Simulated Sensors & Browser Dashboard):**
   - Simulated IoT devices generate telemetry payloads (Temperature, Humidity, Battery, Status) and communicate as HTTP clients.
   - The user interface is a React Single-Page Application (SPA) delivered via GitHub Pages Anycast Content Delivery Network (CDN).
2. **Intermediate Network Devices Tier:**
   - Client Network Interface Card (NIC) connecting to Local Area Network (LAN) via Wi-Fi (IEEE 802.11) or Ethernet (IEEE 802.3).
   - Local Gateway / Wi-Fi Router performing DHCP IP assignment and Network Address Translation (NAT).
   - Internet Service Provider (ISP) Edge Routers, BGP Autonomous Systems (AS), and Tier-1 Internet Backbones.
   - Cloud Reverse Proxy / Load Balancer (Render Cloud Edge) handling SSL/TLS termination and DDoS mitigation.
3. **Application Server Tier (Render Cloud Web Service):**
   - Central Node.js & Express REST API server hosted in a containerized environment (Singapore / Oregon AWS/GCP regions).
   - Manages HTTP REST endpoints, input boundary validation, and the Deterministic Finite Automaton (FSM) device state engine.
4. **Database Tier (MongoDB Atlas Cloud Cluster):**
   - Cloud-native MongoDB Atlas multi-node Replica Set (Primary, Secondary, Arbiter) connected via secure TLS TCP sockets.

### 1.2 Interconnection Diagram

```
[IoT Sensor / Client Browser] (Source IP: 192.168.1.15 : Ephemeral Port 52140)
             │
             ▼ (Wi-Fi / Ethernet - IEEE 802.11 / 802.3)
[Local Gateway / NAT Router] (LAN: 192.168.1.1 -> Public IP: 103.x.x.x)
             │
             ▼ (WAN - Fiber Optic / BGP Routing / ISP Backbone)
[Cloudflare / GitHub Pages CDN] (Anycast IP: 185.199.108.153 : Port 443)
             │  (Serves Static React Assets)
             ▼
[Render Edge Load Balancer] (Anycast IP: 216.24.57.1 : Port 443)
             │  (TLS Termination & Reverse Proxy)
             ▼
[Node.js + Express Backend Server] (Internal IP: 10.0.x.x : Port 5000)
             │  (Evaluates FSM Transitions: Registered -> Active -> Disconnected)
             ▼ (Encrypted TCP Stream over TLS : Port 27017)
[MongoDB Atlas Cloud Cluster] (Dynamic Host: cluster0.pimkevk.mongodb.net)
   ├── Primary Node (Writes Telemetry & State Audit Events)
   └── Secondary Replica Nodes (High Availability & Redundancy)
```

### 1.3 Role of Network Devices
- **Network Interface Card (NIC):** Converts digital frames into physical electrical/optical/radio signals (PHY layer).
- **Network Switch (Layer 2):** Uses MAC address learning tables to forward frames within the local subnet.
- **Gateway Router (Layer 3):** Performs IP routing, NAT translation, and packet forwarding between LAN and WAN.
- **Firewall & Reverse Proxy (Layers 4–7):** Filters malicious traffic, enforces CORS policies, terminates TLS encryption, and distributes load across backend instances.

---

## 2. IP Addressing Scheme & Communication Analysis

### 2.1 IP Addressing Table

| Network Entity | IP Address Type | Assigned IP / Domain | Subnet Mask / CIDR | Role in System |
| :--- | :--- | :--- | :--- | :--- |
| **Client Workstation / Browser** | Private IPv4 (LAN) | `192.168.1.15` (Dynamic DHCP) | `255.255.255.0` (/24) | Originates HTTP requests, displays dashboard UI |
| **Local Gateway Router** | Private Gateway IP | `192.168.1.1` | `255.255.255.0` (/24) | Default Gateway, NAT Router, DNS forwarder |
| **Client Public IP (WAN)** | Public IPv4 | `103.212.x.x` (Assigned by ISP) | ISP Specific (/20 or /24) | Source IP seen by Internet services |
| **GitHub Pages CDN (Frontend)** | Public Anycast IPv4 | `185.199.108.153` / `185.199.109.153` | Global Anycast | Hosts React frontend Single Page Application |
| **Render Backend Web Service** | Public Anycast IPv4 | `216.24.57.1` (DNS: `iot-monitoring-backend-p9h0.onrender.com`) | Cloud Anycast (/32) | Public REST API Endpoint receiving telemetry |
| **Render Container (Internal)** | Private Container IPv4| `10.0.x.x` / `127.0.0.1` | `255.255.0.0` (/16) | Node.js process listening on port 5000 |
| **MongoDB Atlas Database** | Cloud Public / Dynamic | `cluster0.pimkevk.mongodb.net` | Multi-cloud VPC (/24) | Distributed cloud database storing readings & events |
| **DNS Resolvers** | Public Recursive IPv4 | `8.8.8.8` (Google) / `1.1.1.1` (Cloudflare) | `/32` | Translates domain names to IP addresses |

### 2.2 Private vs. Public IP & Network Address Translation (NAT)
- The client workstation operates on a **Private IPv4 Address** (`192.168.1.15` under RFC 1918), which cannot be routed directly across the public Internet.
- When an IoT telemetry request is sent, the local router executes **Network Address Translation (NAT / NAPT - Network Address Port Translation)**. It rewrites the packet's source IP from `192.168.1.15:52140` to `103.212.x.x:61025` and logs this in its stateful NAT table.
- When the Render backend returns the HTTP response, the router inspects the NAT table, translates the destination back to `192.168.1.15:52140`, and forwards the packet into the local subnet.

### 2.3 Domain Name System (DNS) Resolution Process
Before any HTTP communication occurs, the client performs DNS resolution for `iot-monitoring-backend-p9h0.onrender.com`:
1. Client checks local DNS cache $\rightarrow$ If missing, queries local router (`192.168.1.1`).
2. Router queries Recursive DNS Resolver (`8.8.8.8`).
3. Recursive resolver contacts Root Name Server (`.`), then TLD Server (`.com`), and finally Authoritative Name Server for `onrender.com`.
4. Authoritative server returns A Record: `216.24.57.1`.
5. Client caches IP address and initiates TCP handshake.

---

## 3. Protocols Used & Working Principles

### 3.1 Protocol Stack Overview (OSI & TCP/IP Model Mapping)

| OSI Layer | TCP/IP Layer | Protocols Employed | Role in IoT Monitoring Project |
| :--- | :--- | :--- | :--- |
| **Layer 7: Application** | Application | **HTTP/1.1, HTTPS, REST, DNS** | JSON payload exchange, API routing, state querying |
| **Layer 6: Presentation**| Application | **TLS 1.3, SSL, JSON** | Cryptographic encryption, serialization of sensor objects |
| **Layer 5: Session** | Application | **TLS Session Management** | Maintains persistent and keep-alive socket sessions |
| **Layer 4: Transport** | Transport | **TCP (Transmission Control Protocol)** | Reliable byte stream, 3-way handshake, sequence/ACK |
| **Layer 3: Network** | Internet | **IPv4, ICMP, ARP, BGP** | End-to-end logical packet routing across WAN |
| **Layer 2: Data Link** | Network Access | **Ethernet (802.3), Wi-Fi (802.11)** | Hop-to-hop frame delivery using physical MAC addresses |
| **Layer 1: Physical** | Network Access | **Cat6 Copper, Optical Fiber, RF** | Bit-level electrical/optical transmission over physical media |

### 3.2 Application Layer: HTTP/1.1, HTTPS & RESTful Architecture
- **HTTPS (Hypertext Transfer Protocol Secure):** All API calls (`GET /api/health`, `POST /api/readings`, `POST /api/devices`) use HTTPS to prevent eavesdropping and Man-in-the-Middle (MitM) attacks.
- **RESTful Endpoints:**
  - `POST /api/readings`: Sends sensor telemetry (`deviceId`, `temperature`, `humidity`, `battery`).
  - `GET /api/devices`: Queries registered devices and current FSM states.
  - `GET /api/alerts`: Retrieves active system alerts and validation exceptions.
  - `GET /api/health`: Health probe reporting backend and database connectivity.
- **Stateless Communication:** Each HTTP request contains full authentication and payload data; server state is maintained in MongoDB Atlas.

### 3.3 Transport Layer: Transmission Control Protocol (TCP)
TCP is chosen over UDP because IoT state monitoring demands **100% reliability, in-order packet delivery, and zero loss**:
1. **Three-Way Handshake:**
   - Client sends `[SYN]` (Synchronize Sequence Number).
   - Server responds with `[SYN-ACK]` (Acknowledge and synchronize).
   - Client replies with `[ACK]`. Full-duplex connection established.
2. **Reliability Mechanisms:**
   - Every transmitted byte has a Sequence Number (`Seq`).
   - Receiver acknowledges with Cumulative Acknowledgment Number (`Ack`).
   - If packet is lost, Retransmission Timeout (RTO) triggers automatic retransmission.
3. **Flow Control & Congestion Control:**
   - Receiver advertises Window Size (`win`) to prevent buffer overflow.
   - Algorithms (Slow Start, Congestion Avoidance, Fast Recovery) modulate transmission rates to prevent network congestion.
4. **Connection Teardown:**
   - 4-way termination using `[FIN]` and `[ACK]` flags.

### 3.4 Security Layer: TLS 1.3 Encryption
- Before HTTP data is exchanged, a **TLS 1.3 cryptographic handshake** occurs over TCP:
  1. Client sends `ClientHello` with supported cipher suites and key share.
  2. Server responds with `ServerHello`, digital X.509 certificate, and Diffie-Hellman public key parameter.
  3. Symmetric session keys are derived using elliptic-curve cryptography (ECDHE).
  4. All application payloads are encrypted using authenticated symmetric encryption (AES-256-GCM / ChaCha20-Poly1305).

---

## 4. Port Numbers & Justification

### 4.1 Port Numbers Summary Table

| Port Number | Protocol | Direction | Service / Process | Justification & Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **443** | TCP | Inbound / Outbound | **HTTPS (Secure Web)** | Default standard IANA port for encrypted HTTPS traffic between Browser/Client and Render Backend. |
| **80** | TCP | Inbound / Outbound | **HTTP (Standard Web)** | Used exclusively for HTTP-to-HTTPS automatic 301 redirection to enforce encryption (HSTS). |
| **5000** | TCP | Internal / Bound | **Node.js Express Server** | Internal server listener port (`process.env.PORT \|\| 5000`) bound to `0.0.0.0` inside Render container. |
| **5173** | TCP | Local Dev | **Vite Dev Server** | Default development port used locally for React development and Hot Module Replacement (HMR). |
| **27017** | TCP | Outbound | **MongoDB Atlas Daemon** | Standard IANA port for MongoDB Wire Protocol socket connections over TLS to the cloud cluster. |
| **53** | UDP/TCP | Outbound | **DNS Service** | Resolves domain names (`onrender.com`, `github.io`, `mongodb.net`) to IP addresses. |
| **49152–65535** | TCP | Outbound (Client) | **Ephemeral Ports** | Dynamically allocated source ports assigned by client OS to distinguish multiple concurrent TCP connections. |

### 4.2 Port Justification & Socket Pair Concept
In computer networks, an active communication channel is uniquely identified by a **4-tuple Socket Pair**:
$$\text{Socket Pair} = (\text{Source IP}, \text{Source Port}, \text{Destination IP}, \text{Destination Port})$$

**Example for Telemetry Transmission:**
$$(\text{192.168.1.15} : \text{52140}, \text{216.24.57.1} : \text{443})$$
- The Destination Port **443** directs the incoming packet to the web server's TLS listener.
- The Source Port **52140** ensures that when the server returns the HTTP 200 response, the client operating system directs the packet to the exact browser tab that made the request.

---

## 5. End-to-End Packet Flow & Lifecycle

The following 10-step lifecycle details how an IoT sensor reading travels from the client to the server and returns:

```
[Client]             [DNS: 53]          [Render LB: 443]       [Express: 5000]       [MongoDB: 27017]
   │                     │                     │                      │                      │
   │─── 1. DNS Query ───▶│                     │                      │                      │
   │◀── 2. DNS Answer ───│                     │                      │                      │
   │                                           │                      │                      │
   │─── 3. TCP SYN (Port 52140 -> 443) ───────▶│                      │                      │
   │◀── 4. TCP SYN-ACK (Port 443 -> 52140) ────│                      │                      │
   │─── 5. TCP ACK ───────────────────────────▶│                      │                      │
   │                                           │                      │                      │
   │─── 6. TLS 1.3 Handshake ─────────────────▶│                      │                      │
   │◀── 7. TLS Encrypted Channel Ready ────────│                      │                      │
   │                                           │                      │                      │
   │─── 8. HTTPS POST /api/readings (JSON) ───▶│─── Proxy Pass (Port 5000) ──▶               │
   │                                           │                      │                      │
   │                                           │                      │── 9. Validate & FSM  │
   │                                           │                      │── 10. Write DB ─────▶│
   │                                           │                      │◀── DB Write ACK ─────│
   │                                           │                      │                      │
   │◀── 11. HTTPS 200 OK Response (JSON) ──────│◀── Return Response ──│                      │
   │                                           │                      │                      │
   │─── 12. TCP 4-Way Teardown (FIN/ACK) ─────▶│                      │                      │
```

### 5.1 Step-by-Step Breakdown:
1. **Application Layer Packaging:** The user clicks "Send Valid Message" in the React dashboard. JavaScript serializes the payload: `{"deviceId":"IOT001","temperature":28.5,"humidity":65,"battery":92}` into an HTTP POST request.
2. **DNS Resolution (UDP Port 53):** Client resolves `iot-monitoring-backend-p9h0.onrender.com` to `216.24.57.1`.
3. **TCP Connection (3-Way Handshake):** Client initiates TCP SYN with an ephemeral port (e.g., 52140). Server responds with SYN-ACK, client sends ACK.
4. **TLS 1.3 Cryptographic Handshake:** Cryptographic keys are exchanged using ECDHE; digital certificates are verified; symmetric AES-256 session keys are established.
5. **Encapsulation & Transmission:**
   - **Data:** HTTP Request Header + Encrypted JSON payload.
   - **Transport Layer:** TCP Header added (Source Port: 52140, Dest Port: 443, Seq/Ack numbers, Checksum).
   - **Network Layer:** IP Header added (Source IP: `192.168.1.15`, Dest IP: `216.24.57.1`, TTL: 64, Protocol: 6 for TCP).
   - **Data Link Layer:** Ethernet Frame added (Source MAC, Gateway Router MAC, EtherType: 0x0800).
   - **Physical Layer:** Bits transmitted as RF pulses (Wi-Fi) or electrical signals (Cat6).
6. **WAN Hop Traversal:** Frame reaches local router $\rightarrow$ NAT converts source IP to public IP $\rightarrow$ Packet traverses intermediate ISP routers via BGP shortest path $\rightarrow$ Arrives at Render Edge Network.
7. **Reverse Proxy & Decapsulation:** Render Edge Load Balancer terminates TLS, extracts HTTP stream, and forwards unencrypted traffic internally to port 5000.
8. **Server & FSM Evaluation:** Express executes `validateMessage` middleware:
   - Validates temperature range ($-40^\circ\text{C}$ to $85^\circ\text{C}$).
   - Invokes Finite State Machine: Device transitions from `Registered` to `Active`.
   - Sends database write command over TLS TCP socket to MongoDB Atlas on port 27017.
9. **Database Persistence:** MongoDB Atlas Replica Set writes the document into `sensorreadings` and `deviceevents` collections and returns write acknowledgment.
10. **Response Return Path:** Server constructs HTTP 200 OK response with JSON: `{"success":true,"state":"Active"}`. The packet traverses back through Render proxy $\rightarrow$ ISP $\rightarrow$ Local Gateway (NAT reverse lookup) $\rightarrow$ Client NIC $\rightarrow$ Browser React application updates the UI with glowing green indicator.

---

## 6. Network Simulation Scenarios in the Project

The IoT Monitoring project includes interactive simulations demonstrating real-world Computer Network events:

| Simulation Action | Simulated Network Condition | Protocol / Layer Behavior | System & FSM Response |
| :--- | :--- | :--- | :--- |
| **Send Valid Message** | Normal healthy packet transmission | HTTP 200 OK over TLS | FSM transitions to **`Active`**; Telemetry persisted in MongoDB. |
| **Invalid Temperature (200°C)** | Out-of-bounds telemetry / Corrupt payload | Application Layer Schema Rejection; HTTP 400 Bad Request | FSM **preserves current state**; Anomaly logged to `alerts` collection. |
| **Simulate Comm Failure** | Packet drop, link failure, physical disconnect | Transport layer TCP socket reset / packet drop | FSM transitions to **`Disconnected`**; Critical alert generated. |
| **Simulate Timeout** | Keep-alive heartbeat timeout ($>45\text{s}$) | Inactivity timer expires; TCP keep-alive failure | FSM transitions to **`Disconnected`**; Timeout alert generated. |
| **Reconnect Device** | Link restoration & new TCP session | New 3-way handshake; valid telemetry packet | FSM restored to **`Active`**; Reconnection alert logged. |

---

## 7. GitHub Repository Links & Cloud Deployment Verification

- **GitHub Repository URL:**  
  `https://github.com/Dhanusheyap755/IoT-Device-Status-Monitoring-System`
- **Live Frontend Application (GitHub Pages):**  
  `https://dhanusheyap755.github.io/IoT-Device-Status-Monitoring-System/`
- **Deployed Backend REST API (Render Web Service):**  
  `https://iot-monitoring-backend-p9h0.onrender.com`
- **Backend Health Check Endpoint (Real-time DB & Server Status):**  
  `https://iot-monitoring-backend-p9h0.onrender.com/api/health`
- **Cloud Database Cluster (MongoDB Atlas):**  
  `mongodb+srv://cluster0.pimkevk.mongodb.net/iot_monitoring`

---

*Report prepared and submitted for Computer Networks (Activity 2 / Course Project) by DHANUSHEYA P (24ITR018), Department of Information Technology, Velalar College of Engineering and Technology.*
