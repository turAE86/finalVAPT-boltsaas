import requests
import urllib3
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

XSS_PAYLOADS = [
    "<script>alert(1)</script>",
    "\"><svg/onload=alert(1)>",
    "';alert(1);//",
    "<img src=x onerror=alert(1)>"
]

def scan_xss(url):
    results = []
    parsed = urlparse(url)
    params = parse_qs(parsed.query)

    # DVWA-friendly fallback when the page has no query parameters.
    if not params and any(token in parsed.path.lower() for token in ["xss", "xss_r"]):
        params = {"name": ["test"]}
    
    if not params:
        return {"vulnerable": False, "details": []}
    
    for param_name in params:
        for payload in XSS_PAYLOADS:
            try:
                test_params = params.copy()
                test_params[param_name] = [payload]
                test_url = urlunparse((
                    "http", parsed.netloc, parsed.path,
                    parsed.params, urlencode(test_params, doseq=True), parsed.fragment
                ))
                
                res = requests.get(test_url, timeout=3, verify=False)
                # Check if payload is reflected in response
                if payload in res.text:
                    results.append({
                        "type": "XSS",
                        "severity": "HIGH",
                        "url": test_url,
                        "param": param_name,
                        "payload": payload,
                        "description": "Reflected XSS vulnerability detected"
                    })
                    break
            except Exception as e:
                pass
    
    return {"vulnerable": bool(results), "details": results}