import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls, qn

BASE_DIR = r"C:\Users\abidh\.gemini\antigravity\scratch\IoT-Device-Status-Monitoring-System"
DOCX_OUT = os.path.join(BASE_DIR, "documentation", "ACTIVITY_2_24ITR018_REPORT.docx")

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=80, bottom=80, left=120, right=120):
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

def set_columns(section, num_columns, space_dxa=360):
    sectPr = section._sectPr
    cols = sectPr.xpath('./w:cols')
    if cols:
        cols[0].set(qn('w:num'), str(num_columns))
        cols[0].set(qn('w:space'), str(space_dxa))
    else:
        new_cols = parse_xml(f'<w:cols {nsdecls("w")} w:num="{num_columns}" w:space="{space_dxa}"/>')
        sectPr.append(new_cols)

def read_file_safe(rel_path):
    full_path = os.path.join(BASE_DIR, rel_path)
    if os.path.exists(full_path):
        with open(full_path, "r", encoding="utf-8", errors="replace") as f:
            return f.read()
    return f"// File {rel_path} not found"

def create_report():
    doc = docx.Document()

    # Base Normal Style: Times New Roman 12pt
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Times New Roman'
    font.size = Pt(12)
    font.color.rgb = RGBColor(0, 0, 0)

    # Section 1 (Cover Page - Single Column)
    sec_cover = doc.sections[0]
    sec_cover.top_margin = Inches(0.5)
    sec_cover.bottom_margin = Inches(0.5)
    sec_cover.left_margin = Inches(0.6)
    sec_cover.right_margin = Inches(0.6)
    sec_cover.page_width = Inches(8.27)
    sec_cover.page_height = Inches(11.69)

    # ==========================================
    # PAGE 1: COVER PAGE
    # ==========================================
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_before = Pt(10)
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
    r.font.size = Pt(12)

    p_dept = doc.add_paragraph()
    p_dept.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dept.paragraph_format.space_before = Pt(4)
    p_dept.paragraph_format.space_after = Pt(14)
    r = p_dept.add_run("DEPARTMENT OF INFORMATION TECHNOLOGY")
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1E, 0x40, 0xAF)

    p_div = doc.add_paragraph()
    p_div.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_div.paragraph_format.space_after = Pt(14)
    r = p_div.add_run("―" * 52)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    p_act = doc.add_paragraph()
    p_act.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_act.paragraph_format.space_after = Pt(6)
    r = p_act.add_run("ACTIVITY 2 SUBMISSION REPORT")
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1E, 0x40, 0xAF)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_after = Pt(24)
    r = p_title.add_run("IoT Device Status Monitoring System")
    r.font.name = "Times New Roman"
    r.font.size = Pt(18)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    # Student Details Table (Body 12pt Times New Roman)
    tbl = doc.add_table(rows=6, cols=2)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_widths = [Inches(2.4), Inches(4.5)]
    details = [
        ("Student Name:", "DHANUSHEYA P"),
        ("Register Number:", "24ITR018"),
        ("Class & Branch:", "B.Tech. - Information Technology"),
        ("Course Code & Title:", "IT2304 / Full Stack Web Development & Computer Networks"),
        ("Activity Number:", "Activity 2 (Automata & Full Stack Cloud Deployment)"),
        ("Date of Submission:", "16-11-2026")
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
    p_sp.paragraph_format.space_before = Pt(80)

    # Signatures
    sig_tbl = doc.add_table(rows=1, cols=3)
    sig_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_widths = [Inches(2.3), Inches(2.3), Inches(2.3)]
    sig_labels = ["Signature of the Student", "Signature of Faculty In-Charge", "Signature of HoD / IT"]
    for j, label in enumerate(sig_labels):
        c = sig_tbl.rows[0].cells[j]
        c.width = sig_widths[j]
        set_cell_border(c, top={"val": "single", "sz": 8, "color": "475569"})
        p_s = c.paragraphs[0]
        p_s.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_s.paragraph_format.space_before = Pt(4)
        r_s = p_s.add_run(label)
        r_s.font.name = "Times New Roman"
        r_s.font.size = Pt(12)
        r_s.font.bold = True
        r_s.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

    # ==========================================
    # PAGE 2: SECTION 1: PATH & GIT PUSH COMMANDS
    # ==========================================
    doc.add_page_break()

    h_sec1 = doc.add_paragraph()
    h_sec1.paragraph_format.space_before = Pt(4)
    h_sec1.paragraph_format.space_after = Pt(4)
    r = h_sec1.add_run("1. PATH OF FILES AND FOLDERS (MANUAL CODE ONLY)")
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    p_note = doc.add_paragraph()
    p_note.paragraph_format.space_after = Pt(4)
    r = p_note.add_run("Note: Standard template/boilerplate files (favicon.svg, index.html, main.jsx, package.json, test inputs, .gitignore) have been removed as instructed. Below is the clean hierarchy of files containing custom developed code:")
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.font.italic = True
    r.font.color.rgb = RGBColor(0x4B, 0x55, 0x63)

    path_tree = """IoT-Device-Status-Monitoring-System/
├── backend/
│   ├── config/db.js                                  # MongoDB Atlas connection logic
│   ├── controllers/
│   │   ├── alertController.js                        # Alert queries & acknowledgment
│   │   ├── deviceController.js                       # Device registration & simulation logic
│   │   └── readingController.js                      # Telemetry ingestion & FSM triggers
│   ├── fsm/deviceStateMachine.js                     # FLAT Deterministic Finite Automaton Engine
│   ├── middleware/
│   │   ├── errorHandler.js                           # Centralized exception handler
│   │   └── validateMessage.js                        # Telemetry range & boundary validation
│   ├── models/
│   │   ├── Alert.js                                  # Anomaly alert schema
│   │   ├── Device.js                                 # Device entity & state schema
│   │   ├── DeviceEvent.js                            # State transition audit log schema
│   │   └── SensorReading.js                          # Telemetry data schema
│   ├── routes/
│   │   ├── alertRoutes.js                            # Alert REST endpoints
│   │   ├── deviceRoutes.js                           # Device REST endpoints
│   │   └── readingRoutes.js                          # Telemetry REST endpoints
│   ├── seed/seedData.js                              # Initial database seeder (IOT001..003)
│   ├── test/                                         # Automated unit & integration tests
│   └── server.js                                     # Express entry point (0.0.0.0, CORS, Health)
└── frontend/
    ├── src/
    │   ├── components/                               # AlertBadge, Footer, Header, Icons, MetricCard, Sidebar, StatusPill
    │   ├── pages/                                    # OverviewDashboard, DeviceManagement, FsmVisualizer, SimulationControls, etc.
    │   ├── services/api.js                           # API client with VITE_API_BASE_URL
    │   ├── App.css                                   # Custom dashboard styling & animations
    │   └── App.jsx                                   # Root React component & hash routing
    └── vite.config.js                                # Base path /IoT-Device-Status-Monitoring-System/"""

    p_tree = doc.add_paragraph()
    p_tree.paragraph_format.space_after = Pt(10)
    p_tree.paragraph_format.line_spacing = 1.05
    r = p_tree.add_run(path_tree)
    r.font.name = "Times New Roman"
    r.font.size = Pt(11) # Clean 11-12pt fit
    r.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    # GitHub Push Commands (Replacing deploy.yml)
    h_git = doc.add_paragraph()
    h_git.paragraph_format.space_before = Pt(6)
    h_git.paragraph_format.space_after = Pt(3)
    r = h_git.add_run("GITHUB REPOSITORY INITIALIZATION & PUSH COMMANDS")
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1E, 0x40, 0xAF)

    p_git_desc = doc.add_paragraph()
    p_git_desc.paragraph_format.space_after = Pt(4)
    r = p_git_desc.add_run("The following commands were executed in sequence to push the complete codebase to GitHub:")
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)

    git_cmds = """# Step 1: Initialize local git repository
git init

# Step 2: Stage all custom developed files
git add .

# Step 3: Commit with meaningful commit message
git commit -m "feat: complete IoT Device Status Monitoring System with FSM and cloud integration"

# Step 4: Set default branch to main
git branch -M main

# Step 5: Add remote GitHub repository URL
git remote add origin https://github.com/Dhanusheyap755/IoT-Device-Status-Monitoring-System.git

# Step 6: Push complete application source code to GitHub
git push -u origin main"""

    p_gcmd = doc.add_paragraph()
    p_gcmd.paragraph_format.space_after = Pt(12)
    p_gcmd.paragraph_format.line_spacing = 1.05
    r = p_gcmd.add_run(git_cmds)
    r.font.name = "Times New Roman"
    r.font.size = Pt(11)
    r.font.color.rgb = RGBColor(0x1D, 0x4E, 0xD8)

    # ==========================================
    # SECTION 2: APPLICATION SOURCE CODE (2-COLUMNS)
    # Target: Pages 3 to 14 (12 pages)
    # ==========================================
    doc.add_page_break()
    sec_code = doc.add_section()
    set_columns(sec_code, 2, space_dxa=300)
    sec_code.top_margin = Inches(0.4)
    sec_code.bottom_margin = Inches(0.4)
    sec_code.left_margin = Inches(0.45)
    sec_code.right_margin = Inches(0.45)

    h_sec2 = doc.add_paragraph()
    h_sec2.paragraph_format.space_before = Pt(2)
    h_sec2.paragraph_format.space_after = Pt(4)
    r = h_sec2.add_run("2. APPLICATION SOURCE CODE")
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    # Core files to include in Code section
    core_files = [
        ("backend/server.js", "Express API entry point, 0.0.0.0 binding, CORS, health check"),
        ("backend/config/db.js", "MongoDB Atlas connection logic via Mongoose"),
        ("backend/fsm/deviceStateMachine.js", "FLAT Finite State Machine Engine (Q, Sigma, delta, MongoDB persistence)"),
        ("backend/middleware/validateMessage.js", "IoT sensor telemetry validation logic (-40 to 85 C)"),
        ("backend/middleware/errorHandler.js", "Centralized API error handler"),
        ("backend/models/Device.js", "Mongoose Schema for IoT Device entity"),
        ("backend/models/SensorReading.js", "Mongoose Schema for telemetry data"),
        ("backend/models/Alert.js", "Mongoose Schema for invalid message & failure alerts"),
        ("backend/models/DeviceEvent.js", "Mongoose Schema for state transition history"),
        ("backend/controllers/readingController.js", "Sensor message ingestion & FSM trigger controller"),
        ("backend/routes/deviceRoutes.js", "Device REST endpoints"),
        ("backend/routes/readingRoutes.js", "Telemetry ingestion REST endpoints"),
        ("frontend/vite.config.js", "Vite base path configuration for GitHub Pages"),
        ("frontend/src/services/api.js", "API client service supporting VITE_API_BASE_URL"),
        ("frontend/src/App.jsx", "Root React application, routing & tab state management"),
        ("frontend/src/App.css", "Custom CSS styling for dashboard & FSM rings"),
        ("frontend/src/components/Header.jsx", "Navigation header with real-time MongoDB status pill"),
        ("frontend/src/components/StatusPill.jsx", "FSM state badge component"),
        ("frontend/src/pages/FsmVisualizerPage.jsx", "Interactive FSM Automata diagram visualizer")
    ]

    for rel_path, desc in core_files:
        raw_code = read_file_safe(rel_path)
        # Strip trailing whitespace and excessive empty lines
        lines = [l.rstrip() for l in raw_code.splitlines()]
        cleaned_lines = []
        skip_empty = False
        for l in lines:
            if not l.strip():
                if not skip_empty:
                    cleaned_lines.append("")
                    skip_empty = True
            else:
                cleaned_lines.append(l)
                skip_empty = False
        code_text = "\n".join(cleaned_lines)

        # File Title Heading (14pt Bold Times New Roman)
        p_hdr = doc.add_paragraph()
        p_hdr.paragraph_format.space_before = Pt(6)
        p_hdr.paragraph_format.space_after = Pt(1)
        p_hdr.paragraph_format.keep_with_next = True
        
        r_t = p_hdr.add_run(f"File: {rel_path}\n")
        r_t.font.name = "Times New Roman"
        r_t.font.size = Pt(12)
        r_t.font.bold = True
        r_t.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

        r_d = p_hdr.add_run(f"// {desc}")
        r_d.font.name = "Times New Roman"
        r_d.font.size = Pt(10)
        r_d.font.italic = True
        r_d.font.color.rgb = RGBColor(0x4B, 0x55, 0x63)

        # Code Body (12pt Times New Roman as requested)
        p_cd = doc.add_paragraph()
        p_cd.paragraph_format.space_before = Pt(1)
        p_cd.paragraph_format.space_after = Pt(6)
        p_cd.paragraph_format.line_spacing = 1.05

        r_c = p_cd.add_run(code_text)
        r_c.font.name = "Times New Roman"
        r_c.font.size = Pt(12)
        r_c.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    # ==========================================
    # SECTION 3: OUTPUT SCREENSHOTS (Single Column)
    # Target: Pages 15 & 16
    # ==========================================
    doc.add_page_break()
    sec_out = doc.add_section()
    set_columns(sec_out, 1)
    sec_out.top_margin = Inches(0.5)
    sec_out.bottom_margin = Inches(0.5)
    sec_out.left_margin = Inches(0.6)
    sec_out.right_margin = Inches(0.6)

    h_sec3 = doc.add_paragraph()
    h_sec3.paragraph_format.space_before = Pt(4)
    h_sec3.paragraph_format.space_after = Pt(4)
    r = h_sec3.add_run("3. OUTPUT SCREENSHOTS & EXPERIMENTAL VERIFICATION")
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    def add_shot_box(title, fig_num, caption, desc, height_pt=180):
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
        set_cell_margins(c, 100, 100, 140, 140)
        set_cell_border(c, top={"val": "dashed", "sz": 6, "color": "94A3B8"},
                           bottom={"val": "dashed", "sz": 6, "color": "94A3B8"},
                           left={"val": "dashed", "sz": 6, "color": "94A3B8"},
                           right={"val": "dashed", "sz": 6, "color": "94A3B8"})
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(height_pt // 2)
        p.paragraph_format.space_after = Pt(height_pt // 2)
        
        r_tag = p.add_run(f"[ PASTE COLOR SCREENSHOT OF {title.upper()} HERE ]\n\n")
        r_tag.font.name = "Times New Roman"
        r_tag.font.size = Pt(12)
        r_tag.font.bold = True
        r_tag.font.color.rgb = RGBColor(0x1E, 0x40, 0xAF)

        r_d = p.add_run(desc)
        r_d.font.name = "Times New Roman"
        r_d.font.size = Pt(11)
        r_d.font.italic = True
        r_d.font.color.rgb = RGBColor(0x64, 0x74, 0x8B)

        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(2)
        p_cap.paragraph_format.space_after = Pt(10)
        r_cp = p_cap.add_run(caption)
        r_cp.font.name = "Times New Roman"
        r_cp.font.size = Pt(11)
        r_cp.font.italic = True
        r_cp.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

    # Page 15: Fig 3.1 & Fig 3.2
    add_shot_box(
        "Website Overview Dashboard", "3.1",
        "Figure 3.1: Production React Web Dashboard running live on GitHub Pages with real-time cloud MongoDB Atlas status",
        "Shows: Total Registered Devices (3+), Active Devices, Disconnected Devices, Total Telemetry Messages, FSM State Distribution Bars, and 'MongoDB Connected' green pulse indicator in the top header.",
        height_pt=180
    )

    add_shot_box(
        "Simulation Controls Deck & Live Terminal", "3.2",
        "Figure 3.2: Execution of Valid and Invalid telemetry injections demonstrating state preservation and alert logging",
        "Shows: Left simulation buttons (Send Valid Message, Invalid Temp 200°C, Simulate Failure, Simulate Timeout, Reconnect) and Right Dark Terminal Inspector showing HTTP 200 OK / HTTP 400 Bad Request JSON responses.",
        height_pt=180
    )

    # Page 16: Fig 3.3 & Fig 3.4
    doc.add_page_break()

    add_shot_box(
        "Automata FSM Visualizer", "3.3",
        "Figure 3.3: Real-time visual representation of Deterministic Finite Automaton state transitions",
        "Shows: Three Automata Nodes (Registered q0, Active F, Disconnected) with active device state highlighted with glowing ring, and chronological transition history audit table at the bottom.",
        height_pt=180
    )

    add_shot_box(
        "MongoDB Atlas Cloud Database Explorer", "3.4",
        "Figure 3.4: MongoDB Atlas Cloud Data Explorer verifying persistent data storage",
        "Shows: Database iot_monitoring (or test) with all 4 collections: devices, sensorreadings, alerts, and deviceevents containing live persisted documents.",
        height_pt=180
    )

    # ==========================================
    # SECTION 4: GITHUB LINKS & CLOUD URLS
    # Target: Page 17
    # ==========================================
    doc.add_page_break()

    h_sec4 = doc.add_paragraph()
    h_sec4.paragraph_format.space_before = Pt(4)
    h_sec4.paragraph_format.space_after = Pt(4)
    r = h_sec4.add_run("4. GITHUB AND CLOUD DEPLOYMENT URLS")
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    p_l_desc = doc.add_paragraph()
    p_l_desc.paragraph_format.space_after = Pt(8)
    r = p_l_desc.add_run("The table below provides the production deployment URLs and public repository links for evaluation:")
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)

    links_tbl = doc.add_table(rows=6, cols=3)
    links_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    l_widths = [Inches(2.2), Inches(1.8), Inches(3.0)]

    headers = ["Resource", "Platform", "Public Access URL"]
    for j, h_txt in enumerate(headers):
        c = links_tbl.rows[0].cells[j]
        c.width = l_widths[j]
        set_cell_background(c, "F1F5F9")
        set_cell_margins(c, 100, 100, 120, 120)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h_txt)
        r.font.name = "Times New Roman"
        r.font.size = Pt(12)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)
        b = {"val": "single", "sz": 6, "color": "CBD5E1"}
        set_cell_border(c, top=b, bottom=b, left=b, right=b)

    link_data = [
        ("GitHub Repository Link", "GitHub", "https://github.com/Dhanusheyap755/IoT-Device-Status-Monitoring-System"),
        ("Live Website (Frontend)", "GitHub Pages", "https://dhanusheyap755.github.io/IoT-Device-Status-Monitoring-System/"),
        ("Backend REST API", "Render (Web Service)", "https://iot-monitoring-backend-p9h0.onrender.com"),
        ("Backend Health Check", "Render API Endpoint", "https://iot-monitoring-backend-p9h0.onrender.com/api/health"),
        ("Cloud Database Cluster", "MongoDB Atlas", "mongodb+srv://cluster0.pimkevk.mongodb.net/iot_monitoring")
    ]

    for i, (res, plat, url) in enumerate(link_data):
        row = links_tbl.rows[i + 1]
        for j, txt in enumerate([res, plat, url]):
            c = row.cells[j]
            c.width = l_widths[j]
            set_cell_background(c, "FFFFFF" if i % 2 == 0 else "F8FAFC")
            set_cell_margins(c, 80, 80, 120, 120)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(txt)
            r.font.name = "Times New Roman"
            r.font.size = Pt(11 if j == 2 else 12)
            if j == 0:
                r.font.bold = True
            elif j == 2:
                r.font.color.rgb = RGBColor(0x1D, 0x4E, 0xD8)
            b = {"val": "single", "sz": 4, "color": "E2E8F0"}
            set_cell_border(c, top=b, bottom=b, left=b, right=b)

    # ==========================================
    # SECTION 5: GITHUB REPOSITORY SCREENSHOTS
    # Target: Page 18
    # ==========================================
    doc.add_page_break()

    h_sec5 = doc.add_paragraph()
    h_sec5.paragraph_format.space_before = Pt(4)
    h_sec5.paragraph_format.space_after = Pt(4)
    r = h_sec5.add_run("5. GITHUB REPOSITORY & PUSH VERIFICATION SCREENSHOTS")
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    add_shot_box(
        "GitHub Repository Main Page", "5.1",
        "Figure 5.1: GitHub Repository showing full source tree, commit message, and clean branch structure",
        "Shows: Repository Dhanusheyap755/IoT-Device-Status-Monitoring-System, branch main, latest commit, and directory structure (backend, frontend, documentation).",
        height_pt=180
    )

    add_shot_box(
        "GitHub Actions Deployment / Pages Settings", "5.2",
        "Figure 5.2: GitHub repository showing active Pages deployment and live status",
        "Shows: GitHub Settings -> Pages showing 'Your site is live at https://dhanusheyap755.github.io/IoT-Device-Status-Monitoring-System/' or GitHub Actions green tick mark.",
        height_pt=180
    )

    doc.save(DOCX_OUT)
    print(f"SUCCESS: Document created at {DOCX_OUT}")

if __name__ == "__main__":
    create_report()
