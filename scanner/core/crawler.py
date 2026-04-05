import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import urllib3

# Suppress SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def discover_endpoints(base_url):
    endpoints = set()
    try:
        # Normalize to HTTP for DVWA/local testing.
        parsed = urlparse(base_url)
        if parsed.scheme != "http":
            base_url = urljoin(base_url, parsed._replace(scheme="http").geturl())

        # Use the DVWA root as the base for common fallback pages.
        dvwa_root = base_url.rstrip("/") + "/"
        if "/DVWA/" in parsed.path or "dvwa" in base_url.lower():
            dvwa_root = f"{parsed.scheme or 'http'}://{parsed.netloc}/DVWA/"

        res = requests.get(base_url, timeout=10, verify=False)
        soup = BeautifulSoup(res.text, "html.parser")
        # Add all links
        for a in soup.find_all("a", href=True):
            href = a['href']
            # Only add internal links
            if href.startswith('/'):
                endpoints.add(urljoin(base_url, href))
        # Add all form actions
        for form in soup.find_all("form", action=True):
            action = form['action']
            if action.startswith('/'):
                endpoints.add(urljoin(base_url, action))
        # Always include the base URL itself
        endpoints.add(base_url)

        # DVWA-friendly fallbacks for common vulnerability pages
        if "/DVWA/" in base_url or "dvwa" in base_url.lower():
            dvwa_paths = [
                "vulnerabilities/sqli/",
                "vulnerabilities/xss_r/",
                "vulnerabilities/fi/",
                "vulnerabilities/exec/",
                "vulnerabilities/open_redirect/",
                "vulnerabilities/ssrf/",
            ]
            for path in dvwa_paths:
                endpoints.add(urljoin(dvwa_root, path))
    except Exception as e:
        print(f"Error crawling {base_url}: {e}")
    return list(endpoints)