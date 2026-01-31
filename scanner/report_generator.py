import os
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
REPORT_DIR = os.path.join(BASE_DIR, "reports")

def generate_report(scan):
    filename = f"scan_report_{scan['_id']}.pdf"
    file_path = os.path.join(REPORT_DIR, filename)

    c = canvas.Canvas(file_path, pagesize=A4)
    width, height = A4

    y = height - 40

    c.setFont("Helvetica-Bold", 18)
    c.drawString(40, y, "VAPT Scan Report")

    y -= 40
    c.setFont("Helvetica", 12)
    c.drawString(40, y, f"Target: {scan['target']}")

    y -= 20
    c.drawString(40, y, f"Scan Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    y -= 40
    c.setFont("Helvetica-Bold", 14)
    c.drawString(40, y, "Findings")

    y -= 20
    c.setFont("Helvetica", 11)

    for finding in scan.get("findings", []):
        c.drawString(40, y, f"- {finding['owasp']} ({finding['severity']})")
        y -= 15
        c.drawString(60, y, finding["description"])
        y -= 20

        if y < 100:
            c.showPage()
            y = height - 40

    c.save()
    return file_path
