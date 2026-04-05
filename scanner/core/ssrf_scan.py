import requests

def scan_ssrf(target):
    results = []
    # Use a public "canary" domain you control for real SSRF detection.
    # For demo, use a common internal IP.
    payloads = [
        "http://169.254.169.254",  # AWS metadata
        "http://localhost",
        "http://127.0.0.1"
    ]
    for scheme in ["http", "https"]:
        for param in ["url", "next", "dest", "redirect"]:
            for payload in payloads:
                url = f"{scheme}://{target}?{param}={payload}"
                try:
                    res = requests.get(url, timeout=3, verify=False)
                    # If the response contains metadata or local content, flag it
                    if "meta-data" in res.text or "localhost" in res.text or "127.0.0.1" in res.text:
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