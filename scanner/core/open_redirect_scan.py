import requests
import urllib3
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def scan_open_redirect(url):
    results = []
    parsed = urlparse(url)
    params = parse_qs(parsed.query)

    # DVWA-friendly fallback for redirect-style pages.
    if not params and any(token in parsed.path.lower() for token in ["redirect", "open_redirect"]):
        params = {"redirect": ["http://example.com"]}
    
    if not params:
        return {"vulnerable": False, "details": []}
    
    redirect_payloads = [
        "http://evil.com",
        "https://attacker.com",
        "//evil.com",
        "http://google.com"
    ]
    
    for param_name in params:
        for payload in redirect_payloads:
            try:
                test_params = params.copy()
                test_params[param_name] = [payload]
                test_url = urlunparse((
                    "http", parsed.netloc, parsed.path,
                    parsed.params, urlencode(test_params, doseq=True), parsed.fragment
                ))
                
                res = requests.get(test_url, timeout=3, allow_redirects=False, verify=False)
                
                # Check if response contains redirect to our payload
                if res.status_code in [301, 302, 303, 307, 308]:
                    location = res.headers.get('Location', '')
                    if payload in location or 'evil.com' in location or 'attacker.com' in location:
                        results.append({
                            "type": "OPEN_REDIRECT",
                            "severity": "MEDIUM",
                            "url": test_url,
                            "param": param_name,
                            "payload": payload,
                            "description": "Open redirect vulnerability detected"
                        })
                        break
            except Exception as e:
                pass
    
    return {"vulnerable": bool(results), "details": results}