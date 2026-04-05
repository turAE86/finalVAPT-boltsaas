import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, parse_qs, urlencode, urlunparse

def get_params(url):
    """Extracts parameters from URL (e.g., ?id=1 returns {'id': ['1']})"""
    parsed = urlparse(url)
    return parse_qs(parsed.query)

def check_headers(url):
    issues = []
    print(f"[*] Checking Headers for {url}...")
    try:
        res = requests.get(url, timeout=5)
        headers = res.headers
        if 'X-Frame-Options' not in headers:
            issues.append("Missing X-Frame-Options (Clickjacking Risk)")
        if 'Strict-Transport-Security' not in headers:
            issues.append("Missing HSTS (Man-in-the-Middle Risk)")
        if 'X-Content-Type-Options' not in headers:
            issues.append("Missing X-Content-Type-Options (MIME Sniffing Risk)")
    except Exception as e:
        print(f"[!] Header check failed: {e}")
    return issues

def check_sql_injection(url):
    issues = []
    print(f"[*] Checking SQL Injection on {url}...")
    
    # Payload: A single quote usually breaks SQL queries
    payload = "'"
    errors = ["syntax error", "mysql", "warning: mysql", "unclosed quotation mark"]
    
    # 1. Test URL Parameters (e.g., ?id=1 becomes ?id=1')
    parsed = urlparse(url)
    params = parse_qs(parsed.query)
    
    if not params:
        print("   [!] No URL parameters found to test for SQLi.")
    
    for param in params.keys():
        # Create a copy of params and inject payload
        test_params = params.copy()
        test_params[param] = [payload] # Inject '
        
        # Rebuild URL
        query_string = urlencode(test_params, doseq=True)
        test_url = urlunparse((parsed.scheme, parsed.netloc, parsed.path, parsed.params, query_string, parsed.fragment))
        
        try:
            res = requests.get(test_url, timeout=5)
            # Check if page broke
            for error in errors:
                if error in res.text.lower():
                    print(f"   [+] SQL Vulnerability found in param: {param}")
                    issues.append(f"SQL Injection detected in parameter '{param}' at {test_url}")
                    break
        except:
            pass

    return issues

def check_xss(url):
    issues = []
    print(f"[*] Checking XSS on {url}...")
    
    # Payload: A harmless script
    payload = "<script>alert('VULN')</script>"
    
    # 1. Test URL Parameters
    parsed = urlparse(url)
    params = parse_qs(parsed.query)
    
    if not params:
        print("   [!] No URL parameters found to test for XSS.")

    for param in params.keys():
        test_params = params.copy()
        test_params[param] = [payload]
        
        query_string = urlencode(test_params, doseq=True)
        test_url = urlunparse((parsed.scheme, parsed.netloc, parsed.path, parsed.params, query_string, parsed.fragment))
        
        try:
            res = requests.get(test_url, timeout=5)
            # Check if payload came back in HTML
            if payload in res.text:
                print(f"   [+] XSS Vulnerability found in param: {param}")
                issues.append(f"Reflected XSS detected in parameter '{param}'")
        except:
            pass
            
    return issues

def check_command_injection(url):
    issues = []
    print(f"[*] Checking Command Injection on {url}...")
    
    # Payloads for different OS
    payloads = ['; ls', '&& dir']
    
    parsed = urlparse(url)
    params = parse_qs(parsed.query)
    
    if not params:
        print("   [!] No URL parameters found to test for Command Injection.")
        return issues

    for param in params.keys():
        for payload in payloads:
            test_params = params.copy()
            test_params[param] = [payload]
            
            query_string = urlencode(test_params, doseq=True)
            test_url = urlunparse((parsed.scheme, parsed.netloc, parsed.path, parsed.params, query_string, parsed.fragment))
            
            try:
                res = requests.get(test_url, timeout=5)
                # A simple check: look for file listing type output. This is highly indicative.
                if "total" in res.text.lower() or "directory of" in res.text.lower():
                    print(f"   [+] Command Injection Vulnerability found in param: {param}")
                    issues.append(f"Command Injection detected in parameter '{param}' with payload '{payload}'")
                    break # Move to next param
            except:
                pass
                
    return issues

def check_directory_traversal(url):
    issues = []
    print(f"[*] Checking Directory Traversal on {url}...")
    
    # Payloads for different OS
    payloads = ['../../../../etc/passwd', '..\\..\\..\\..\\boot.ini']
    
    parsed = urlparse(url)
    params = parse_qs(parsed.query)
    
    if not params:
        print("   [!] No URL parameters found to test for Directory Traversal.")
        return issues

    for param in params.keys():
        for payload in payloads:
            test_params = params.copy()
            test_params[param] = [payload]
            
            query_string = urlencode(test_params, doseq=True)
            test_url = urlunparse((parsed.scheme, parsed.netloc, parsed.path, parsed.params, query_string, parsed.fragment))
            
            try:
                res = requests.get(test_url, timeout=5)
                # Check for common file contents
                if "root:x:0:0" in res.text or "[boot loader]" in res.text:
                    print(f"   [+] Directory Traversal Vulnerability found in param: {param}")
                    issues.append(f"Directory Traversal detected in parameter '{param}'")
                    break # Move to next param
            except:
                pass
                
    return issues

def check_open_redirect(url):
    issues = []
    print(f"[*] Checking Open Redirect on {url}...")
    
    # Payload: A known external site
    payload = 'http://example.com'
    
    parsed = urlparse(url)
    params = parse_qs(parsed.query)
    
    if not params:
        print("   [!] No URL parameters found to test for Open Redirect.")
        return issues

    for param in params.keys():
        # This is a simplified check. A real-world scanner would need to handle various URL encodings and structures.
        # We are looking for parameters that might be a redirect target, e.g., 'next', 'url', 'redirect'
        if 'url' in param.lower() or 'redirect' in param.lower() or 'next' in param.lower():
            test_params = params.copy()
            test_params[param] = [payload]
            
            query_string = urlencode(test_params, doseq=True)
            test_url = urlunparse((parsed.scheme, parsed.netloc, parsed.path, parsed.params, query_string, parsed.fragment))
            
            try:
                res = requests.get(test_url, timeout=5, allow_redirects=False) # Important: Don't follow the redirect
                if 'Location' in res.headers and 'example.com' in res.headers['Location']:
                    print(f"   [+] Open Redirect Vulnerability found in param: {param}")
                    issues.append(f"Open Redirect detected in parameter '{param}'")
            except:
                pass
                
    return issues

def run_scan(url):
    results = {
        "headers": check_headers(url),
        "sqli": check_sql_injection(url),
        "xss": check_xss(url),
        "command_injection": check_command_injection(url),
        "directory_traversal": check_directory_traversal(url),
        "open_redirect": check_open_redirect(url)
    }
    return results