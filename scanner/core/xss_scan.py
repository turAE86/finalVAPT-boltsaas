import requests

XSS_PAYLOAD = "<script>alert(1)</script>"

def scan_xss(target):
    url = f"http://{target}?q={XSS_PAYLOAD}"
    try:
        res = requests.get(url, timeout=5)
        if XSS_PAYLOAD in res.text:
            return {
                "vulnerable": True,
                "payload": XSS_PAYLOAD
            }
    except:
        pass

    return {
        "vulnerable": False
    }
