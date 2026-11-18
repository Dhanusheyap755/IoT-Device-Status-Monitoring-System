import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

OUT_DIR = r"C:\Users\abidh\.gemini\antigravity\scratch\IoT-Device-Status-Monitoring-System\documentation"

def draw_state_diagram():
    fig, ax = plt.subplots(figsize=(9, 4.2), dpi=200)
    ax.set_xlim(-1, 11)
    ax.set_ylim(-2.5, 4.5)
    ax.axis('off')

    # Title
    ax.text(5, 4.0, "DFA State Diagram - IoT Device Status Monitoring System", 
            ha='center', va='center', fontsize=12, fontweight='bold', fontfamily='sans-serif')

    # States positions
    # q0: Registered (2, 1.5)
    # q1: Active (accepting, double circle) (6.5, 2.5)
    # q2: Disconnected (6.5, 0.0)

    # Start Arrow
    ax.annotate('', xy=(1.0, 1.5), xytext=(-0.2, 1.5),
                arrowprops=dict(facecolor='black', width=1.5, headwidth=8))
    ax.text(0.3, 1.8, "Start", fontsize=10, fontweight='bold')

    # Circle 1: q0 (Registered)
    c0 = plt.Circle((2.0, 1.5), 1.0, facecolor='#E0F2FE', edgecolor='black', linewidth=2)
    ax.add_patch(c0)
    ax.text(2.0, 1.6, "q0", ha='center', va='center', fontsize=12, fontweight='bold')
    ax.text(2.0, 1.2, "(Registered)", ha='center', va='center', fontsize=8)

    # Circle 2: q1 (Active - Accepting State, double circle)
    c1_outer = plt.Circle((7.0, 2.5), 1.1, facecolor='#DCFCE7', edgecolor='black', linewidth=2)
    c1_inner = plt.Circle((7.0, 2.5), 0.95, facecolor='#DCFCE7', edgecolor='black', linewidth=1.5)
    ax.add_patch(c1_outer)
    ax.add_patch(c1_inner)
    ax.text(7.0, 2.65, "q1", ha='center', va='center', fontsize=12, fontweight='bold')
    ax.text(7.0, 2.25, "(Active)", ha='center', va='center', fontsize=8)

    # Circle 3: q2 (Disconnected)
    c2 = plt.Circle((7.0, 0.0), 1.0, facecolor='#FEE2E2', edgecolor='black', linewidth=2)
    ax.add_patch(c2)
    ax.text(7.0, 0.1, "q2", ha='center', va='center', fontsize=12, fontweight='bold')
    ax.text(7.0, -0.3, "(Disconnected)", ha='center', va='center', fontsize=8)

    # Transition 1: q0 -> q1 (ValidMessage)
    ax.annotate('', xy=(5.9, 2.3), xytext=(2.9, 1.8),
                arrowprops=dict(arrowstyle="->", color="black", lw=1.8, connectionstyle="arc3,rad=-0.1"))
    ax.text(4.2, 2.45, "ValidMessage", fontsize=9, fontweight='bold', color='#15803D', rotation=12)

    # Transition 2: q0 -> q2 (CommFailure / Timeout)
    ax.annotate('', xy=(6.0, 0.2), xytext=(2.9, 1.2),
                arrowprops=dict(arrowstyle="->", color="black", lw=1.8, connectionstyle="arc3,rad=0.1"))
    ax.text(3.7, 0.25, "CommFailure / Timeout", fontsize=9, fontweight='bold', color='#B91C1C', rotation=-14)

    # Self Loop on q0: InvalidMessage
    ax.annotate('', xy=(1.5, 2.35), xytext=(2.5, 2.35),
                arrowprops=dict(arrowstyle="<-", color="black", lw=1.8, connectionstyle="arc3,rad=2.5"))
    ax.text(2.0, 3.2, "InvalidMessage\n(State preserved)", ha='center', fontsize=8, color='#B45309')

    # Self Loop on q1: ValidMessage
    ax.annotate('', xy=(6.6, 3.5), xytext=(7.4, 3.5),
                arrowprops=dict(arrowstyle="<-", color="black", lw=1.8, connectionstyle="arc3,rad=2.5"))
    ax.text(7.0, 4.3, "ValidMessage\n(Telemetry stream)", ha='center', fontsize=8, color='#15803D')

    # Transition 3: q1 -> q2 (CommFailure / Timeout)
    ax.annotate('', xy=(7.2, 1.05), xytext=(7.2, 1.4),
                arrowprops=dict(arrowstyle="->", color="black", lw=1.8))
    ax.text(7.35, 1.25, "CommFailure / Timeout", fontsize=8, fontweight='bold', color='#B91C1C')

    # Transition 4: q2 -> q1 (ValidMessage / Reconnect)
    ax.annotate('', xy=(6.8, 1.4), xytext=(6.8, 1.05),
                arrowprops=dict(arrowstyle="->", color="black", lw=1.8))
    ax.text(5.0, 1.25, "ValidMessage / Reconnect", fontsize=8, fontweight='bold', color='#1D4ED8')

    # Self Loop on q2: InvalidMessage / Repeated CommFailure
    ax.annotate('', xy=(6.6, -0.95), xytext=(7.4, -0.95),
                arrowprops=dict(arrowstyle="->", color="black", lw=1.8, connectionstyle="arc3,rad=2.5"))
    ax.text(7.0, -1.8, "InvalidMessage / Timeout\n(State preserved)", ha='center', fontsize=8, color='#64748B')

    plt.tight_layout()
    out_file = os.path.join(OUT_DIR, "dfa_state_diagram.png")
    plt.savefig(out_file, bbox_inches='tight')
    plt.close()
    print("Saved State Diagram to:", out_file)

def draw_transition_diagram():
    fig, ax = plt.subplots(figsize=(9, 3.8), dpi=200)
    ax.set_xlim(-0.5, 11)
    ax.set_ylim(-1.5, 3.8)
    ax.axis('off')

    # Title
    ax.text(5, 3.4, "DFA Transition Diagram showing IoT Status Events", 
            ha='center', va='center', fontsize=12, fontweight='bold', fontfamily='sans-serif')

    # Start Arrow
    ax.annotate('', xy=(1.0, 1.5), xytext=(-0.2, 1.5),
                arrowprops=dict(facecolor='black', width=1.5, headwidth=8))
    ax.text(0.3, 1.8, "Start", fontsize=10, fontweight='bold')

    # Box 1: q0 (Registered)
    box0 = patches.FancyBboxPatch((1.0, 0.8), 2.0, 1.4, boxstyle="round,pad=0.2",
                                  facecolor='#F1F5F9', edgecolor='black', linewidth=2)
    ax.add_patch(box0)
    ax.text(2.0, 1.6, "q0", ha='center', va='center', fontsize=12, fontweight='bold')
    ax.text(2.0, 1.2, "Registered", ha='center', va='center', fontsize=9)

    # Box 2: q1 (Active - Accepting State)
    box1_outer = patches.FancyBboxPatch((5.0, 1.8), 2.2, 1.4, boxstyle="round,pad=0.2",
                                        facecolor='#DCFCE7', edgecolor='black', linewidth=2.5)
    box1_inner = patches.FancyBboxPatch((5.1, 1.9), 2.0, 1.2, boxstyle="round,pad=0.15",
                                        facecolor='#DCFCE7', edgecolor='black', linewidth=1.5)
    ax.add_patch(box1_outer)
    ax.add_patch(box1_inner)
    ax.text(6.1, 2.6, "q1 (Active)", ha='center', va='center', fontsize=11, fontweight='bold')
    ax.text(6.1, 2.2, "[Accepting State]", ha='center', va='center', fontsize=8, color='#15803D')

    # Box 3: q2 (Disconnected)
    box2 = patches.FancyBboxPatch((5.0, -0.4), 2.2, 1.4, boxstyle="round,pad=0.2",
                                  facecolor='#FEE2E2', edgecolor='black', linewidth=2)
    ax.add_patch(box2)
    ax.text(6.1, 0.4, "q2", ha='center', va='center', fontsize=12, fontweight='bold')
    ax.text(6.1, 0.0, "Disconnected", ha='center', va='center', fontsize=9)

    # Forward Arrow q0 -> q1
    ax.annotate('', xy=(4.9, 2.5), xytext=(3.1, 1.8),
                arrowprops=dict(arrowstyle="->", color="black", lw=1.8))
    ax.text(3.6, 2.3, "ValidMessage", fontsize=9, fontweight='bold', color='#15803D')

    # Forward Arrow q0 -> q2
    ax.annotate('', xy=(4.9, 0.4), xytext=(3.1, 1.2),
                arrowprops=dict(arrowstyle="->", color="black", lw=1.8))
    ax.text(3.3, 0.5, "CommFailure / Timeout", fontsize=8, fontweight='bold', color='#B91C1C')

    # Between Active and Disconnected
    ax.annotate('', xy=(6.5, 0.9), xytext=(6.5, 1.7),
                arrowprops=dict(arrowstyle="->", color="black", lw=1.8))
    ax.text(6.6, 1.3, "CommFailure", fontsize=8, color='#B91C1C')

    ax.annotate('', xy=(5.7, 1.7), xytext=(5.7, 0.9),
                arrowprops=dict(arrowstyle="->", color="black", lw=1.8))
    ax.text(4.2, 1.3, "Reconnect", fontsize=8, color='#1D4ED8')

    # Footnote labels
    ax.text(5.5, -1.1, "Each valid telemetry message transitions or maintains Active state.\nInvalid message causes self-loop: current state is preserved and alert is logged.", 
            ha='center', va='center', fontsize=8.5, fontstyle='italic', color='#334155')

    plt.tight_layout()
    out_file = os.path.join(OUT_DIR, "dfa_transition_diagram.png")
    plt.savefig(out_file, bbox_inches='tight')
    plt.close()
    print("Saved Transition Diagram to:", out_file)

if __name__ == "__main__":
    draw_state_diagram()
    draw_transition_diagram()
