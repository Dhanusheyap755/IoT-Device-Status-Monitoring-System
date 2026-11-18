import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls, qn

BASE_DIR = r"C:\Users\abidh\.gemini\antigravity\scratch\IoT-Device-Status-Monitoring-System"
DOCX_OUT = os.path.join(BASE_DIR, "documentation", "FLAT_ACTIVITY_24ITR018_SUBMISSION.docx")
STATE_IMG = os.path.join(BASE_DIR, "documentation", "dfa_state_diagram.png")
TRANS_IMG = os.path.join(BASE_DIR, "documentation", "dfa_transition_diagram.png")

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=80, bottom=80, left=110, right=110):
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

def read_file_safe(rel_path):
    full_path = os.path.join(BASE_DIR, rel_path)
    if os.path.exists(full_path):
        with open(full_path, "r", encoding="utf-8", errors="replace") as f:
            return f.read()
    return f"// File {rel_path} not found"

def generate_docx():
    doc = docx.Document()

    # Style: Times New Roman 12pt
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Times New Roman'
    font.size = Pt(12)
    font.color.rgb = RGBColor(0x00, 0x00, 0x00)

    # Margins
    sec = doc.sections[0]
    sec.top_margin = Inches(0.6)
    sec.bottom_margin = Inches(0.6)
    sec.left_margin = Inches(0.65)
    sec.right_margin = Inches(0.65)
    sec.page_width = Inches(8.27)
    sec.page_height = Inches(11.69)

    # ========================================================
    # HEADER DETAILS (EXACT MATCH TO REFERENCE)
    # ========================================================
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("VELALAR COLLEGE OF ENGINEERING AND TECHNOLOGY, ERODE -12\n(AUTONOMOUS)\nDEPARTMENT OF INFORMATION TECHNOLOGY")
    r.font.name = "Times New Roman"
    r.font.size = Pt(13)
    r.font.bold = True

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(12)
    p.paragraph_format.line_spacing = 1.15
    
    fields = [
        ("ACADEMIC YEAR: ", "2026 -27 (ODD)\n"),
        ("ACTIVITY: ", "Project-Based Assessment\n"),
        ("NAME: ", "DHANUSHEYA P\n"),
        ("CLASS: ", "24IT5A\n"),
        ("REG.NO: ", "732924ITR018\n"),
        ("SUBJECT CODE: ", "22ITT53\n"),
        ("SUBJECT NAME: ", "FORMAL LANGUAGES AND AUTOMATA THEROY (FLAT)\n"),
        ("PROBLEM STATEMENT: ", "Create a web application that receives sample messages from simulated IoT devices over HTTP and displays their connectivity and sensor values. The backend validates each message, and a finite-state machine manages device states such as Registered, Active, and Disconnected. Invalid messages and simulated communication failures must generate visible alerts.\n"),
        ("Title Assigned: ", "IoT Device Status Monitoring System")
    ]
    for lbl, val in fields:
        r_lbl = p.add_run(lbl)
        r_lbl.font.name = "Times New Roman"
        r_lbl.font.size = Pt(12)
        r_lbl.font.bold = True

        r_val = p.add_run(val)
        r_val.font.name = "Times New Roman"
        r_val.font.size = Pt(12)
        if lbl == "Title Assigned: ":
            r_val.font.bold = True

    # Divider line
    p_div = doc.add_paragraph()
    p_div.paragraph_format.space_before = Pt(0)
    p_div.paragraph_format.space_after = Pt(10)
    r = p_div.add_run("―" * 55)
    r.font.bold = True

    # ========================================================
    # 1. STATE DIAGRAM
    # ========================================================
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("1. STATE DIAGRAM")
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    r.font.bold = True

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("1.1 Introduction")
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.font.bold = True

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.add_run(
        "A Deterministic Finite Automaton (DFA) is used in the IoT Device Status Monitoring System project to manage the operational lifecycle and connectivity health of IoT edge devices. "
        "It monitors incoming HTTP telemetry messages, boundary validations, network packet failures, and keepalive silence intervals.\n"
        "The automaton starts from the initial state q0 (Registered). When an authentic, schema-validated telemetry packet is received, the DFA moves to the operational accepting state q1 (Active). "
        "If a communication outage, packet failure, or heartbeat timeout occurs, the DFA transitions to the fault state q2 (Disconnected). "
        "When an invalid or out-of-bounds message is received, the DFA preserves its current state without mutation and generates an alert."
    )

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("1.2 States of the DFA")
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.font.bold = True

    # Table 1.2
    s_tbl = doc.add_table(rows=4, cols=2)
    s_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    s_widths = [Inches(1.8), Inches(5.2)]

    s_headers = ["State", "Description"]
    for j, h in enumerate(s_headers):
        c = s_tbl.rows[0].cells[j]
        c.width = s_widths[j]
        set_cell_background(c, "F1F5F9")
        set_cell_margins(c, 80, 80, 110, 110)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h)
        r.font.name = "Times New Roman"
        r.font.size = Pt(11)
        r.font.bold = True
        b = {"val": "single", "sz": 5, "color": "000000"}
        set_cell_border(c, top=b, bottom=b, left=b, right=b)

    s_rows = [
        ("q0", "Registered - Initial state; device identity registered in database, awaiting initial valid telemetry"),
        ("q1", "Active - Operational accepting state; authentic telemetry actively received and persisted in MongoDB"),
        ("q2", "Disconnected - Fault/outage state; network failure, packet drop, or 45-second silence timeout detected")
    ]
    for i, (st, desc) in enumerate(s_rows):
        row = s_tbl.rows[i + 1]
        for j, val in enumerate([st, desc]):
            c = row.cells[j]
            c.width = s_widths[j]
            set_cell_background(c, "FFFFFF" if i % 2 == 0 else "F8FAFC")
            set_cell_margins(c, 70, 70, 110, 110)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Times New Roman"
            r.font.size = Pt(11)
            if j == 0:
                r.font.bold = True
            b = {"val": "single", "sz": 4, "color": "CBD5E1"}
            set_cell_border(c, top=b, bottom=b, left=b, right=b)

    # 1.3 State Diagram Representation
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("1.3 State Diagram Representation :")
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.font.bold = True

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("IoT Device Status Monitoring System – DFA-Based Device State Tracking")
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.font.bold = True

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.add_run("The DFA contains three states. It manages device status transitions based on message validity, heartbeat timeouts, and network failure events.")

    # Image Insertion
    if os.path.exists(STATE_IMG):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(4)
        p_img.paragraph_format.space_after = Pt(4)
        doc.add_picture(STATE_IMG, width=Inches(6.2))

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("State Description:")
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.font.bold = True

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.add_run(
        "q0 – Initial state; device provisioned in database, awaiting initial valid telemetry transmission.\n"
        "q1 – Operational accepting state; valid telemetry received, sensor values recorded in MongoDB Atlas.\n"
        "q2 – Disconnected state; communication failure, link severed, or silence timeout detected."
    )

    # 1.4 Formal Definition of DFA
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("1.4 Formal Definition of DFA")
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.font.bold = True

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(4)
    p.add_run("A DFA is represented by the five-tuple:")

    p_tup = doc.add_paragraph()
    p_tup.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_tup.paragraph_format.space_after = Pt(6)
    r = p_tup.add_run("M = (Q, Σ, δ, q0, F)")
    r.font.name = "Times New Roman"
    r.font.size = Pt(13)
    r.font.bold = True

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(8)
    p.add_run(
        "Where:\n"
        "Q: Set of states = { q0, q1, q2 } (Registered, Active, Disconnected)\n"
        "Σ: Input alphabet = { ValidMessage, InvalidMessage, CommunicationFailure, Timeout, Reconnect }\n"
        "δ: Transition function that determines the next state (δ: Q × Σ → Q)\n"
        "q0: Initial state = q0 (Registered)\n"
        "F: Final accepting state = { q1 } (Active)\n\n"
        "The DFA accepts and maintains the device in the operational state q1 when valid, authenticated telemetry messages are continuously received."
    )

    # ========================================================
    # 2. TRANSITION DIAGRAM
    # ========================================================
    doc.add_page_break()
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("2. TRANSITION DIAGRAM")
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    r.font.bold = True

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.add_run("The transition diagram represents the movement of the DFA from one state to another based on incoming telemetry messages and network condition events.")

    # Image Insertion
    if os.path.exists(TRANS_IMG):
        p_img2 = doc.add_paragraph()
        p_img2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img2.paragraph_format.space_before = Pt(4)
        p_img2.paragraph_format.space_after = Pt(4)
        doc.add_picture(TRANS_IMG, width=Inches(6.2))

    # 2.1 Transition Table
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("2.1 Transition Table :")
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.font.bold = True

    t_tbl = doc.add_table(rows=16, cols=3)
    t_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_widths = [Inches(2.2), Inches(2.6), Inches(2.2)]

    t_headers = ["Current State", "Input Condition", "Next State"]
    for j, h in enumerate(t_headers):
        c = t_tbl.rows[0].cells[j]
        c.width = t_widths[j]
        set_cell_background(c, "F1F5F9")
        set_cell_margins(c, 80, 80, 110, 110)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h)
        r.font.name = "Times New Roman"
        r.font.size = Pt(11)
        r.font.bold = True
        b = {"val": "single", "sz": 5, "color": "000000"}
        set_cell_border(c, top=b, bottom=b, left=b, right=b)

    t_rows = [
        ("q0 (Registered)", "ValidMessage", "q1 (Active)"),
        ("q0 (Registered)", "InvalidMessage", "q0 (Registered)"),
        ("q0 (Registered)", "CommunicationFailure", "q2 (Disconnected)"),
        ("q0 (Registered)", "Timeout", "q2 (Disconnected)"),
        ("q0 (Registered)", "Reconnect", "q1 (Active)"),
        ("q1 (Active)", "ValidMessage", "q1 (Active)"),
        ("q1 (Active)", "InvalidMessage", "q1 (Active)"),
        ("q1 (Active)", "CommunicationFailure", "q2 (Disconnected)"),
        ("q1 (Active)", "Timeout", "q2 (Disconnected)"),
        ("q1 (Active)", "Reconnect", "q1 (Active)"),
        ("q2 (Disconnected)", "ValidMessage", "q1 (Active)"),
        ("q2 (Disconnected)", "Reconnect", "q1 (Active)"),
        ("q2 (Disconnected)", "CommunicationFailure", "q2 (Disconnected)"),
        ("q2 (Disconnected)", "Timeout", "q2 (Disconnected)"),
        ("q2 (Disconnected)", "InvalidMessage", "q2 (Disconnected)")
    ]
    for i, (cs, ic, ns) in enumerate(t_rows):
        row = t_tbl.rows[i + 1]
        for j, val in enumerate([cs, ic, ns]):
            c = row.cells[j]
            c.width = t_widths[j]
            set_cell_background(c, "FFFFFF" if i % 2 == 0 else "F8FAFC")
            set_cell_margins(c, 60, 60, 110, 110)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Times New Roman"
            r.font.size = Pt(10.5)
            if j == 0 or j == 2:
                r.font.bold = True
            b = {"val": "single", "sz": 4, "color": "CBD5E1"}
            set_cell_border(c, top=b, bottom=b, left=b, right=b)

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("Special Conditions:")
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.font.bold = True

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.add_run(
        "• If an InvalidMessage is received from any state, the DFA remains in its current state (State Invariant: δ(q, InvalidMessage) = q), rejects the payload with HTTP 400 Bad Request, and logs a warning alert.\n"
        "• If communication failure occurs or the 45-second heartbeat window expires without telemetry, the DFA moves to q2 (Disconnected).\n"
        "• When valid telemetry is received from Disconnected, the DFA automatically recovers to q1 (Active) and saves the reading.\n"
        "• When any state transition occurs, an immutable event ledger entry is recorded in the MongoDB Atlas database."
    )

    # 2.2 Example of State Transitions
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("2.2 Example of State Transitions :")
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.font.bold = True

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(4)
    p.add_run("Consider an IoT Device with ID IOT001 undergoing registration, normal telemetry transmission, invalid message injection, network failure, and automatic recovery:")

    ex_tbl = doc.add_table(rows=6, cols=4)
    ex_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    ex_widths = [Inches(1.0), Inches(1.5), Inches(3.0), Inches(1.5)]

    ex_headers = ["Step", "Device ID", "Event / Payload Details", "DFA State"]
    for j, h in enumerate(ex_headers):
        c = ex_tbl.rows[0].cells[j]
        c.width = ex_widths[j]
        set_cell_background(c, "F1F5F9")
        set_cell_margins(c, 80, 80, 110, 110)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h)
        r.font.name = "Times New Roman"
        r.font.size = Pt(11)
        r.font.bold = True
        b = {"val": "single", "sz": 5, "color": "000000"}
        set_cell_border(c, top=b, bottom=b, left=b, right=b)

    ex_rows = [
        ("Initial", "IOT001", "Device Provisioning in database", "q0 (Registered)"),
        ("1", "IOT001", "ValidMessage (Temp: 28.5°C, Hum: 65%)", "q1 (Active)"),
        ("2", "IOT001", "InvalidMessage (Temp: 200°C - Out of bounds)", "q1 (Active)"),
        ("3", "IOT001", "CommunicationFailure (Packet drop)", "q2 (Disconnected)"),
        ("4", "IOT001", "ValidMessage (Temp: 24.0°C, Hum: 60%)", "q1 (Active)")
    ]
    for i, (st, dev, ev, dfa) in enumerate(ex_rows):
        row = ex_tbl.rows[i + 1]
        for j, val in enumerate([st, dev, ev, dfa]):
            c = row.cells[j]
            c.width = ex_widths[j]
            set_cell_background(c, "FFFFFF" if i % 2 == 0 else "F8FAFC")
            set_cell_margins(c, 60, 60, 110, 110)
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Times New Roman"
            r.font.size = Pt(10.5)
            if j == 0 or j == 3:
                r.font.bold = True
            b = {"val": "single", "sz": 4, "color": "CBD5E1"}
            set_cell_border(c, top=b, bottom=b, left=b, right=b)

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(8)
    p.add_run(
        "Result: After receiving valid telemetry, the DFA enters operational state q1 (Active). "
        "Out-of-bounds messages are rejected while preserving the current state. "
        "When communication fails, the device enters q2 (Disconnected), and subsequent valid telemetry automatically restores the device to q1 (Active)."
    )

    # ========================================================
    # CODE SECTION
    # ========================================================
    doc.add_page_break()
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("CODE:")
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    r.font.bold = True

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    r = p.add_run("File Name: deviceStateMachine.js")
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.font.bold = True

    code_text = read_file_safe("backend/fsm/deviceStateMachine.js")
    p_c = doc.add_paragraph()
    p_c.paragraph_format.space_after = Pt(8)
    p_c.paragraph_format.line_spacing = 1.05
    r_c = p_c.add_run(code_text)
    r_c.font.name = "Consolas"
    r_c.font.size = Pt(8.0)
    r_c.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    # ========================================================
    # OUTPUT
    # ========================================================
    doc.add_page_break()
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("Output:")
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    r.font.bold = True

    out_text = (
        "Device ID: IOT001\n"
        "Event: Device Provisioning\n"
        "DFA State: q0 (Registered)\n\n"
        "Device ID: IOT001\n"
        "Incoming Telemetry: Temperature = 28.5°C, Humidity = 65%\n"
        "Event: ValidMessage\n"
        "DFA State: q1 (Active)\n\n"
        "Device ID: IOT001\n"
        "Incoming Telemetry: Temperature = 200°C (Out of Bounds)\n"
        "Event: InvalidMessage\n"
        "DFA State: q1 (Active - State Preserved)\n"
        "ALERT: Validation Failed - Temperature 200°C out of bounds (-40°C to 85°C)!\n\n"
        "Device ID: IOT001\n"
        "Event: CommunicationFailure (Simulated Packet Drop)\n"
        "DFA State: q2 (Disconnected)\n"
        "ALERT: Network Communication Failure Detected!\n\n"
        "Device ID: IOT001\n"
        "Incoming Telemetry: Temperature = 24.0°C, Humidity = 60%\n"
        "Event: ValidMessage\n"
        "DFA State: q1 (Active - Automatic Recovery)\n"
        "ALERT: Device Reconnected Successfully!"
    )
    p_out = doc.add_paragraph()
    p_out.paragraph_format.space_after = Pt(10)
    p_out.paragraph_format.line_spacing = 1.05
    r_o = p_out.add_run(out_text)
    r_o.font.name = "Consolas"
    r_o.font.size = Pt(9.5)
    r_o.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

    # ========================================================
    # PROCEDURE STEPS
    # ========================================================
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("PROCEDURE STEPS :")
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    r.font.bold = True

    proc_steps = [
        "1. Start the MongoDB database service to make the database available for the application.",
        "2. Open the IoT-Device-Status-Monitoring-System project folder in Visual Studio Code.",
        "3. Open the backend folder in the terminal and install the required Node.js dependencies using npm install.",
        "4. Configure the MongoDB connection string and environment variables in the backend configuration.",
        "5. Start the backend server using npm start and verify that it binds to port 5000 and 0.0.0.0.",
        "6. Open another terminal and navigate to the frontend folder.",
        "7. Install the frontend dependencies and start the React development server using npm run dev.",
        "8. Open the IoT monitoring application in a web browser using the local URL or the deployed GitHub Pages URL.",
        "9. View the available device information and real-time connectivity status displayed on the Overview Dashboard.",
        "10. Navigate to the Simulation Controls page to test different telemetry inputs and network events.",
        "11. Enter or send a valid sensor message and observe the DFA transition from q0 to q1 (Active).",
        "12. Enter an out-of-bounds temperature (e.g., 200°C) and verify that the DFA remains in its current state and generates an alert.",
        "13. Simulate a communication failure or timeout event and observe the DFA transition to q2 (Disconnected).",
        "14. Trigger a reconnect action or send a valid message to observe the automatic recovery back to q1 (Active).",
        "15. Navigate to the FSM Visualizer tab to inspect the visual state diagram, active state illumination, and MongoDB event audit history."
    ]
    for step in proc_steps:
        p_st = doc.add_paragraph()
        p_st.paragraph_format.space_after = Pt(2)
        r = p_st.add_run(step)
        r.font.name = "Times New Roman"
        r.font.size = Pt(11)

    # ========================================================
    # ADVANTAGES OF USING FLAT CONCEPT
    # ========================================================
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("ADVANTAGES OF USING FLAT CONCEPT IN IOT MONITORING :")
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    r.font.bold = True

    advs = [
        ("Deterministic State Control: ", "Prevents unpredictable or illegal states by ensuring every state transition is formally governed by δ(q, σ)."),
        ("Automatic Anomaly Isolation: ", "Automatically detects network packet failures and silence timeouts, moving faulty devices into q2 (Disconnected)."),
        ("Strict Invariant Enforcement: ", "Guarantees that malformed or out-of-bounds payloads (InvalidMessage) cannot alter device state or corrupt the database."),
        ("Fast and Reliable Processing: ", "Evaluates transitions in O(1) constant time through a pre-computed transition lookup table."),
        ("Non-Repudiable Auditing: ", "Logs every state change as an immutable record in MongoDB Atlas for regulatory compliance and audit tracking.")
    ]
    for lbl, desc in advs:
        p_ad = doc.add_paragraph()
        p_ad.paragraph_format.space_after = Pt(3)
        r_l = p_ad.add_run("• " + lbl)
        r_l.font.name = "Times New Roman"
        r_l.font.size = Pt(11)
        r_l.font.bold = True

        r_d = p_ad.add_run(desc)
        r_d.font.name = "Times New Roman"
        r_d.font.size = Pt(11)

    doc.save(DOCX_OUT)
    print("SUCCESS: Generated exact format Word document at:", DOCX_OUT)

if __name__ == "__main__":
    generate_docx()
