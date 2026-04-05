from datetime import datetime
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
)
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.legends import Legend

# ---------- MODERN COLOR PALETTE ----------
THEME_COLOR = colors.HexColor("#F43F5E") # Rose/Red
TEXT_MAIN = colors.HexColor("#0f172a")   # Dark Slate
TEXT_MUTED = colors.HexColor("#475569")  # Gray
BG_LIGHT = colors.HexColor("#f8fafc")    # Off-white
BORDER_COLOR = colors.HexColor("#e2e8f0")

SEVERITY_COLORS = {
    "CRITICAL": colors.HexColor("#ef4444"),
    "HIGH": colors.HexColor("#f97316"),
    "MEDIUM": colors.HexColor("#eab308"),
    "LOW": colors.HexColor("#3b82f6"),
    "INFO": colors.HexColor("#94a3b8")
}

# ---------- FOOTER ----------
def add_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont('Helvetica', 9)
    canvas.setFillColor(TEXT_MUTED)

    canvas.drawString(0.6 * inch, 0.5 * inch,
        f"VAPT Bolt Scanner | Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    canvas.drawRightString(letter[0] - 0.6 * inch, 0.5 * inch,
        f"Page {doc.page}")
    canvas.restoreState()


def generate_report(scan_data):
    try:
        scanner_dir = Path(__file__).parent.absolute()
        reports_dir = scanner_dir / "reports"
        reports_dir.mkdir(parents=True, exist_ok=True)

        filename = reports_dir / f"scan_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"

        # Setup Document (Letter width is 8.5 inches. Margins: 0.6 * 2 = 1.2. Usable width = 7.3 inches)
        doc = SimpleDocTemplate(
            str(filename),
            pagesize=letter,
            rightMargin=0.6*inch,
            leftMargin=0.6*inch,
            topMargin=0.8*inch,
            bottomMargin=0.8*inch
        )

        elements = []
        styles = getSampleStyleSheet()

        # ---------- CUSTOM STYLES ----------
        title = ParagraphStyle(
            "title",
            parent=styles["Heading1"],
            fontSize=22,
            fontName="Helvetica-Bold",
            textColor=TEXT_MAIN,
            alignment=0, # Left aligned
            spaceAfter=20
        )

        section = ParagraphStyle(
            "section",
            parent=styles["Heading2"],
            fontSize=14,
            fontName="Helvetica-Bold",
            textColor=THEME_COLOR,
            spaceBefore=15,
            spaceAfter=10
        )

        normal = ParagraphStyle(
            "normal",
            parent=styles["BodyText"],
            fontSize=10,
            textColor=TEXT_MAIN,
            leading=14 # Better line spacing
        )

        # ---------- HEADER ----------
        logo_path = scanner_dir / "banner.png"
        if logo_path.exists():
            elements.append(Image(str(logo_path), width=9.2*inch, height=1.8*inch))
            elements.append(Spacer(1, 0.2*inch))

        elements.append(Paragraph("Security Assessment Report", title))

        # ---------- INFO CARD ----------
        info_data = [
            ["Target URL:", scan_data.get("target", "N/A")],
            ["Scan Date:", scan_data.get("createdAt", "N/A")],
            ["Report ID:", f"VAPT-{datetime.now().strftime('%Y%m%d')}"]
        ]

        info_table = Table(info_data, colWidths=[1.5*inch, 5.8*inch])
        info_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
            ('TEXTCOLOR', (0,0), (0,-1), TEXT_MUTED),
            ('TEXTCOLOR', (1,0), (1,-1), TEXT_MAIN),
            ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
            ('FONTNAME', (1,0), (1,-1), 'Helvetica'),
            ('FONTSIZE', (0,0), (-1,-1), 10),
            ('PADDING', (0,0), (-1,-1), 8),
            ('LINEBELOW', (0,0), (-1,-2), 1, colors.white), # Soft dividers
        ]))

        elements.append(info_table)
        elements.append(Spacer(1, 0.3*inch))

        # ---------- SUMMARY & CHART LAYOUT ----------
        elements.append(Paragraph("Executive Summary", section))

        findings = scan_data.get("findings", [])
        severity = {"CRITICAL":0, "HIGH":0, "MEDIUM":0, "LOW":0, "INFO":0}

        for f in findings:
            sev = str(f.get("severity","INFO")).upper()
            severity[sev if sev in severity else "INFO"] += 1

        total = sum(severity.values())

        # 1. Summary Table
        summary_data = [
            ["Severity", "Count"],
            ["Critical", severity["CRITICAL"]],
            ["High", severity["HIGH"]],
            ["Medium", severity["MEDIUM"]],
            ["Low", severity["LOW"]],
            ["Total", total]
        ]

        summary_table = Table(summary_data, colWidths=[1.5*inch, 1*inch])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), THEME_COLOR),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('ALIGN', (1,0), (1,-1), 'CENTER'),
            ('BOTTOMPADDING', (0,0), (-1,0), 8),
            ('BACKGROUND', (0,-1), (-1,-1), BG_LIGHT),
            ('FONTNAME', (0,-1), (-1,-1), 'Helvetica-Bold'),
            ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))

        # 2. Dynamic Pie Chart
        drawing = Drawing(250, 150)
        pie_data = []
        pie_colors = []
        pie_labels = []

        # Only add data to the pie chart if the value is > 0
        for key in ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]:
            if severity[key] > 0:
                pie_data.append(severity[key])
                pie_colors.append(SEVERITY_COLORS[key])
                pie_labels.append(f"{key.capitalize()} ({severity[key]})")

        if pie_data:
            pie = Pie()
            pie.x = 10
            pie.y = 25
            pie.width = 100
            pie.height = 100
            pie.data = pie_data
            pie.labels = None # Remove ugly default labels
            
            # Apply colors and white borders to slices
            for i, col in enumerate(pie_colors):
                pie.slices[i].fillColor = col
                pie.slices[i].strokeColor = colors.white
                pie.slices[i].strokeWidth = 1.5

            # Add a clean Legend
            legend = Legend()
            legend.x = 130
            legend.y = 110
            legend.dx = 10
            legend.dy = 10
            legend.fontName = 'Helvetica'
            legend.fontSize = 10
            legend.colorNamePairs = list(zip(pie_colors, pie_labels))

            drawing.add(pie)
            drawing.add(legend)
        else:
            # Fallback if no vulnerabilities found
            elements.append(Paragraph("No vulnerabilities detected.", normal))

        # Put Table and Chart side-by-side
        layout_table = Table([[summary_table, drawing]], colWidths=[2.8*inch, 4.5*inch])
        layout_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
        ]))
        
        elements.append(layout_table)
        elements.append(Spacer(1, 0.3*inch))

        # ---------- FINDINGS DETAILS ----------
        if total > 0:
            elements.append(Paragraph("Detailed Findings", section))

            # Adjusted widths to total 7.3 inches
            table_data = [["#", "Vulnerability Type", "Severity", "Description"]]

            for i, f in enumerate(findings, 1):
                sev = str(f.get("severity","INFO")).upper()
                sev_color = SEVERITY_COLORS.get(sev, SEVERITY_COLORS["INFO"])

                sev_para = Paragraph(
                    f'<font color="{sev_color.hexval()}"><b>{sev}</b></font>',
                    normal
                )

                table_data.append([
                    str(i),
                    Paragraph(f.get("type","Unknown"), normal),
                    sev_para,
                    Paragraph(f.get("description","No description provided."), normal)
                ])

            findings_table = Table(table_data, colWidths=[0.4*inch, 2.0*inch, 1.0*inch, 3.9*inch])

            findings_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), TEXT_MAIN), # Dark header for contrast
                ('TEXTCOLOR', (0,0), (-1,0), colors.white),
                ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0,0), (-1,0), 10),
                ('TOPPADDING', (0,0), (-1,0), 10),
                
                # alternating rows
                ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
                ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('PADDING', (0,1), (-1,-1), 8),
            ]))

            elements.append(findings_table)

        # ---------- BUILD ----------
        doc.build(elements, onFirstPage=add_footer, onLaterPages=add_footer)
        return str(filename)

    except Exception as e:
        print(f"Error generating PDF: {e}")
        raise e