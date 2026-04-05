from datetime import datetime
from pathlib import Path
import sys
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
        # DEBUG: Print the scan data structure
        print("=" * 50, file=sys.stderr)
        print("DEBUG: scan_data keys:", scan_data.keys() if isinstance(scan_data, dict) else "Not a dict", file=sys.stderr)
        print("DEBUG: findings count:", len(scan_data.get("findings", [])), file=sys.stderr)
        print("DEBUG: open_ports:", scan_data.get("open_ports", []), file=sys.stderr)
        print("=" * 50, file=sys.stderr)
        
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
        target = scan_data.get("target", "N/A")
        scan_date = scan_data.get("createdAt", datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        
        info_data = [
            ["Target URL:", target],
            ["Scan Date:", scan_date],
            ["Report ID:", f"VAPT-{datetime.now().strftime('%Y%m%d%H%M%S')}"]
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

        # ---------- PREPARE FINDINGS DATA ----------
        findings = scan_data.get("findings", [])
        open_ports = scan_data.get("open_ports", [])
        
        # Add open ports as a finding if they exist
        if open_ports:
            findings.insert(0, {
                "type": "OPEN_PORTS",
                "severity": "MEDIUM",
                "description": "Unnecessary open ports increase attack surface",
                "evidence": open_ports,
                "owasp": "A05:2021 – Security Misconfiguration"
            })

        # Count severity levels
        severity = {"CRITICAL":0, "HIGH":0, "MEDIUM":0, "LOW":0, "INFO":0}
        for f in findings:
            sev = str(f.get("severity","INFO")).upper()
            if sev not in severity:
                sev = "INFO"
            severity[sev] += 1

        total = sum(severity.values())

        # ---------- SUMMARY & CHART LAYOUT ----------
        elements.append(Paragraph("Executive Summary", section))

        # 1. Summary Table
        summary_data = [
            ["Severity", "Count"],
            ["Critical", str(severity["CRITICAL"])],
            ["High", str(severity["HIGH"])],
            ["Medium", str(severity["MEDIUM"])],
            ["Low", str(severity["LOW"])],
            ["Total", str(total)]
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
        if total > 0 and findings:
            elements.append(Paragraph("Detailed Findings", section))

            # Adjusted widths to total 7.3 inches
            table_data = [["#", "Vulnerability Type", "Severity", "Description"]]

            for i, f in enumerate(findings, 1):
                sev = str(f.get("severity","INFO")).upper()
                if sev not in SEVERITY_COLORS:
                    sev = "INFO"
                sev_color = SEVERITY_COLORS[sev]

                sev_para = Paragraph(
                    f'<font color="{sev_color.hexval()}"><b>{sev}</b></font>',
                    normal
                )
                
                vuln_type = f.get("type", "Unknown")
                description = f.get("description", "No description provided.")

                table_data.append([
                    str(i),
                    Paragraph(vuln_type, normal),
                    sev_para,
                    Paragraph(description, normal)
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
            elements.append(Spacer(1, 0.3*inch))
            
            # ---------- DETAILED EVIDENCE SECTION ----------
            elements.append(Paragraph("Detailed Evidence", section))
            
            for i, f in enumerate(findings, 1):
                sev = str(f.get("severity","INFO")).upper()
                vuln_type = f.get("type", "Unknown")
                
                # Heading for each finding
                elements.append(Paragraph(f"{i}. {vuln_type}", ParagraphStyle(
                    "subsection",
                    parent=styles["Heading3"],
                    fontSize=11,
                    fontName="Helvetica-Bold",
                    textColor=SEVERITY_COLORS.get(sev, SEVERITY_COLORS["INFO"]),
                    spaceBefore=10,
                    spaceAfter=6
                )))
                
                # Description
                if f.get("description"):
                    elements.append(Paragraph(f"<b>Description:</b> {f.get('description')}", normal))
                
                # Evidence/Details
                if f.get("evidence"):
                    evidence = f.get("evidence")
                    if isinstance(evidence, list):
                        elements.append(Paragraph(f"<b>Evidence:</b> {', '.join(str(e) for e in evidence)}", normal))
                    else:
                        elements.append(Paragraph(f"<b>Evidence:</b> {evidence}", normal))
                
                if f.get("details"):
                    details = f.get("details")
                    if isinstance(details, list) and details:
                        elements.append(Paragraph(f"<b>Details:</b>", normal))
                        for detail in details:
                            if isinstance(detail, dict):
                                detail_str = " | ".join([f"{k}: {v}" for k, v in detail.items()])
                                elements.append(Paragraph(f"• {detail_str}", normal))
                            else:
                                elements.append(Paragraph(f"• {detail}", normal))
                
                # OWASP Reference
                if f.get("owasp"):
                    elements.append(Paragraph(f"<b>OWASP:</b> {f.get('owasp')}", normal))
                
                elements.append(Spacer(1, 0.15*inch))

        # ---------- BUILD ----------
        doc.build(elements, onFirstPage=add_footer, onLaterPages=add_footer)
        return str(filename)

    except Exception as e:
        print(f"Error generating PDF: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        raise e

