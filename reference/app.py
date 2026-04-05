from flask import Flask, render_template, request, session, send_file
from scanner import run_scan  # Ensure your scanner.py function is named 'run_scan'
from reporter import generate_pdf

app = Flask(__name__)
app.secret_key = 'WebSentinelSecretKey'  # Required for session storage

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/scan', methods=['POST'])
def scan():
    # 1. Get URL
    url = request.form.get('url')
    if not url.startswith(('http://', 'https://')):
        url = 'http://' + url
    
    # 2. Run the Scan (Using the logic from scanner.py)
    scan_results = run_scan(url)
    
    # 3. SAVE DATA TO SESSION (Critical for PDF Download)
    session['url'] = url
    session['scan_results'] = scan_results
    
    # 4. CALCULATE HEALTH SCORE (The logic you were missing)
    # We count total issues and subtract from 100
    total_issues = len(scan_results.get('headers', [])) + \
                   len(scan_results.get('sqli', [])) + \
                   len(scan_results.get('xss', [])) + \
                   len(scan_results.get('command_injection', [])) + \
                   len(scan_results.get('directory_traversal', [])) + \
                   len(scan_results.get('open_redirect', []))
    
    # Deduct 10 points per bug. 
    # If 2 bugs found: 100 - 20 = 80.
    health_score = 100 - (total_issues * 10)
    
    # Ensure score doesn't go below 0
    if health_score < 0:
        health_score = 0
        
    # 5. Send data to the HTML page
    return render_template('result.html', 
                           url=url, 
                           results=scan_results, 
                           score=health_score)

@app.route('/download')
def download():
    # Retrieve the data we saved earlier
    scan_results = session.get('scan_results')
    url = session.get('url')
    
    if not scan_results:
        return "Error: No scan data found. Please run a scan first.", 400
        
    # Generate the PDF
    filename = generate_pdf(url, scan_results)
    
    return send_file(filename, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)