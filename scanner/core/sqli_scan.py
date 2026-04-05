import requests
import urllib3
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

SQLI_PAYLOADS = [
    "' OR '1'='1",
    "\" OR \"1\"=\"1",
    "' OR 1=1--",
]

def scan_sqli(target):
    results = []
    parsed = urlparse(target)
    params = parse_qs(parsed.query)

    # DVWA-friendly fallback for the classic SQLi page.
    if not params and any(token in parsed.path.lower() for token in ["sqli", "sql"]):
        params = {"id": ["1"]}
    
    if not params:
        return {"vulnerable": False, "details": []}
    
    for param_name in params:
        for payload in SQLI_PAYLOADS:
            try:
                test_params = params.copy()
                test_params[param_name] = [payload]
                test_url = urlunparse((
                    "http", parsed.netloc, parsed.path,
                    parsed.params, urlencode(test_params, doseq=True), parsed.fragment
                ))
                
                res = requests.get(test_url, timeout=3, verify=False)
                # Simple detection: if response code is 200, it might be vulnerable
                if res.status_code == 200 and len(res.text) > 100:
                    results.append({
                        "type": "SQLI",
                        "severity": "CRITICAL",
                        "url": test_url,
                        "param": param_name,
                        "payload": payload,
                        "description": "SQL Injection vulnerability detected"
                    })
            except Exception as e:
                pass
    
    return {"vulnerable": bool(results), "details": results}