import requests

SECURITY_HEADERS = [
    "Content-Security-Policy",
    "X-Frame-Options",
    "X-Content-Type-Options",
    "Strict-Transport-Security",
    "Referrer-Policy"
]

def scan_headers(target: str):
    url = f"http://{target}"
    missing = []

    try:
        res = requests.get(url, timeout=5)
        for header in SECURITY_HEADERS:
            if header not in res.headers:
                missing.append(header)
    except Exception as e:
        return {
            "error": str(e)
        }

    return {
        "missing_headers": missing,
        "score": len(SECURITY_HEADERS) - len(missing)
    }
