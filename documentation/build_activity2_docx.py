import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

BASE_DIR = r"C:\Users\abidh\.gemini\antigravity\scratch\IoT-Device-Status-Monitoring-System"
DOCX_OUT = os.path.join(BASE_DIR, "documentation", "ACTIVITY_2_24ITR018_REPORT.docx")

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
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
    """
    kwargs: top, bottom, left, right
    values: {"sz": 12, "val": "single", "color": "1E3A8A"}
    """
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

def set_columns(section, num_columns, space_dxa=400):
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

def build_docx():
    doc = docx.Document()

    # 1. Page Margins Setup for Section 1 (A4: 0.5 in margins to save paper)
    sec_cover = doc.sections[0]
    sec_cover.top_margin = Inches(0.5)
    sec_cover.bottom_margin = Inches(0.5)
    sec_cover.left_margin = Inches(0.55)
    sec_cover.right_margin = Inches(0.55)
    sec_cover.page_width = Inches(8.27)  # A4
    sec_cover.page_height = Inches(11.69) # A4

    # ========================================================
    # COVER PAGE
    # ========================================================
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(2)
    run = p.add_run("VELALAR COLLEGE OF ENGINEERING AND TECHNOLOGY")
    run.font.name = "Arial"
    run.font.size = Pt(15)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(2)
    r = p_sub.add_run("(Autonomous Institution Affiliated to Anna University, Chennai)\nThindal, Erode – 638 012, Tamil Nadu")
    r.font.name = "Calibri"
    r.font.size = Pt(10)
    r.font.color.rgb = RGBColor(0x4B, 0x55, 0x63)

    p_dept = doc.add_paragraph()
    p_dept.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dept.paragraph_format.space_before = Pt(4)
    p_dept.paragraph_format.space_after = Pt(12)
    r = p_dept.add_run("DEPARTMENT OF INFORMATION TECHNOLOGY")
    r.font.name = "Arial"
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1E, 0x40, 0xAF)

    # Divider bar
    p_div = doc.add_paragraph()
    p_div.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_div.paragraph_format.space_before = Pt(0)
    p_div.paragraph_format.space_after = Pt(16)
    r = p_div.add_run("―" * 55)
    r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)
    r.font.bold = True

    # Activity 2 Badge
    p_act = doc.add_paragraph()
    p_act.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_act.paragraph_format.space_after = Pt(8)
    r = p_act.add_run("ACTIVITY 2 SUBMISSION REPORT")
    r.font.name = "Arial"
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1E, 0x40, 0xAF)

    # Project Title
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_after = Pt(22)
    r = p_title.add_run("IoT Device Status Monitoring System")
    r.font.name = "Arial"
    r.font.size = Pt(18)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    # Student Details Table
    table = doc.add_table(rows=6, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    details = [
        ("Student Name:", "DHANUSHEYA P"),
        ("Register Number:", "24ITR018"),
        ("Class & Branch:", "B.Tech. - Information Technology"),
        ("Course Code & Title:", "IT2304 / Full Stack Web Development & Computer Networks"),
        ("Activity Number:", "Activity 2 (Automata & Full Stack Cloud Deployment)"),
        ("Date of Submission:", "16-11-2026")
    ]

    col_widths = [Inches(2.5), Inches(4.5)]
    for i, (k, v) in enumerate(details):
        row = table.rows[i]
        
        c0 = row.cells[0]
        c0.width = col_widths[0]
        set_cell_background(c0, "F1F5F9")
        set_cell_margins(c0, 120, 120, 180, 180)
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(k)
        r0.font.name = "Calibri"
        r0.font.size = Pt(10.5)
        r0.font.bold = True
        r0.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

        c1 = row.cells[1]
        c1.width = col_widths[1]
        set_cell_background(c1, "F8FAFC")
        set_cell_margins(c1, 120, 120, 180, 180)
        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(v)
        r1.font.name = "Calibri"
        r1.font.size = Pt(10.5)
        r1.font.bold = True
        r1.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

        border_spec = {"val": "single", "sz": 4, "color": "CBD5E1"}
        set_cell_border(c0, top=border_spec, bottom=border_spec, left=border_spec, right=border_spec)
        set_cell_border(c1, top=border_spec, bottom=border_spec, left=border_spec, right=border_spec)

    # Signatures
    p_space = doc.add_paragraph()
    p_space.paragraph_format.space_before = Pt(70)

    sig_table = doc.add_table(rows=1, cols=3)
    sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_cols = [Inches(2.3), Inches(2.3), Inches(2.3)]
    sig_labels = ["Signature of the Student", "Signature of Faculty In-Charge", "Signature of HoD / IT"]
    for i, label in enumerate(sig_labels):
        cell = sig_table.rows[0].cells[i]
        cell.width = sig_cols[i]
        border_spec = {"val": "single", "sz": 8, "color": "475569"}
        set_cell_border(cell, top=border_spec)
        p_sig = cell.paragraphs[0]
        p_sig.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_sig.paragraph_format.space_before = Pt(4)
        r = p_sig.add_run(label)
        r.font.name = "Calibri"
        r.font.size = Pt(9.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

    # ========================================================
    # SECTION 1: PATH (Single Column)
    # ========================================================
    doc.add_page_break()

    h1 = doc.add_paragraph()
    h1.paragraph_format.space_before = Pt(6)
    h1.paragraph_format.space_after = Pt(6)
    r = h1.add_run("1. PATH OF FILES AND FOLDERS (MANUAL CODE ONLY)")
    r.font.name = "Arial"
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    p_note = doc.add_paragraph()
    p_note.paragraph_format.space_after = Pt(4)
    r = p_note.add_run("Note: As instructed by Faculty In-Charge, all standard installation boilerplate, default template files (favicon.svg, index.html, main.jsx, package.json, static test inputs, .gitignore) have been excluded. Only custom developed files containing manual code logic are listed below.")
    r.font.name = "Calibri"
    r.font.size = Pt(9)
    r.font.italic = True
    r.font.color.rgb = RGBColor(0x64, 0x74, 0x8B)

    path_text = """IoT-Device-Status-Monitoring-System/
├── backend/
│   ├── config/
│   │   └── db.js                                     # MongoDB Atlas Cloud Database connection logic
│   ├── controllers/
│   │   ├── alertController.js                        # Alert query & dismissal handlers
│   │   ├── deviceController.js                       # Device state, CRUD, & simulation endpoints
│   │   └── readingController.js                      # Time-series telemetry querying
│   ├── fsm/
│   │   └── deviceStateMachine.js                     # FLAT Deterministic Finite Automaton Engine
│   ├── middleware/
│   │   ├── errorHandler.js                           # Centralized error handler & DB readiness guard
│   │   └── validateMessage.js                        # Ingestion payload schema validation middleware
│   ├── models/
│   │   ├── Alert.js                                  # Anomaly & validation error schema
│   │   ├── Device.js                                 # IoT Device model (Registered, Active, Disconnected)
│   │   ├── DeviceEvent.js                            # Non-repudiable state transition audit ledger
│   │   └── SensorReading.js                          # Validated sensor telemetry records
│   ├── routes/
│   │   ├── alertRoutes.js                            # Express REST endpoints for alerts
│   │   ├── deviceRoutes.js                           # Express REST endpoints for device & simulation
│   │   └── readingRoutes.js                          # Express REST endpoints for telemetry
│   ├── seed/
│   │   └── seedData.js                               # Database seeder (IOT001, IOT002, IOT003)
│   ├── test/
│   │   ├── api.test.js                               # Integration tests for REST endpoints
│   │   ├── fsm.test.js                               # Unit tests for FSM transitions
│   │   └── validation.test.js                        # Unit tests for sensor validation
│   └── server.js                                     # Express entry point with 0.0.0.0 & CORS binding
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AlertBadge.jsx                        # Severity badges (Info, Warning, Error)
    │   │   ├── Footer.jsx                            # Professional attribution footer (Reg: 24ITR018)
    │   │   ├── Header.jsx                            # Header with real-time MongoDB connectivity pulse
    │   │   ├── Icons.jsx                             # Self-contained SVG icon components
    │   │   ├── MetricCard.jsx                        # Executive summary KPI cards
    │   │   ├── Sidebar.jsx                           # Left navigation drawer
    │   │   └── StatusPill.jsx                        # Automata state indicator pills
    │   ├── pages/
    │   │   ├── AlertsPage.jsx                        # Exception and failure audit logs
    │   │   ├── DeviceManagementPage.jsx              # Device registration with format validation
    │   │   ├── FsmExplanationPage.jsx                # Theoretical FLAT automata specification
    │   │   ├── FsmVisualizerPage.jsx                 # Interactive automata node visualizer
    │   │   ├── OverviewDashboard.jsx                 # System metrics and status distribution
    │   │   ├── SensorMonitoringPage.jsx              # Telemetry readings with units (°C, % RH)
    │   │   └── SimulationControlsPage.jsx            # Live HTTP simulation deck & response inspector
    │   ├── services/
    │   │   └── api.js                                # Frontend API client supporting VITE_API_BASE_URL
    │   ├── App.css                                   # Custom dashboard styling & FSM animation rules
    │   └── App.jsx                                   # Main React component with URL hash routing
    └── vite.config.js                                # Base path /IoT-Device-Status-Monitoring-System/"""

    p_code = doc.add_paragraph()
    p_code.paragraph_format.space_after = Pt(12)
    p_code.paragraph_format.line_spacing = 1.05
    r = p_code.add_run(path_text)
    r.font.name = "Consolas"
    r.font.size = Pt(8)
    r.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    # Git Push Commands (Requested by Mam instead of deploy.yml)
    h_git = doc.add_paragraph()
    h_git.paragraph_format.space_before = Pt(8)
    h_git.paragraph_format.space_after = Pt(4)
    r = h_git.add_run("GITHUB REPOSITORY INITIALIZATION & PUSH COMMANDS")
    r.font.name = "Arial"
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1E, 0x40, 0xAF)

    p_git_desc = doc.add_paragraph()
    p_git_desc.paragraph_format.space_after = Pt(4)
    r = p_git_desc.add_run("The following terminal commands were executed to track, commit, and push the entire codebase to the remote GitHub repository:")
    r.font.name = "Calibri"
    r.font.size = Pt(9.5)

    git_cmds = """# Step 1: Initialize local git repository
git init

# Step 2: Stage all manually coded backend, frontend, and configuration files
git add .

# Step 3: Commit with descriptive message
git commit -m "feat: complete IoT Device Status Monitoring System with FSM and cloud integration"

# Step 4: Ensure main branch is selected
git branch -M main

# Step 5: Link remote GitHub repository
git remote add origin https://github.com/Dhanusheyap755/IoT-Device-Status-Monitoring-System.git

# Step 6: Push complete application source code to GitHub
git push -u origin main"""

    p_gcmd = doc.add_paragraph()
    p_gcmd.paragraph_format.space_after = Pt(14)
    p_gcmd.paragraph_format.line_spacing = 1.05
    r = p_gcmd.add_run(git_cmds)
    r.font.name = "Consolas"
    r.font.size = Pt(8)
    r.font.color.rgb = RGBColor(0x1D, 0x4E, 0xD8)

    # ========================================================
    # SECTION 2: CODE (2-COLUMN SECTION TO SAVE MAXIMUM PAPER)
    # ========================================================
    sec_code = doc.add_section()
    set_columns(sec_code, 2, space_dxa=300) # 2 columns with narrow gap
    sec_code.top_margin = Inches(0.4)
    sec_code.bottom_margin = Inches(0.4)
    sec_code.left_margin = Inches(0.4)
    sec_code.right_margin = Inches(0.4)

    h2 = doc.add_paragraph()
    h2.paragraph_format.space_before = Pt(4)
    h2.paragraph_format.space_after = Pt(6)
    r = h2.add_run("2. APPLICATION SOURCE CODE (2-COLUMN FORMAT)")
    r.font.name = "Arial"
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    # List of files to place into code section
    code_files = [
        # Backend Core
        ("backend/server.js", "Express API entry point, 0.0.0.0 binding, CORS, health check"),
        ("backend/config/db.js", "MongoDB Atlas connection logic via Mongoose"),
        ("backend/fsm/deviceStateMachine.js", "Core FLAT FSM Automata Engine (Q, Sigma, delta, MongoDB persistence)"),
        ("backend/middleware/validateMessage.js", "IoT sensor telemetry validation logic (-40 to 85 C)"),
        ("backend/middleware/errorHandler.js", "Centralized API error handler"),
        ("backend/models/Device.js", "Mongoose Schema for IoT Device entity"),
        ("backend/models/SensorReading.js", "Mongoose Schema for telemetry data"),
        ("backend/models/Alert.js", "Mongoose Schema for invalid message & failure alerts"),
        ("backend/models/DeviceEvent.js", "Mongoose Schema for state transition history"),
        ("backend/controllers/deviceController.js", "Device CRUD & simulation REST controllers"),
        ("backend/controllers/readingController.js", "Sensor message ingestion & FSM trigger controller"),
        ("backend/controllers/alertController.js", "Alert querying & management controller"),
        ("backend/routes/deviceRoutes.js", "Device REST endpoints"),
        ("backend/routes/readingRoutes.js", "Telemetry ingestion REST endpoints"),
        ("backend/routes/alertRoutes.js", "Alert REST endpoints"),
        ("backend/seed/seedData.js", "Database seeder for initial IoT devices"),
        ("backend/test/fsm.test.js", "Automated FSM transition test suite"),
        ("backend/test/validation.test.js", "Automated sensor validation test suite"),
        ("backend/test/api.test.js", "Automated REST API integration test suite"),
        
        # Frontend Core
        ("frontend/vite.config.js", "Vite base path configuration for GitHub Pages"),
        ("frontend/src/services/api.js", "API client service supporting VITE_API_BASE_URL"),
        ("frontend/src/App.jsx", "Root React application, routing & tab state management"),
        ("frontend/src/App.css", "Custom CSS styling for dashboard, FSM rings, & dark terminal"),
        ("frontend/src/components/Header.jsx", "Navigation header with real-time MongoDB status pill"),
        ("frontend/src/components/Sidebar.jsx", "Sidebar navigation component"),
        ("frontend/src/components/Footer.jsx", "Attribution footer with Register Number 24ITR018"),
        ("frontend/src/components/MetricCard.jsx", "Metric KPI card component"),
        ("frontend/src/components/StatusPill.jsx", "FSM state badge component"),
        ("frontend/src/components/AlertBadge.jsx", "Alert severity badge component"),
        ("frontend/src/components/Icons.jsx", "Custom SVG iconography library"),
        ("frontend/src/pages/OverviewDashboard.jsx", "System overview dashboard page"),
        ("frontend/src/pages/DeviceManagementPage.jsx", "Device registration & management page"),
        ("frontend/src/pages/SimulationControlsPage.jsx", "Interactive HTTP telemetry simulation deck"),
        ("frontend/src/pages/FsmVisualizerPage.jsx", "Interactive FSM Automata diagram visualizer"),
        ("frontend/src/pages/SensorMonitoringPage.jsx", "Sensor telemetry data stream table"),
        ("frontend/src/pages/AlertsPage.jsx", "System anomaly alerts page"),
        ("frontend/src/pages/FsmExplanationPage.jsx", "Academic formal automata theory explanation")
    ]

    for rel_path, desc in code_files:
        code_content = read_file_safe(rel_path)
        
        # File Title Banner
        p_hdr = doc.add_paragraph()
        p_hdr.paragraph_format.space_before = Pt(8)
        p_hdr.paragraph_format.space_after = Pt(1)
        p_hdr.paragraph_format.keep_with_next = True
        
        r_fn = p_hdr.add_run(f"📁 {rel_path}\n")
        r_fn.font.name = "Consolas"
        r_fn.font.size = Pt(7.5)
        r_fn.font.bold = True
        r_fn.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

        r_ds = p_hdr.add_run(f"// {desc}")
        r_ds.font.name = "Calibri"
        r_ds.font.size = Pt(6.5)
        r_ds.font.italic = True
        r_ds.font.color.rgb = RGBColor(0x64, 0x74, 0x8B)

        # Code Block
        p_code = doc.add_paragraph()
        p_code.paragraph_format.space_before = Pt(1)
        p_code.paragraph_format.space_after = Pt(6)
        p_code.paragraph_format.line_spacing = 1.05
        
        r_cd = p_code.add_run(code_content)
        r_cd.font.name = "Consolas"
        r_cd.font.size = Pt(6.2) # Tight font for paper conservation
        r_cd.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    # ========================================================
    # SECTION 3: OUTPUT SCREENSHOTS (1-Column Dedicated Pages)
    # ========================================================
    sec_out = doc.add_section()
    set_columns(sec_out, 1) # Full width single column
    sec_out.top_margin = Inches(0.5)
    sec_out.bottom_margin = Inches(0.5)
    sec_out.left_margin = Inches(0.55)
    sec_out.right_margin = Inches(0.55)

    def add_screenshot_box(title, fig_num, caption, desc, height_in=3.0):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(10)
        h.paragraph_format.space_after = Pt(2)
        r = h.add_run(f"Figure {fig_num}: {title}")
        r.font.name = "Arial"
        r.font.size = Pt(11)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.rows[0].cells[0]
        cell.width = Inches(7.1)
        set_cell_background(cell, "F8FAFC")
        set_cell_margins(cell, 200, 200, 200, 200)
        border_spec = {"val": "dashed", "sz": 8, "color": "94A3B8"}
        set_cell_border(cell, top=border_spec, bottom=border_spec, left=border_spec, right=border_spec)

        p_in = cell.paragraphs[0]
        p_in.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_in.paragraph_format.space_before = Pt(int(height_in * 24))
        p_in.paragraph_format.space_after = Pt(int(height_in * 24))
        
        r_tag = p_in.add_run(f"[ PASTE COLOR SCREENSHOT OF {title.upper()} HERE ]\n\n")
        r_tag.font.name = "Arial"
        r_tag.font.size = Pt(10.5)
        r_tag.font.bold = True
        r_tag.font.color.rgb = RGBColor(0x1E, 0x40, 0xAF)

        r_desc = p_in.add_run(desc)
        r_desc.font.name = "Calibri"
        r_desc.font.size = Pt(9)
        r_desc.font.italic = True
        r_desc.font.color.rgb = RGBColor(0x64, 0x74, 0x8B)

        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(3)
        p_cap.paragraph_format.space_after = Pt(14)
        r_cap = p_cap.add_run(caption)
        r_cap.font.name = "Calibri"
        r_cap.font.size = Pt(9)
        r_cap.font.italic = True
        r_cap.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

    h_sec3 = doc.add_paragraph()
    h_sec3.paragraph_format.space_before = Pt(8)
    h_sec3.paragraph_format.space_after = Pt(6)
    r = h_sec3.add_run("3. OUTPUT SCREENSHOTS & EXPERIMENTAL VERIFICATION")
    r.font.name = "Arial"
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    add_screenshot_box(
        "Website Overview Dashboard", "3.1",
        "Figure 3.1: Production React Web Dashboard running live on GitHub Pages with real-time cloud MongoDB Atlas status",
        "Shows: Total Registered Devices (3+), Active Devices, Disconnected Devices, Total Telemetry Messages, FSM State Distribution Bars, and 'MongoDB Connected' green pulse indicator in the top header.",
        height_in=2.6
    )

    doc.add_page_break()

    add_screenshot_box(
        "Simulation Controls Deck & Live Terminal", "3.2",
        "Figure 3.2: Execution of Valid and Invalid telemetry injections demonstrating state preservation and alert logging",
        "Shows: Left simulation buttons (Send Valid Message, Invalid Temp 200°C, Simulate Failure, Simulate Timeout, Reconnect) and Right Dark Terminal Inspector showing HTTP 200 OK / HTTP 400 Bad Request JSON responses.",
        height_in=2.3
    )

    add_screenshot_box(
        "Automata FSM Visualizer", "3.3",
        "Figure 3.3: Real-time visual representation of Deterministic Finite Automaton state transitions",
        "Shows: Three Automata Nodes (Registered q0, Active F, Disconnected) with active device state highlighted with glowing ring, and chronological transition history audit table at the bottom.",
        height_in=2.3
    )

    doc.add_page_break()

    add_screenshot_box(
        "MongoDB Atlas Cloud Database Explorer", "3.4",
        "Figure 3.4: MongoDB Atlas Cloud Data Explorer verifying persistent data storage",
        "Shows: Database iot_monitoring (or test) with all 4 collections: devices, sensorreadings, alerts, and deviceevents containing live persisted documents.",
        height_in=2.6
    )

    # ========================================================
    # SECTION 4: GITHUB & CLOUD DEPLOYMENT URLS
    # ========================================================
    h_sec4 = doc.add_paragraph()
    h_sec4.paragraph_format.space_before = Pt(12)
    h_sec4.paragraph_format.space_after = Pt(6)
    r = h_sec4.add_run("4. GITHUB AND CLOUD DEPLOYMENT URLS")
    r.font.name = "Arial"
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    links_table = doc.add_table(rows=6, cols=3)
    links_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    l_widths = [Inches(2.2), Inches(1.8), Inches(3.1)]

    headers = ["Resource", "Platform", "Public Access URL"]
    for j, h_txt in enumerate(headers):
        c = links_table.rows[0].cells[j]
        c.width = l_widths[j]
        set_cell_background(c, "F1F5F9")
        set_cell_margins(c, 100, 100, 120, 120)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h_txt)
        r.font.name = "Arial"
        r.font.size = Pt(9.5)
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
        row = links_table.rows[i + 1]
        for j, txt in enumerate([res, plat, url]):
            c = row.cells[j]
            c.width = l_widths[j]
            set_cell_background(c, "FFFFFF" if i % 2 == 0 else "F8FAFC")
            set_cell_margins(c, 80, 80, 120, 120)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(txt)
            r.font.name = "Consolas" if j == 2 else "Calibri"
            r.font.size = Pt(8.5 if j == 2 else 9.5)
            if j == 0:
                r.font.bold = True
            elif j == 2:
                r.font.color.rgb = RGBColor(0x1D, 0x4E, 0xD8)
            b = {"val": "single", "sz": 4, "color": "E2E8F0"}
            set_cell_border(c, top=b, bottom=b, left=b, right=b)

    # ========================================================
    # SECTION 5: GITHUB REPOSITORY SCREENSHOTS
    # ========================================================
    doc.add_page_break()

    h_sec5 = doc.add_paragraph()
    h_sec5.paragraph_format.space_before = Pt(8)
    h_sec5.paragraph_format.space_after = Pt(6)
    r = h_sec5.add_run("5. GITHUB REPOSITORY & PUSH VERIFICATION SCREENSHOTS")
    r.font.name = "Arial"
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    add_screenshot_box(
        "GitHub Repository Main Page", "5.1",
        "Figure 5.1: GitHub Repository showing full source tree, commit message, and clean branch structure",
        "Shows: Repository Dhanusheyap755/IoT-Device-Status-Monitoring-System, branch main, latest commit, and directory structure (backend, frontend, documentation).",
        height_in=2.5
    )

    add_screenshot_box(
        "GitHub Actions Deployment / Pages Settings", "5.2",
        "Figure 5.2: GitHub repository showing active Pages deployment and live status",
        "Shows: GitHub Settings -> Pages showing 'Your site is live at https://dhanusheyap755.github.io/IoT-Device-Status-Monitoring-System/' or GitHub Actions green tick mark.",
        height_in=2.5
    )

    # Save document
    doc.save(DOCX_OUT)
    print(f"Successfully generated DOCX at: {DOCX_OUT}")

if __name__ == "__main__":
    build_docx()
