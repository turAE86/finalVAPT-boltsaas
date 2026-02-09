# scanner/report_generator.py
import json
from datetime import datetime
from pathlib import Path
import os
import sys

# Try to import reportlab, with helpful error if missing
try:
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
    from reportlab.lib import colors
    from reportlab.lib.units import inch
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
except ImportError as e:
    print(f"Error: reportlab not installed. Install with: pip install reportlab", file=sys.stderr)
    print(f"Import error details: {str(e)}", file=sys.stderr)
    sys.exit(1)

def generate_report(scan_data):
    """
    Generate a PDF report from scan data
    """
    try:
        # Create reports directory using absolute path
        scanner_dir = Path(__file__).parent.absolute()
        reports_dir = scanner_dir / "reports"
        reports_dir.mkdir(parents=True, exist_ok=True)
        
        sys.stderr.write(f"Reports directory: {reports_dir}\n")
        sys.stderr.flush()
        
        # Generate filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        filename = reports_dir / f"scan_report_{timestamp}.pdf"
        
        sys.stderr.write(f"Generating PDF: {filename}\n")
        sys.stderr.flush()
        
        # Create PDF document
        doc = SimpleDocTemplate(
            str(filename),
            pagesize=letter,
            rightMargin=0.5*inch,
            leftMargin=0.5*inch,
            topMargin=0.75*inch,
            bottomMargin=0.75*inch
        )
        elements = []
        
        # Create styles
        styles = getSampleStyleSheet()
        
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            textColor=colors.HexColor('#0B1120'),
            spaceAfter=12,
            alignment=1
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=12,
            textColor=colors.HexColor('#F43F5E'),
            spaceAfter=6,
            spaceBefore=6
        )
        
        # Add title
        elements.append(Paragraph("VAPT Bolt Security Scan Report", title_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Add basic info
        def escape_html(text):
            return str(text).replace('<', '<').replace('>', '>').replace('&', '&amp;')

        target = escape_html(scan_data.get('target', 'Unknown'))
        created_at = escape_html(scan_data.get('createdAt', 'Unknown'))

        info_data = [
            ['<b>Target URL</b>', target],
            ['<b>Scan Date</b>', created_at],
            ['<b>Report Generated</b>', datetime.now().strftime("%Y-%m-%d %H:%M:%S")]
        ]
        
        info_table = Table(info_data, colWidths=[1.5*inch, 4.5*inch])
        info_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#E0E0E0')),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#0B1120')),
            ('TEXTCOLOR', (1, 0), (1, -1), colors.HexColor('#333333')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CCCCCC'))
        ]))
        
        elements.append(info_table)
        elements.append(Spacer(1, 0.3*inch))
        
        # Add findings
        findings = scan_data.get('findings', [])
        
        if findings:
            elements.append(Paragraph("Vulnerabilities Found", heading_style))
            elements.append(Spacer(1, 0.1*inch))
            
            for idx, finding in enumerate(findings, 1):
                try:
                    finding_type = escape_html(finding.get('type', 'Unknown'))
                    severity = str(finding.get('severity', 'Unknown')).upper()
                    owasp = escape_html(finding.get('owasp', 'Unknown'))
                    description = escape_html(finding.get('description', 'N/A'))
                    
                    # Add severity color
                    severity_color = '#FF0000'  # Red
                    if severity == 'HIGH':
                        severity_color = '#FF6600'  # Orange
                    elif severity == 'MEDIUM':
                        severity_color = '#FFCC00'  # Yellow
                    elif severity == 'LOW':
                        severity_color = '#0066FF'  # Blue
                    
                    finding_html = f"""
                    <b>{idx}. {finding_type}</b><br/>
                    <font color="{severity_color}"><b>Severity: {severity}</b></font><br/>
                    <b>OWASP:</b> {owasp}<br/>
                    <b>Description:</b> {description}<br/>
                    """
                    elements.append(Paragraph(finding_html, styles['BodyText']))
                    elements.append(Spacer(1, 0.15*inch))
                except Exception as e:
                    sys.stderr.write(f"Error processing finding {idx}: {str(e)}\n")
                    sys.stderr.flush()
                    continue
        else:
            elements.append(Paragraph("No vulnerabilities found", styles['BodyText']))
        
        elements.append(Spacer(1, 0.2*inch))
        elements.append(Paragraph("Report generated by VAPT Bolt Security Scanner", styles['Normal']))
        
        # Build PDF
        try:
            doc.build(elements)
            sys.stderr.write(f"PDF generated successfully: {filename}\n")
            sys.stderr.flush()
        except Exception as e:
            sys.stderr.write(f"Error building PDF: {str(e)}\n")
            sys.stderr.flush()
            raise
        
        # Return the absolute path as string
        return str(filename)
        
    except Exception as e:
        sys.stderr.write(f"Failed to generate PDF: {str(e)}\n")
        sys.stderr.flush()
        import traceback
        traceback.print_exc(file=sys.stderr)
        raise