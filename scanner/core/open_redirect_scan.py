import requests
from urllib.parse import urlparse, urlencode, urlunparse

def scan_open_redirect(target):
    results = []
    payloads = [
        "https://evil.com",
        "//evil.com",
        "/\\evil.com"
    ]
    for scheme in ["http", "https"]:
        for param in ["url", "redirect", "next", "dest"]:
            for payload in payloads:
                url = f"{scheme}://{target}?{param}={payload}"
                try:
                    res = requests.get(url, timeout=3, allow_redirects=False, verify=False)
                    # If the response is a redirect to our payload, it's vulnerable
                    location = res.headers.get("Location", "")
                    if payload in location:
                        results.append({
                            "url": url,
                            "param": param,
                            "payload": payload,
                            "evidence": f"Redirects to: {location}"
                        })
                except Exception:
                    continue
    return {
        "vulnerable": bool(results),
        "details": results
    }