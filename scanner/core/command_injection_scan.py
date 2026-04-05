import requests
import urllib3
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
import time

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def scan_command_injection(target):
    results = []
    parsed = urlparse(target)
    params = parse_qs(parsed.query)

    # DVWA-friendly fallback for the Command Execution page.
    if not params and any(token in parsed.path.lower() for token in ["exec", "command"]):
        params = {"ip": ["127.0.0.1"]}
    
    if not params:
        return {"vulnerable": False, "details": []}
    
    payloads = [
        "; sleep 3;",
        "& ping -c 3 127.0.0.1 &",
        "| sleep 2",
        "`sleep 2`"
    ]
    
    for param_name in params:
        for payload in payloads:
            try:
                test_params = params.copy()
                test_params[param_name] = [payload]
                test_url = urlunparse((
                    "http", parsed.netloc, parsed.path,
                    parsed.params, urlencode(test_params, doseq=True), parsed.fragment
                ))
                
                start_time = time.time()
                res = requests.get(test_url, timeout=5, verify=False)
                elapsed = time.time() - start_time
                
                # Time-based detection: if response takes longer, command might have executed
                if elapsed > 2:
                    results.append({
                        "type": "COMMAND_INJECTION",
                        "severity": "CRITICAL",
                        "url": test_url,
                        "param": param_name,
                        "payload": payload,
                        "description": "Possible command injection detected via time delay"
                    })
            except requests.Timeout:
                results.append({
                    "type": "COMMAND_INJECTION",
                    "severity": "CRITICAL",
                    "url": test_url,
                    "param": param_name,
                    "payload": payload,
                    "description": "Possible command injection detected (request timeout)"
                })
            except Exception as e:
                pass
    
    return {"vulnerable": bool(results), "details": results}