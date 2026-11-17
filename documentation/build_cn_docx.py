import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls, qn

BASE_DIR = r"C:\Users\abidh\.gemini\antigravity\scratch\IoT-Device-Status-Monitoring-System"
DOCX_OUT = os.path.join(BASE_DIR, "documentation", "CN_ACTIVITY_24ITR018_REPORT.docx")

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_cell_border(cell, **kwargs):
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(f'<w:tcBorders {nsdecls("w")}/>')
    for edge in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
        edge_data = kwargs.get(edge)
        if edge_data:
            tag = f'<w:{edge} {nsdecls("w")} w:val="{edge_data.get("val", "single")}" w:sz="{edge_data.get("sz", 4)}" w:space="0" w:color="{edge_data.get("color", "auto")}"/>'
            tcBorders.append(parse_xml(tag))
        else:
            tag = f'<w:{edge} {nsdecls("w")} w:val="none"/>'
            tcBorders.append(parse_xml(tag))
    tcPr.append(tcBorders)

def build_cn_document():
    doc = docx.Document()

    # Base Normal Style: Times New Roman 12pt
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Times New Roman'
    font.size = Pt(12)
    font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    # Page Margins: 0.6 in (standard professional academic format)
    sec = doc.sections[0]
    sec.top_margin = Inches(0.6)
    sec.bottom_margin = Inches(0.6)
    sec.left_margin = Inches(0.65)
    sec.right_margin = Inches(0.65)
    sec.page_width = Inches(8.27)
    sec.page_height = Inches(11.69)

    # ========================================================
    # COVER PAGE
    # ========================================================
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_before = Pt(8)
    p_inst.paragraph_format.space_after = Pt(2)
    r = p_inst.add_run("VELALAR COLLEGE OF ENGINEERING AND TECHNOLOGY")
    r.font.name = "Times New Roman"
    r.font.size = Pt(16)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(2)
    r = p_sub.add_run("(Autonomous Institution Affiliated to Anna University, Chennai)\nThindal, Erode – 638 012, Tamil Nadu")
    r.font.name = "Times New Roman"
    r.font.size = Pt(11)

    p_dept = doc.add_paragraph()
    p_dept.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dept.paragraph_format.space_before = Pt(4)
    p_dept.paragraph_format.space_after = Pt(12)
    r = p_dept.add_run("DEPARTMENT OF INFORMATION TECHNOLOGY")
    r.font.name = "Times New Roman"
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1E, 0x40, 0xAF)

    p_div = doc.add_paragraph()
    p_div.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_div.paragraph_format.space_after = Pt(14)
    r = p_div.add_run("―" * 52)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    p_course = doc.add_paragraph()
    p_course.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_course.paragraph_format.space_after = Pt(4)
    r = p_course.add_run("IT2302 – COMPUTER NETWORKS")
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1E, 0x40, 0xAF)

    p_rep = doc.add_paragraph()
    p_rep.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_rep.paragraph_format.space_after = Pt(8)
    r = p_rep.add_run("PROJECT NETWORK ARCHITECTURE & COMMUNICATION REPORT")
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_after = Pt(22)
    r = p_title.add_run("IoT Device Status Monitoring System")
    r.font.name = "Times New Roman"
    r.font.size = Pt(18)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    # Student Details Table (Body: 12pt Times New Roman)
    tbl = doc.add_table(rows=7, cols=2)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_widths = [Inches(2.5), Inches(4.5)]
    details = [
        ("Student Name:", "DHANUSHEYA P"),
        ("Register Number:", "24ITR018"),
        ("Class & Year:", "B.Tech. Information Technology (Third Year / 2026 Batch)"),
        ("Course Code & Title:", "IT2302 / Computer Networks"),
        ("Faculty In-Charge:", "Prof. / Dr. Kavitha (Kavitha Mam), Dept. of IT"),
        ("Project Architecture:", "Edge Client-Server over WAN with Cloud REST & DB"),
        ("Date of Submission:", "17-11-2026")
    ]
    for i, (k, v) in enumerate(details):
        row = tbl.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width, c1.width = tbl_widths[0], tbl_widths[1]
        set_cell_background(c0, "F1F5F9")
        set_cell_background(c1, "F8FAFC")
        set_cell_margins(c0, 100, 100, 140, 140)
        set_cell_margins(c1, 100, 100, 140, 140)
        border_spec = {"val": "single", "sz": 4, "color": "CBD5E1"}
        set_cell_border(c0, top=border_spec, bottom=border_spec, left=border_spec, right=border_spec)
        set_cell_border(c1, top=border_spec, bottom=border_spec, left=border_spec, right=border_spec)

        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(k)
        r0.font.name = "Times New Roman"
        r0.font.size = Pt(12)
        r0.font.bold = True
        r0.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(v)
        r1.font.name = "Times New Roman"
        r1.font.size = Pt(12)
        r1.font.bold = True
        r1.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(65)

    # Signatures
    sig_tbl = doc.add_table(rows=1, cols=3)
    sig_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_widths = [Inches(2.3), Inches(2.3), Inches(2.3)]
    sig_labels = ["Signature of the Student", "Signature of Faculty In-Charge\n(Kavitha Mam)", "Signature of HoD / IT"]
    for j, label in enumerate(sig_labels):
        c = sig_tbl.rows[0].cells[j]
        c.width = sig_widths[j]
        set_cell_border(c, top={"val": "single", "sz": 8, "color": "475569"})
        p_s = c.paragraphs[0]
        p_s.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_s.paragraph_format.space_before = Pt(4)
        r_s = p_s.add_run(label)
        r_s.font.name = "Times New Roman"
        r_s.font.size = Pt(11)
        r_s.font.bold = True
        r_s.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

    # ========================================================
    # SECTION 1: TOPOLOGY & NETWORK DEVICE CONNECTION
    # ========================================================
    doc.add_page_break()

    def add_sec_heading(title):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(title)
        r.font.name = "Times New Roman"
        r.font.size = Pt(14)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    def add_sub_heading(title):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(title)
        r.font.name = "Times New Roman"
        r.font.size = Pt(12)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0x1E, 0x40, 0xAF)

    add_sec_heading("1. NETWORK TOPOLOGY & DEVICE INTERCONNECTION")

    add_sub_heading("1.1 Network Architecture & Topology Classification")
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.add_run(
        "The IoT Device Status Monitoring System implements a Hybrid Client-Server Star Topology deployed over a Wide Area Network (WAN / Public Internet). "
        "The system interconnects three distinct tiers: the Edge Client Tier (IoT Simulated Sensors & Browser Dashboard), the Application Server Tier (Render Cloud Web Service), and the Cloud Database Tier (MongoDB Atlas Replica Set)."
    )

    add_sub_heading("1.2 Network Interconnection & Hardware Device Roles")
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.add_run(
        "In this network architecture, several physical and logical network devices work together to guarantee reliable and secure telemetry transmission:\n"
        "• Network Interface Card (NIC): Operates at Physical & Data Link layers (OSI Layers 1 & 2) on the client machine to encode and transmit digital frames over Wi-Fi (IEEE 802.11) or Ethernet (IEEE 802.3).\n"
        "• Network Switch (Layer 2): Maintains a MAC Address Table to forward Ethernet frames within the local subnet without collisions.\n"
        "• Local Gateway Router (Layer 3): Acts as the default gateway (192.168.1.1), provides DHCP dynamic IP configuration, executes Network Address Translation (NAT) to map private IPs to public WAN IPs, and routes packets to the Internet Service Provider (ISP).\n"
        "• ISP Edge Routers & Autonomous Systems (AS): Route packets across the Internet backbone using Border Gateway Protocol (BGP).\n"
        "• Cloud Reverse Proxy & Load Balancer (Render Cloud Edge): Receives incoming HTTPS traffic on Port 443, handles TLS termination, performs DDoS protection, and distributes HTTP requests to backend container instances on Port 5000.\n"
        "• MongoDB Atlas Replica Set Router (Mongos): Routes database write queries across multi-region replica nodes to ensure zero data loss."
    )

    # ASCII Topology Diagram
    add_sub_heading("1.3 Topology Interconnection Diagram")
    p_diag = doc.add_paragraph()
    p_diag.paragraph_format.space_after = Pt(10)
    p_diag.paragraph_format.line_spacing = 1.05
    diag_text = (
        "[IoT Sensor Simulation / Browser Dashboard]\n"
        "    │ (LAN: 192.168.1.15 : Ephemeral Port 52140)\n"
        "    ▼\n"
        "[Local Gateway / NAT Router] (LAN: 192.168.1.1 ──> Public IP: 103.212.x.x)\n"
        "    │\n"
        "    ▼ (WAN / ISP Optical Fiber / BGP Internet Routing)\n"
        "[GitHub Pages Anycast CDN] (185.199.108.153 : Port 443 ──> Serves React SPA)\n"
        "    │\n"
        "    ▼ (HTTPS REST Ingestion: /api/readings)\n"
        "[Render Cloud Load Balancer & Reverse Proxy] (216.24.57.1 : Port 443)\n"
        "    │ (Internal Container Binding: 0.0.0.0 : Port 5000)\n"
        "    ▼\n"
        "[Node.js + Express Backend Server] (Evaluates FSM Automata: Registered -> Active -> Disconnected)\n"
        "    │\n"
        "    ▼ (Secure TLS TCP Socket : Port 27017)\n"
        "[MongoDB Atlas Cloud Database Cluster] (Host: cluster0.pimkevk.mongodb.net)\n"
        "    ├── Primary Database Node (Active Read/Write)\n"
        "    └── Secondary Replica Nodes (Automatic Failover & Redundancy)"
    )
    r_diag = p_diag.add_run(diag_text)
    r_diag.font.name = "Consolas"
    r_diag.font.size = Pt(9.5)
    r_diag.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    # ========================================================
    # SECTION 2: IP ADDRESSING SCHEME
    # ========================================================
    add_sec_heading("2. IP ADDRESSING SCHEME & COMMUNICATION ANALYSIS")

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.add_run(
        "IP addressing provides logical identification and routing for every node across the Internet. "
        "The table below identifies each entity in our IoT monitoring system, its assigned IP address, category, and functional role:"
    )

    # IP Table
    ip_tbl = doc.add_table(rows=7, cols=4)
    ip_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    ip_widths = [Inches(1.8), Inches(1.8), Inches(1.6), Inches(1.8)]

    ip_headers = ["Network Entity", "Assigned IP / Domain", "IP Class / Type", "Functional Role"]
    for j, h in enumerate(ip_headers):
        c = ip_tbl.rows[0].cells[j]
        c.width = ip_widths[j]
        set_cell_background(c, "F1F5F9")
        set_cell_margins(c, 90, 90, 110, 110)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h)
        r.font.name = "Times New Roman"
        r.font.size = Pt(11)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)
        b = {"val": "single", "sz": 5, "color": "CBD5E1"}
        set_cell_border(c, top=b, bottom=b, left=b, right=b)

    ip_rows = [
        ("Client Workstation", "192.168.1.15", "Private IPv4 (Class C, /24)", "Originates simulated IoT HTTP requests & loads UI"),
        ("Local Gateway Router", "192.168.1.1", "Private Gateway IPv4", "Performs DHCP allocation and stateful NAT translation"),
        ("Client Public IP", "103.212.x.x (Dynamic)", "Public Routable IPv4", "Identifies the client LAN across the public Internet"),
        ("GitHub Pages CDN", "185.199.108.153", "Public Anycast IPv4", "Delivers React static bundle via edge caching"),
        ("Render Backend API", "216.24.57.1", "Public Cloud Anycast IPv4", "Receives REST telemetry & executes FSM logic"),
        ("MongoDB Atlas", "cluster0.pimkevk.mongodb.net", "Cloud Distributed Domain", "Hosts persistent sensor readings & alert collections")
    ]

    for i, row_data in enumerate(ip_rows):
        row = ip_tbl.rows[i + 1]
        for j, val in enumerate(row_data):
            c = row.cells[j]
            c.width = ip_widths[j]
            set_cell_background(c, "FFFFFF" if i % 2 == 0 else "F8FAFC")
            set_cell_margins(c, 70, 70, 110, 110)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Times New Roman"
            r.font.size = Pt(10.5)
            if j == 0:
                r.font.bold = True
            b = {"val": "single", "sz": 4, "color": "E2E8F0"}
            set_cell_border(c, top=b, bottom=b, left=b, right=b)

    add_sub_heading("2.1 Network Address Translation (NAT) & Private-to-Public Mapping")
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.add_run(
        "Under RFC 1918, private IP addresses (such as 192.168.1.15) cannot be routed across the Internet. "
        "When an IoT device sends a reading, the local gateway router executes Network Address Port Translation (NAPT). "
        "The router replaces the private source IP (192.168.1.15:52140) with its own public IP (103.212.x.x:61025) and registers this translation in its stateful NAT table. "
        "When Render replies with HTTP 200 OK, the router references the NAT table to route the response back to the private client workstation."
    )

    add_sub_heading("2.2 Domain Name System (DNS) Resolution Process")
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.add_run(
        "Before sending telemetry data, the client must resolve the backend domain 'iot-monitoring-backend-p9h0.onrender.com' into an IP address:\n"
        "1. Client OS checks local DNS cache and hosts file.\n"
        "2. Recursive DNS query is dispatched over UDP Port 53 to Google DNS (8.8.8.8) or Cloudflare DNS (1.1.1.1).\n"
        "3. The resolver navigates the DNS hierarchy: Root Servers (.) ──> TLD Servers (.com) ──> Render Authoritative Name Servers.\n"
        "4. The Authoritative Server returns an 'A' Record pointing to Anycast IP 216.24.57.1.\n"
        "5. The client caches the IP and begins the TCP 3-way handshake."
    )

    # ========================================================
    # SECTION 3: PROTOCOL STACK & WORKING PRINCIPLES
    # ========================================================
    doc.add_page_break()
    add_sec_heading("3. PROTOCOLS USED & WORKING PRINCIPLES")

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.add_run(
        "The IoT monitoring system utilizes a comprehensive protocol stack conforming to both the OSI 7-Layer Reference Model and the TCP/IP 4-Layer Architecture:"
    )

    # OSI Table
    osi_tbl = doc.add_table(rows=6, cols=3)
    osi_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    osi_widths = [Inches(1.8), Inches(1.8), Inches(3.4)]

    osi_headers = ["OSI Layer", "Protocol(s) Used", "Role in IoT Monitoring System"]
    for j, h in enumerate(osi_headers):
        c = ossi = osi_tbl.rows[0].cells[j]
        c.width = osi_widths[j]
        set_cell_background(c, "F1F5F9")
        set_cell_margins(c, 90, 90, 110, 110)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h)
        r.font.name = "Times New Roman"
        r.font.size = Pt(11)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)
        b = {"val": "single", "sz": 5, "color": "CBD5E1"}
        set_cell_border(c, top=b, bottom=b, left=b, right=b)

    osi_rows = [
        ("Layer 7: Application", "HTTP/1.1, HTTPS, REST, DNS", "Transmits serialized JSON telemetry payloads; handles REST endpoints (/api/readings, /api/devices, /api/health)."),
        ("Layer 6: Presentation", "TLS 1.3, SSL, JSON Encoding", "Handles asymmetric/symmetric cryptographic encryption, data formatting, and JSON object serialization."),
        ("Layer 4: Transport", "TCP (Transmission Control Protocol)", "Guarantees reliable, in-order, error-checked telemetry delivery via 3-way handshake, Seq/Ack numbers, and flow control."),
        ("Layer 3: Network", "IPv4, ICMP, ARP, BGP", "Handles logical end-to-end routing of IP datagrams across Autonomous Systems and Internet backbones."),
        ("Layers 1 & 2: Link / Physical", "Ethernet 802.3, Wi-Fi 802.11, Cat6", "Governs framing, MAC addressing, hardware collision avoidance, and bit-level transmission across physical media.")
    ]

    for i, row_data in enumerate(osi_rows):
        row = osi_tbl.rows[i + 1]
        for j, val in enumerate(row_data):
            c = row.cells[j]
            c.width = osi_widths[j]
            set_cell_background(c, "FFFFFF" if i % 2 == 0 else "F8FAFC")
            set_cell_margins(c, 70, 70, 110, 110)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Times New Roman"
            r.font.size = Pt(10.5)
            if j == 0:
                r.font.bold = True
            b = {"val": "single", "sz": 4, "color": "E2E8F0"}
            set_cell_border(c, top=b, bottom=b, left=b, right=b)

    add_sub_heading("3.1 Application Layer: HTTP/1.1 & REST Architecture")
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.add_run(
        "Communication between the IoT simulation client and the backend server follows the RESTful (Representational State Transfer) architectural pattern:\n"
        "• POST /api/readings: Ingests sensor data (deviceId, temperature, humidity, battery). Triggers FSM evaluation and MongoDB persistence.\n"
        "• GET /api/devices: Queries device profiles, metadata, and current finite automaton state (Registered, Active, Disconnected).\n"
        "• GET /api/alerts: Queries active validation exceptions and network anomaly logs.\n"
        "• GET /api/health: Provides live system diagnostic data including database connection state."
    )

    add_sub_heading("3.2 Transport Layer: Transmission Control Protocol (TCP)")
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.add_run(
        "TCP is chosen over UDP for device status monitoring because telemetry records and state transitions require 100% reliable, zero-loss transmission:\n"
        "1. TCP 3-Way Handshake: Client sends SYN ──> Server replies with SYN-ACK ──> Client sends ACK. A reliable full-duplex session is established.\n"
        "2. Sequence & Acknowledgment Numbers: Every segment carries a unique Sequence Number; the receiver acknowledges received bytes, allowing the sender to detect missing segments.\n"
        "3. Flow & Congestion Control: Advertised window sizes prevent receiver buffer overflow, while Congestion Avoidance algorithms prevent router queue collapse.\n"
        "4. Connection Teardown: Uses a 4-way FIN/ACK handshake to cleanly release operating system socket buffers."
    )

    add_sub_heading("3.3 Security Layer: TLS 1.3 Cryptographic Handshake")
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.add_run(
        "All communications are encrypted using Transport Layer Security (TLS 1.3). "
        "During connection establishment, the client verifies Render's X.509 digital certificate signed by a trusted Certificate Authority (Let's Encrypt). "
        "An Elliptic Curve Diffie-Hellman Ephemeral (ECDHE) exchange establishes symmetric AES-256-GCM session keys, ensuring confidentiality, integrity, and non-repudiation."
    )

    # ========================================================
    # SECTION 4: PORT NUMBERS & JUSTIFICATION
    # ========================================================
    doc.add_page_break()
    add_sec_heading("4. PORT NUMBERS & JUSTIFICATION")

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.add_run(
        "Port numbers are 16-bit unsigned integers (0 to 65535) defined at the Transport Layer to identify specific application processes on a host. "
        "The table below details every port used in our system along with its technical justification:"
    )

    # Port Table
    port_tbl = doc.add_table(rows=7, cols=4)
    port_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    port_widths = [Inches(1.1), Inches(1.2), Inches(1.8), Inches(2.9)]

    port_headers = ["Port No.", "Protocol", "Associated Service", "Technical Justification & Purpose"]
    for j, h in enumerate(port_headers):
        c = port_tbl.rows[0].cells[j]
        c.width = port_widths[j]
        set_cell_background(c, "F1F5F9")
        set_cell_margins(c, 90, 90, 110, 110)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h)
        r.font.name = "Times New Roman"
        r.font.size = Pt(11)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)
        b = {"val": "single", "sz": 5, "color": "CBD5E1"}
        set_cell_border(c, top=b, bottom=b, left=b, right=b)

    port_rows = [
        ("443", "TCP", "HTTPS (Secure Web)", "Standard IANA port for encrypted web traffic between client and cloud. Prevents eavesdropping on public networks."),
        ("80", "TCP", "HTTP (Standard Web)", "Standard unencrypted web port. Automatically issues HTTP 301/308 redirects to Port 443 to enforce HTTPS."),
        ("5000", "TCP", "Express Server (Internal)", "Backend application listener port (process.env.PORT || 5000) bound to 0.0.0.0 inside the Render container."),
        ("5173", "TCP", "Vite Dev Server", "Development port for React frontend, providing fast Hot Module Replacement (HMR) during local engineering."),
        ("27017", "TCP", "MongoDB Atlas Daemon", "Standard IANA port for MongoDB Wire Protocol socket connections over TLS to the cloud database cluster."),
        ("49152–65535", "TCP", "Ephemeral Client Ports", "Dynamically allocated by client operating system to uniquely separate concurrent TCP sessions on the client.")
    ]

    for i, row_data in enumerate(port_rows):
        row = port_tbl.rows[i + 1]
        for j, val in enumerate(row_data):
            c = row.cells[j]
            c.width = port_widths[j]
            set_cell_background(c, "FFFFFF" if i % 2 == 0 else "F8FAFC")
            set_cell_margins(c, 70, 70, 110, 110)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Times New Roman"
            r.font.size = Pt(10.5)
            if j == 0:
                r.font.bold = True
            b = {"val": "single", "sz": 4, "color": "E2E8F0"}
            set_cell_border(c, top=b, bottom=b, left=b, right=b)

    add_sub_heading("4.1 Socket Pair Analysis")
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.add_run(
        "At the transport layer, every active communication channel is uniquely identified by a 4-tuple Socket Pair:\n"
        "Socket Pair = (Source IP, Source Port, Destination IP, Destination Port)\n\n"
        "Example Telemetry Transmission:\n"
        "(192.168.1.15 : 52140, 216.24.57.1 : 443)\n\n"
        "• Destination Port 443 directs the packet to Render's HTTPS reverse proxy.\n"
        "• Source Port 52140 ensures that when the HTTP 200 response returns, the client OS routes it directly to the exact browser tab that initiated the request."
    )

    # ========================================================
    # SECTION 5: PACKET FLOW & LIFECYCLE
    # ========================================================
    doc.add_page_break()
    add_sec_heading("5. END-TO-END PACKET FLOW & LIFECYCLE")

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.add_run(
        "The diagram and steps below trace the complete lifecycle of an IoT telemetry message from initial simulation dispatch to database persistence and return response:"
    )

    # Flow Diagram
    p_flow = doc.add_paragraph()
    p_flow.paragraph_format.space_after = Pt(8)
    p_flow.paragraph_format.line_spacing = 1.05
    flow_text = (
        "[Client Workstation]       [Local Router]        [Render Edge]         [Express 5000]       [MongoDB Atlas]\n"
        "        │                        │                     │                     │                     │\n"
        " 1. DNS Query (UDP Port 53) ───> │                     │                     │                     │\n"
        " <── DNS IP: 216.24.57.1 ─────── │                     │                     │                     │\n"
        "        │                        │                     │                     │                     │\n"
        " 2. TCP SYN (Port 52140->443) ─> │ ─> [NAT 61025] ───> │                     │                     │\n"
        " <── TCP SYN-ACK ─────────────── │ <────────────────── │                     │                     │\n"
        " 3. TCP ACK ───────────────────> │ ──────────────────> │                     │                     │\n"
        "        │                        │                     │                     │                     │\n"
        " 4. TLS 1.3 Key Exchange ──────> │ ──────────────────> │ (TLS Termination)   │                     │\n"
        "        │                        │                     │                     │                     │\n"
        " 5. Encrypted HTTPS POST ──────> │ ──────────────────> │ ── Proxy Forward ─> │                     │\n"
        "    Payload: {deviceId, temp}    │                     │    (Port 5000)      │ 6. Schema Check     │\n"
        "        │                        │                     │                     │ 7. FSM: -> Active   │\n"
        "        │                        │                     │                     │ 8. DB Write ──────> │\n"
        "        │                        │                     │                     │ <── DB Write ACK ── │\n"
        "        │                        │                     │ <── HTTP 200 OK ─── │                     │\n"
        " 9. Return HTTP 200 OK <──────── │ <── NAT Demux ───── │                     │                     │\n"
        " 10. Browser UI Glows Green      │                     │                     │                     │"
    )
    r_fl = p_flow.add_run(flow_text)
    r_fl.font.name = "Consolas"
    r_fl.font.size = Pt(8.5)
    r_fl.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    add_sub_heading("5.1 Detailed 10-Step Packet Traversal")
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.add_run(
        "1. Application Serialization: User clicks 'Send Valid Message'. The browser packages JSON: {\"deviceId\":\"IOT001\",\"temperature\":28.5,\"humidity\":65,\"battery\":92}.\n"
        "2. DNS Resolution: Browser queries local DNS over UDP Port 53 to resolve 'iot-monitoring-backend-p9h0.onrender.com' to 216.24.57.1.\n"
        "3. TCP Handshake: Client operating system dispatches TCP SYN segment with an ephemeral port (e.g., 52140). Render responds with SYN-ACK, client replies with ACK.\n"
        "4. TLS 1.3 Negotiation: Digital certificate verification and ECDHE key exchange establish symmetric AES-256 session keys.\n"
        "5. Encapsulation: The payload is encapsulated through the stack: JSON Data ──> HTTP POST ──> TLS Record ──> TCP Segment ──> IP Datagram ──> Ethernet Frame.\n"
        "6. Local NAT & WAN Routing: Client NIC transmits frame to local router ──> Router performs NAT (translates private IP to public IP) ──> Packet traverses ISP BGP backbones to Render.\n"
        "7. Reverse Proxy Decapsulation: Render edge load balancer terminates TLS and passes unencrypted HTTP request internally to Node.js on Port 5000.\n"
        "8. Express Middleware & FSM Processing: Express runs validateMessage middleware. Valid temperature (-40°C to 85°C) passes to FSM engine, which transitions device to 'Active'.\n"
        "9. MongoDB Cloud Socket Write: Server initiates a TLS TCP socket write on Port 27017 to MongoDB Atlas cluster. MongoDB commits the document and returns write acknowledgment.\n"
        "10. Return Response: Backend constructs HTTP 200 OK response with JSON: {\"success\":true,\"state\":\"Active\"}. The packet traverses back to the router, NAT routes it to the client workstation, and the React UI updates in real time."
    )

    # ========================================================
    # SECTION 6: NETWORK SIMULATION SCENARIOS
    # ========================================================
    doc.add_page_break()
    add_sec_heading("6. NETWORK SIMULATION SCENARIOS IN THE PROJECT")

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.add_run(
        "The project includes interactive simulation controls to demonstrate network protocol behavior under both normal and fault conditions:"
    )

    sim_tbl = doc.add_table(rows=6, cols=4)
    sim_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    sim_widths = [Inches(1.6), Inches(1.8), Inches(1.8), Inches(1.8)]

    sim_headers = ["Simulation Action", "Network Condition Simulated", "Protocol Layer Behavior", "FSM & Database Response"]
    for j, h in enumerate(sim_headers):
        c = sim_tbl.rows[0].cells[j]
        c.width = sim_widths[j]
        set_cell_background(c, "F1F5F9")
        set_cell_margins(c, 90, 90, 110, 110)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h)
        r.font.name = "Times New Roman"
        r.font.size = Pt(11)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)
        b = {"val": "single", "sz": 5, "color": "CBD5E1"}
        set_cell_border(c, top=b, bottom=b, left=b, right=b)

    sim_rows = [
        ("Send Valid Message", "Healthy packet transmission", "HTTP 200 OK over TLS stream", "FSM transitions to Active. Telemetry persisted in MongoDB."),
        ("Invalid Temperature (200°C)", "Corrupt / out-of-bounds telemetry", "Application layer schema rejection (HTTP 400 Bad Request)", "FSM preserves current state. Validation error alert logged."),
        ("Simulate Comm Failure", "Packet drop, broken link, or socket reset", "TCP connection reset / timeout event", "FSM transitions to Disconnected. Failure alert logged."),
        ("Simulate Timeout", "Heartbeat keep-alive expiration (>45s)", "Session timeout / inactivity expiry", "FSM transitions to Disconnected. Timeout alert logged."),
        ("Reconnect Device", "Link restoration & re-handshake", "New TCP handshake & valid telemetry message", "FSM restored to Active. Reconnection alert logged.")
    ]

    for i, row_data in enumerate(sim_rows):
        row = sim_tbl.rows[i + 1]
        for j, val in enumerate(row_data):
            c = row.cells[j]
            c.width = sim_widths[j]
            set_cell_background(c, "FFFFFF" if i % 2 == 0 else "F8FAFC")
            set_cell_margins(c, 70, 70, 110, 110)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Times New Roman"
            r.font.size = Pt(10.5)
            if j == 0:
                r.font.bold = True
            b = {"val": "single", "sz": 4, "color": "E2E8F0"}
            set_cell_border(c, top=b, bottom=b, left=b, right=b)

    # ========================================================
    # SECTION 7: GITHUB & CLOUD DEPLOYMENT URLS
    # ========================================================
    add_sec_heading("7. GITHUB REPOSITORY & CLOUD DEPLOYMENT LINKS")

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.add_run("As required by Faculty In-Charge (Kavitha Mam), the complete computer networks report and project code have been pushed to GitHub. Below are the official evaluation URLs:")

    url_tbl = doc.add_table(rows=6, cols=3)
    url_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    u_widths = [Inches(2.2), Inches(1.8), Inches(3.0)]

    u_headers = ["Resource", "Platform", "Public Access Link"]
    for j, h in enumerate(u_headers):
        c = url_tbl.rows[0].cells[j]
        c.width = u_widths[j]
        set_cell_background(c, "F1F5F9")
        set_cell_margins(c, 90, 90, 110, 110)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h)
        r.font.name = "Times New Roman"
        r.font.size = Pt(11)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)
        b = {"val": "single", "sz": 5, "color": "CBD5E1"}
        set_cell_border(c, top=b, bottom=b, left=b, right=b)

    u_rows = [
        ("GitHub Repository Link", "GitHub", "https://github.com/Dhanusheyap755/IoT-Device-Status-Monitoring-System"),
        ("Network Report File", "GitHub Repository", "https://github.com/Dhanusheyap755/IoT-Device-Status-Monitoring-System/blob/main/documentation/COMPUTER_NETWORKS_REPORT.md"),
        ("Live Website (Frontend)", "GitHub Pages", "https://dhanusheyap755.github.io/IoT-Device-Status-Monitoring-System/"),
        ("Backend REST API", "Render (Web Service)", "https://iot-monitoring-backend-p9h0.onrender.com"),
        ("Backend Health Check", "Render API Endpoint", "https://iot-monitoring-backend-p9h0.onrender.com/api/health")
    ]

    for i, row_data in enumerate(u_rows):
        row = url_tbl.rows[i + 1]
        for j, val in enumerate(row_data):
            c = row.cells[j]
            c.width = u_widths[j]
            set_cell_background(c, "FFFFFF" if i % 2 == 0 else "F8FAFC")
            set_cell_margins(c, 70, 70, 110, 110)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Times New Roman"
            r.font.size = Pt(10.5)
            if j == 0:
                r.font.bold = True
            elif j == 2:
                r.font.color.rgb = RGBColor(0x1D, 0x4E, 0xD8)
            b = {"val": "single", "sz": 4, "color": "E2E8F0"}
            set_cell_border(c, top=b, bottom=b, left=b, right=b)

    # ========================================================
    # SECTION 8: SCREENSHOT VERIFICATION
    # ========================================================
    doc.add_page_break()
    add_sec_heading("8. EXPERIMENTAL VERIFICATION SCREENSHOTS")

    def add_shot_frame(title, fig_num, caption, desc, height_pt=175):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(6)
        h.paragraph_format.space_after = Pt(2)
        r = h.add_run(f"Figure {fig_num}: {title}")
        r.font.name = "Times New Roman"
        r.font.size = Pt(12)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

        t = doc.add_table(rows=1, cols=1)
        t.alignment = WD_TABLE_ALIGNMENT.CENTER
        c = t.rows[0].cells[0]
        c.width = Inches(7.0)
        set_cell_background(c, "F8FAFC")
        set_cell_margins(c, 80, 80, 120, 120)
        border_spec = {"val": "dashed", "sz": 6, "color": "94A3B8"}
        set_cell_border(c, top=border_spec, bottom=border_spec, left=border_spec, right=border_spec)
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(height_pt // 2)
        p.paragraph_format.space_after = Pt(height_pt // 2)

        r_tag = p.add_run(f"[ PASTE COLOR SCREENSHOT OF {title.upper()} HERE ]\n\n")
        r_tag.font.name = "Times New Roman"
        r_tag.font.size = Pt(11)
        r_tag.font.bold = True
        r_tag.font.color.rgb = RGBColor(0x1E, 0x40, 0xAF)

        r_d = p.add_run(desc)
        r_d.font.name = "Times New Roman"
        r_d.font.size = Pt(10)
        r_d.font.italic = True
        r_d.font.color.rgb = RGBColor(0x64, 0x74, 0x8B)

        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(2)
        p_cap.paragraph_format.space_after = Pt(10)
        r_cp = p_cap.add_run(caption)
        r_cp.font.name = "Times New Roman"
        r_cp.font.size = Pt(10.5)
        r_cp.font.italic = True
        r_cp.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

    add_shot_frame(
        "Website Dashboard with Real-Time Cloud Connectivity", "8.1",
        "Figure 8.1: Production React Web Dashboard running live on GitHub Pages with green MongoDB Atlas pulse indicator",
        "Shows: Registered devices, active telemetry messages, and top header showing 'MongoDB Connected' cloud verification.",
        height_pt=170
    )

    add_shot_frame(
        "Simulation Controls Deck & HTTP Response Inspector", "8.2",
        "Figure 8.2: Live simulation deck showing HTTP 200 OK valid packet and HTTP 400 Bad Request error responses",
        "Shows: Left simulation buttons and Right dark terminal output verifying real-time packet exchange over HTTPS.",
        height_pt=170
    )

    doc.add_page_break()

    add_shot_frame(
        "MongoDB Atlas Cloud Database Explorer", "8.3",
        "Figure 8.3: MongoDB Atlas Cloud Data Explorer verifying persistent data storage over TLS socket Port 27017",
        "Shows: Collections (devices, sensorreadings, alerts, deviceevents) containing persisted documents in the cloud.",
        height_pt=175
    )

    add_shot_frame(
        "GitHub Repository with Pushed Network Report", "8.4",
        "Figure 8.4: GitHub Repository showing pushed code, commit history, and COMPUTER_NETWORKS_REPORT.md",
        "Shows: Repository Dhanusheyap755/IoT-Device-Status-Monitoring-System with latest commits and documentation.",
        height_pt=175
    )

    doc.save(DOCX_OUT)
    print(f"SUCCESS: Generated Computer Networks Word Document at: {DOCX_OUT}")

if __name__ == "__main__":
    build_cn_document()
