# Quick Testing Guide for VAPT Scanner

## Prerequisites
1. **DVWA is running** at `http://localhost/DVWA/`
2. **DVWA Security Level is set to "Low"** (Login to DVWA → DVWA Security Level → Select "Low")
3. **Backend server is running** (`npm run dev` in the backend folder)
4. **You're logged in** to the VAPT scanner web interface

## Test Vulnerability URLs

### ✅ SQL Injection - CRITICAL
**URL to Scan:**
```
http://localhost/DVWA/vulnerabilities/sqli/
```

**Expected Result:**
- Scanner detects SQL Injection
- Severity: CRITICAL
- Evidence: `' OR '1'='1` or similar payloads

**How to verify in DVWA:**
1. Go to `http://localhost/DVWA/vulnerabilities/sqli/`
2. Try `1' OR '1'='1` in the User ID field
3. You should see all database records (vulnerable)

---

### ✅ XSS (Reflected) - HIGH
**URL to Scan:**
```
http://localhost/DVWA/vulnerabilities/xss_r/
```

**Expected Result:**
- Scanner detects XSS
- Severity: HIGH
- Evidence: `<script>alert(1)</script>` or similar payloads

**How to verify in DVWA:**
1. Go to `http://localhost/DVWA/vulnerabilities/xss_r/`
2. Try `<script>alert(1)</script>` in the Name field
3. You should see an alert popup (vulnerable)

---

### ✅ File Inclusion (Directory Traversal) - HIGH
**URL to Scan:**
```
http://localhost/DVWA/vulnerabilities/fi/
```

**Expected Result:**
- Scanner detects Directory Traversal
- Severity: HIGH
- Evidence: `../../../../etc/passwd` or similar payloads

**How to verify in DVWA:**
1. Go to `http://localhost/DVWA/vulnerabilities/fi/`
2. Select "include.php" from dropdown
3. Try `../../../../etc/passwd` in the text field
4. You should see file contents (vulnerable)

---

### ✅ Command Execution (Command Injection) - CRITICAL
**URL to Scan:**
```
http://localhost/DVWA/vulnerabilities/exec/
```

**Expected Result:**
- Scanner detects Command Injection
- Severity: CRITICAL
- Evidence: `; sleep 3;` or similar payloads

**How to verify in DVWA:**
1. Go to `http://localhost/DVWA/vulnerabilities/exec/`
2. Try `127.0.0.1; sleep 5` in the IP field
3. Response should be delayed by ~5 seconds (vulnerable)

---

### ⚠️ Open Redirect - MEDIUM
**URL to Scan:**
```
http://localhost/DVWA/vulnerabilities/view_source.php?page=open_redirect.php
```
OR check if there's a redirect vulnerability page in your DVWA version.

**Note:** Not all DVWA versions have this. Check your DVWA menu.

---

### ✅ SSRF - HIGH
**URL to Scan:**
```
http://localhost/DVWA/vulnerabilities/view_source.php?page=ssrf.php
```

**Note:** Check if your DVWA installation has SSRF. It may be under Community Edition.

---

## Steps to Test the Scanner

### Step 1: Run a Scan
1. Open `http://localhost:5173` (your frontend)
2. Go to Scanner
3. Paste the vulnerable URL: 
   ```
   http://localhost/DVWA/vulnerabilities/sqli/
   ```
4. Click "Start New Scan"
5. Wait for scan to complete

### Step 2: View Results
- You should see vulnerabilities listed
- Click on each vulnerability to see details

### Step 3: Download Report
- Click "Download Report" button
- A PDF should be generated with:
  - Executive Summary with pie chart
  - Detailed findings table
  - OWASP references
  - Evidence and payloads

### Step 4: Troubleshooting

**If scan shows "0 findings":**
- Check DVWA is running: `http://localhost/DVWA/`
- Check Security Level is "Low"
- Try scanning a direct vulnerable URL with parameters

**If PDF download fails:**
1. Check backend console for errors
2. Run this test command:
   ```bash
   cd c:\Users\navin\OneDrive\Desktop\vapt-bolt
   python scanner/engine.py http://localhost/DVWA/vulnerabilities/sqli/
   ```
3. Check if Python output shows vulnerabilities

---

## Manual Test from Command Line

### Test 1: SQL Injection
```bash
cd c:\Users\navin\OneDrive\Desktop\vapt-bolt
python scanner/engine.py http://localhost/DVWA/vulnerabilities/sqli/
```
**Expected output:** Should find SQLi vulnerability

### Test 2: XSS
```bash
python scanner/engine.py http://localhost/DVWA/vulnerabilities/xss_r/
```
**Expected output:** Should find XSS vulnerability

### Test 3: All Vulnerabilities
```bash
python scanner/engine.py http://localhost/DVWA/vulnerabilities/
```
**Expected output:** Should find 1-3 vulnerabilities depending on DVWA endpoints

---

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "0 findings" | Endpoints have no parameters to test | Scan with direct vulnerable endpoints, ensure DVWA Security Level is "Low" |
| PDF download fails | Empty findings or missing data | Check scanner found vulnerabilities, check backend logs |
| Scanner timeout | Slow network/system | Increase timeout in scannerService.js (line 16) |
| "Cannot connect to target" | DVWA not running | Start DVWA, verify it's at `http://localhost/DVWA/` |

---

## Files Modified for PDF Generation

✅ **Backend:** `backend/src/services/reportService.js`
✅ **Backend:** `backend/src/controllers/reportController.js`
✅ **Backend:** `backend/src/services/owaspMapper.js`
✅ **Scanner:** `scanner/generate_pdf.py`
✅ **Scanner:** `scanner/report_generator.py`
✅ **Scanner Modules:** All scan_*.py files now include `url` field

All fixes ensure the PDF contains:
- Scan metadata (target, date, report ID)
- Severity distribution chart
- All vulnerabilities with details
- OWASP references
- Evidence/payloads
- Professional footer with page numbers

