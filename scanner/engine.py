import sys
import json
import socket
from pathlib import Path
from urllib.parse import urlparse

# Add current directory to path for relative imports
sys.path.insert(0, str(Path(__file__).parent))

from core.headers_scan import scan_headers
from core.xss_scan import scan_xss
from core.sqli_scan import scan_sqli
from core.directory_traversal_scan import scan_directory_traversal
from core.command_injection_scan import scan_command_injection
from core.open_redirect_scan import scan_open_redirect
from core.ssrf_scan import scan_ssrf
from core.crawler import discover_endpoints

def port_scan(target):
    open_ports = []
    # Extract hostname from URL
    parsed = urlparse(target if target.startswith("http") else f"http://{target}")
    hostname = parsed.hostname
    
    for port in [80, 443]:
        try:
            sock = socket.create_connection((hostname, port), timeout=2)
            open_ports.append(port)
            sock.close()
        except:
            pass
    return open_ports

def run_scan(target):
    findings = []
    
    try:
        base_url = f"http://{target}" if not target.startswith("http") else target
        print(f"[*] Discovering endpoints...", file=sys.stderr)
        endpoints = discover_endpoints(base_url)
        
        # Limit to first 20 endpoints to keep scans fast while preserving DVWA pages
        if len(endpoints) > 20:
            endpoints = endpoints[:20]
            print(f"[*] Found {len(endpoints)} endpoints (limiting to 20 for faster scan)", file=sys.stderr)
        else:
            print(f"[*] Found {len(endpoints)} endpoints", file=sys.stderr)
    except Exception as e:
        print(f"[-] Error discovering endpoints: {e}", file=sys.stderr)
        return {
            "open_ports": port_scan(target),
            "findings": [],
            "error": f"Failed to discover endpoints: {str(e)}"
        }

    # Scan headers
    print(f"[*] Scanning headers...", file=sys.stderr)
    try:
        headers = scan_headers(base_url)
        if headers.get("missing") or headers.get("weak"):
            findings.extend(headers.get("missing", []))
    except Exception as e:
        print(f"[-] Error scanning headers: {e}", file=sys.stderr)

    # Scan each endpoint
    print(f"[*] Scanning {len(endpoints)} endpoints for vulnerabilities...", file=sys.stderr)
    for idx, url in enumerate(endpoints):
        print(f"[*] Endpoint {idx+1}/{len(endpoints)}: {url}", file=sys.stderr)
        
        # Safely scan each vulnerability type
        scan_functions = [
            ("XSS", scan_xss),
            ("SQLI", scan_sqli),
            ("Directory Traversal", scan_directory_traversal),
            ("Command Injection", scan_command_injection),
            ("Open Redirect", scan_open_redirect),
            ("SSRF", scan_ssrf)
        ]
        
        for scan_name, scan_func in scan_functions:
            try:
                result = scan_func(url)
                if result and isinstance(result, dict):
                    findings.extend(result.get("details", []))
            except Exception as e:
                print(f"[-] {scan_name} scan error: {str(e)[:100]}", file=sys.stderr)
                continue

    print(f"[+] Scan complete. Found {len(findings)} vulnerabilities", file=sys.stderr)
    return {
        "open_ports": port_scan(target),
        "findings": findings
    }

if __name__ == "__main__":
    try:
        target = sys.argv[1]
        print(f"DEBUG: Scanning target: {target}", file=sys.stderr)
        result = run_scan(target)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({ "fatal_error": str(e) }))