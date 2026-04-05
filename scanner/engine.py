import sys
import json
import socket

from scanner.core.headers_scan import scan_headers
from scanner.core.xss_scan import scan_xss
from scanner.core.sqli_scan import scan_sqli
from scanner.core.directory_traversal_scan import scan_directory_traversal
from scanner.core.command_injection_scan import scan_command_injection
from scanner.core.open_redirect_scan import scan_open_redirect
from scanner.core.ssrf_scan import scan_ssrf

def port_scan(target):
    open_ports = []
    for port in [80, 443]:
        try:
            sock = socket.create_connection((target, port), timeout=2)
            open_ports.append(port)
            sock.close()
        except:
            pass
    return open_ports

def run_scan(target):
    try:
        ports = port_scan(target)
        headers = scan_headers(target)
        xss = scan_xss(target)
        sqli = scan_sqli(target)
        dirtrav = scan_directory_traversal(target)
        cmdinj = scan_command_injection(target)
        openredir = scan_open_redirect(target)
        ssrf = scan_ssrf(target)

        return {
            "open_ports": ports,
            "headers": headers,
            "xss": xss,
            "sqli": sqli,
            "directory_traversal": dirtrav,
            "command_injection": cmdinj,
            "open_redirect": openredir,
            "ssrf": ssrf
        }
    except Exception as e:
        return {
            "error": str(e)
        }

if __name__ == "__main__":
    try:
        target = sys.argv[1]
        result = run_scan(target)
        print(json.dumps(result))
    except Exception as e:
        # GUARANTEED JSON output
        print(json.dumps({ "fatal_error": str(e) }))