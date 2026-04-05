#!/usr/bin/env python3
"""
Quick test script to verify PDF generation works
Run this to test if the PDF generation pipeline is working correctly
"""

import sys
import json
import os
from pathlib import Path

# Add scanner directory to path
scanner_dir = str(Path(__file__).parent / "scanner")
sys.path.insert(0, scanner_dir)

from report_generator import generate_report

def test_pdf_generation():
    """Test PDF generation with sample data"""
    
    print("=" * 60)
    print("VAPT Scanner - PDF Generation Test")
    print("=" * 60)
    
    # Create sample scan data with vulnerabilities
    scan_data = {
        "target": "http://localhost/DVWA/vulnerabilities/sqli/",
        "createdAt": "2026-04-05 19:45:30",
        "open_ports": [80, 443],
        "findings": [
            {
                "type": "SQLI",
                "severity": "CRITICAL",
                "url": "http://localhost/DVWA/vulnerabilities/sqli/?id=1",
                "param": "id",
                "payload": "' OR '1'='1",
                "description": "SQL Injection vulnerability detected in ID parameter",
                "evidence": ["' OR '1'='1"],
                "owasp": "A03:2021 – Injection"
            },
            {
                "type": "XSS",
                "severity": "HIGH",
                "url": "http://localhost/DVWA/vulnerabilities/xss_r/?name=test",
                "param": "name",
                "payload": "<script>alert(1)</script>",
                "description": "Reflected XSS vulnerability detected",
                "evidence": ["<script>alert(1)</script>"],
                "owasp": "A03:2021 – Injection",
                "details": [{"URL": "http://localhost/DVWA/vulnerabilities/xss_r/?name=test", "Parameter": "name", "Payload": "<script>alert(1)</script>"}]
            }
        ]
    }
    
    print("\n✓ Sample scan data created")
    print(f"  - Target: {scan_data['target']}")
    print(f"  - Open Ports: {scan_data['open_ports']}")
    print(f"  - Findings: {len(scan_data['findings'])}")
    
    try:
        print("\n→ Generating PDF report...")
        file_path = generate_report(scan_data)
        
        print(f"\n✓ PDF Generated Successfully!")
        print(f"  - Path: {file_path}")
        
        # Check if file exists and get size
        if os.path.exists(file_path):
            file_size = os.path.getsize(file_path)
            print(f"  - Size: {file_size:,} bytes")
            
            if file_size > 10000:  # Decent PDF should be at least 10KB
                print(f"\n✓ PDF appears valid (size > 10KB)")
                print("\n" + "=" * 60)
                print("SUCCESS: PDF generation is working correctly!")
                print("=" * 60)
                return True
            else:
                print(f"\n✗ WARNING: PDF is suspiciously small ({file_size} bytes)")
                return False
        else:
            print(f"\n✗ ERROR: Generated file does not exist!")
            return False
            
    except Exception as e:
        print(f"\n✗ ERROR: PDF generation failed!")
        print(f"  - Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_sample_scan_data():
    """Test with minimal data"""
    print("\n" + "=" * 60)
    print("Testing with Open Ports Only")
    print("=" * 60)
    
    scan_data = {
        "target": "http://localhost",
        "createdAt": "2026-04-05 19:45:30",
        "open_ports": [80, 443],
        "findings": []
    }
    
    try:
        print("\n→ Generating PDF with no findings...")
        file_path = generate_report(scan_data)
        
        if os.path.exists(file_path):
            file_size = os.path.getsize(file_path)
            print(f"✓ PDF Generated: {file_path} ({file_size:,} bytes)")
            return True
        else:
            print(f"✗ File not generated")
            return False
    except Exception as e:
        print(f"✗ Error: {str(e)}")
        return False

if __name__ == "__main__":
    success1 = test_pdf_generation()
    success2 = test_sample_scan_data()
    
    print("\n" + "=" * 60)
    if success1 and success2:
        print("✓ All tests passed!")
        sys.exit(0)
    else:
        print("✗ Some tests failed")
        sys.exit(1)
