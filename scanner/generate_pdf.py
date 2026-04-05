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
        
        # --- AGGREGATE FINDINGS ---
        findings = []
        mapping = {
            "xss": "Cross-Site Scripting (XSS)",
            "sqli": "SQL Injection",
            "directory_traversal": "Directory Traversal",
            "command_injection": "Command Injection",
            "open_redirect": "Open Redirect",
            "ssrf": "SSRF",
        }
        default_severity = {
            "xss": "HIGH",
            "sqli": "CRITICAL",
            "directory_traversal": "HIGH",
            "command_injection": "CRITICAL",
            "open_redirect": "MEDIUM",
            "ssrf": "HIGH",
        }
        for key, label in mapping.items():
            data = scan_data.get(key)
            if not data:
                continue
            details = data.get("details") if isinstance(data, dict) else None
            if details:
                for item in details:
                    findings.append({
                        "type": label,
                        "severity": data.get("severity", default_severity.get(key, "MEDIUM")),
                        "description": item.get("evidence", str(item)),
                        "param": item.get("param", ""),
                        "payload": item.get("payload", ""),
                        "url": item.get("url", ""),
                    })
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