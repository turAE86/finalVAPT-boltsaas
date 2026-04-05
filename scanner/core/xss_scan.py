import requests
from urllib.parse import urlparse, urlunparse, parse_qs, urlencode

XSS_PAYLOADS = [
    "<script>alert(1)</script>",
    "\"><svg/onload=alert(1)>",
    "';alert(1);//",
    "<img src=x onerror=alert(1)>"
]

def scan_xss(target):
    results = []
    # Try both http and https
    for scheme in ["http", "https"]:
        for payload in XSS_PAYLOADS:
            # Try common parameters
            for param in ["q", "search", "s", "id"]:
                url = f"{scheme}://{target}?{param}={payload}"
                try:
                    res = requests.get(url, timeout=5, verify=False)
                    # Check if payload is reflected in body or in script tags
                    if payload in res.text:
                        context = "body"
                        if f"<script>{payload}</script>" in res.text:
                            context = "script"
                        results.append({
                            "url": url,
                            "payload": payload,
                            "context": context
                        })
                except Exception:
                    continue
    return {
        "vulnerable": bool(results),
        "details": results
    }