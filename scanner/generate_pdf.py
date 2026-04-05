import sys
import os
import json
import traceback
from pathlib import Path

# Add the scanner directory to the path
scanner_dir = str(Path(__file__).parent.absolute())
sys.path.insert(0, scanner_dir)

from report_generator import generate_report

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: No scan data file provided", file=sys.stderr)
        sys.exit(1)
    
    temp_file = sys.argv[1]
    
    try:
        # Read scan data from temporary file
        if not os.path.exists(temp_file):
            print(f"Error: File does not exist: {temp_file}", file=sys.stderr)
            sys.exit(1)
        
        with open(temp_file, 'r') as f:
            scan_data = json.load(f)
        
        print(f"Loaded scan data, generating PDF...", file=sys.stderr)
        
        # --- PROCESS FINDINGS ---
        # Handle both flat findings list and grouped findings structure
        existing_findings = scan_data.get("findings", [])
        findings = []
        
        # Mapping for vulnerability types to OWASP
        owasp_mapping = {
            "XSS": "A03:2021 – Injection",
            "Cross-Site Scripting": "A03:2021 – Injection",
            "SQLI": "A03:2021 – Injection",
            "SQL Injection": "A03:2021 – Injection",
            "Directory Traversal": "A01:2021 – Broken Access Control",
            "Command Injection": "A03:2021 – Injection",
            "Open Redirect": "A03:2021 – Injection",
            "SSRF": "A10:2021 – Server-Side Request Forgery (SSRF)",
        }
        
        severity_mapping = {
            "XSS": "HIGH",
            "Cross-Site Scripting": "HIGH",
            "SQLI": "CRITICAL",
            "SQL Injection": "CRITICAL",
            "Directory Traversal": "HIGH",
            "Command Injection": "CRITICAL",
            "Open Redirect": "MEDIUM",
            "SSRF": "HIGH",
        }
        
        # If findings is a list (flat structure from engine.py)
        if isinstance(existing_findings, list):
            for item in existing_findings:
                if isinstance(item, dict):
                    vuln_type = item.get("type", "Unknown Vulnerability")
                    severity = item.get("severity") or severity_mapping.get(vuln_type, "MEDIUM")
                    
                    finding = {
                        "type": vuln_type,
                        "severity": severity,
                        "description": item.get("description") or f"{vuln_type} vulnerability found",
                        "evidence": item.get("evidence") or [item.get("payload", "N/A")],
                        "owasp": item.get("owasp") or owasp_mapping.get(vuln_type, "A03:2021 – Injection"),
                    }
                    
                    # Add details if available
                    if item.get("url") or item.get("param") or item.get("payload"):
                        finding["details"] = [{
                            "URL": item.get("url", "N/A"),
                            "Parameter": item.get("param", "N/A"),
                            "Payload": item.get("payload", "N/A")
                        }]
                    
                    findings.append(finding)
        
        scan_data["findings"] = findings

        # Generate the PDF
        file_path = generate_report(scan_data)
        
        # Print the file path to stdout (this is what Node.js expects)
        print(file_path)
        
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in scan data: {str(e)}", file=sys.stderr)
        sys.exit(1)
    except FileNotFoundError as e:
        print(f"Error: File not found: {str(e)}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)