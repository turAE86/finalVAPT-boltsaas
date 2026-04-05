from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, 'VAPT Tool Security Report', 0, 1, 'C')

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

def generate_pdf(url, scan_data):
    pdf = PDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    
    # Title
    pdf.set_font("Arial", "B", 16)
    pdf.cell(200, 10, txt=f"Scan Results for: {url}", ln=1, align='L')
    pdf.ln(10)
    
    # Section 1: Headers
    pdf.set_text_color(200, 0, 0) # Red for Danger
    pdf.set_font("Arial", "B", 14)
    pdf.cell(200, 10, txt="1. Security Headers Issues", ln=1)
    pdf.set_text_color(0, 0, 0) # Back to Black
    pdf.set_font("Arial", size=12)
    
    for issue in scan_data.get('headers', []):
        pdf.cell(200, 10, txt=f"- {issue}", ln=1)
        
    pdf.ln(5)
    
    # Section 2: SQL Injection
    pdf.set_text_color(200, 0, 0)
    pdf.set_font("Arial", "B", 14)
    pdf.cell(200, 10, txt="2. SQL Injection Risks", ln=1)
    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Arial", size=12)
    
    if not scan_data.get('sqli'):
        pdf.cell(200, 10, txt="- No SQL Injection vulnerabilities detected.", ln=1)
    else:
        for issue in scan_data.get('sqli', []):
            pdf.multi_cell(0, 10, txt=f"- {issue}")

    pdf.ln(5)

    # Section 3: XSS
    pdf.set_text_color(200, 0, 0)
    pdf.set_font("Arial", "B", 14)
    pdf.cell(200, 10, txt="3. XSS Risks", ln=1)
    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Arial", size=12)
    
    if not scan_data.get('xss'):
        pdf.cell(200, 10, txt="- No XSS vulnerabilities detected.", ln=1)
    else:
        for issue in scan_data.get('xss', []):
            pdf.multi_cell(0, 10, txt=f"- {issue}")

    pdf.ln(5)

    # Section 4: Command Injection
    pdf.set_text_color(200, 0, 0)
    pdf.set_font("Arial", "B", 14)
    pdf.cell(200, 10, txt="4. Command Injection Risks", ln=1)
    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Arial", size=12)
    
    if not scan_data.get('command_injection'):
        pdf.cell(200, 10, txt="- No Command Injection vulnerabilities detected.", ln=1)
    else:
        for issue in scan_data.get('command_injection', []):
            pdf.multi_cell(0, 10, txt=f"- {issue}")

    pdf.ln(5)

    # Section 5: Directory Traversal
    pdf.set_text_color(200, 0, 0)
    pdf.set_font("Arial", "B", 14)
    pdf.cell(200, 10, txt="5. Directory Traversal Risks", ln=1)
    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Arial", size=12)
    
    if not scan_data.get('directory_traversal'):
        pdf.cell(200, 10, txt="- No Directory Traversal vulnerabilities detected.", ln=1)
    else:
        for issue in scan_data.get('directory_traversal', []):
            pdf.multi_cell(0, 10, txt=f"- {issue}")

    pdf.ln(5)

    # Section 6: Open Redirect
    pdf.set_text_color(200, 0, 0)
    pdf.set_font("Arial", "B", 14)
    pdf.cell(200, 10, txt="6. Open Redirect Risks", ln=1)
    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Arial", size=12)
    
    if not scan_data.get('open_redirect'):
        pdf.cell(200, 10, txt="- No Open Redirect vulnerabilities detected.", ln=1)
    else:
        for issue in scan_data.get('open_redirect', []):
            pdf.multi_cell(0, 10, txt=f"- {issue}")

    # Save
    filename = "report.pdf"
    pdf.output(filename)
    return filename
