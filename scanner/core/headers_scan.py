import requests

SECURITY_HEADERS = [
    "Content-Security-Policy",
    "X-Frame-Options",
    "X-Content-Type-Options",
    "Strict-Transport-Security",
    "Referrer-Policy",
    "Permissions-Policy",
    "Expect-CT"
]

WEAK_VALUES = {
    "X-Frame-Options": ["ALLOWALL", "ALLOW-FROM"],
    "X-Content-Type-Options": ["nosniff"],
    # Add more as needed
}

def scan_headers(target: str):
    results = {"missing": [], "weak": []}
    for scheme in ["http", "https"]:
        url = f"{scheme}://{target}"
        try:
            res = requests.get(url, timeout=5, verify=False)
            for header in SECURITY_HEADERS:
                if header not in res.headers:
                    results["missing"].append(header)
                else:
                    value = res.headers[header]
                    if header in WEAK_VALUES:
                        for weak in WEAK_VALUES[header]:
                            if weak.lower() in value.lower():
                                results["weak"].append((header, value))
        except Exception as e:
            continue
    results["score"] = len(SECURITY_HEADERS) - len(results["missing"])
    return results