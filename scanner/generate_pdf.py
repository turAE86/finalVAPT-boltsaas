# scanner/generate_pdf.py
import sys
import json
import os
from pathlib import Path

# Add the scanner directory to the path
scanner_dir = str(Path(__file__).parent.absolute())
sys.path.insert(0, scanner_dir)

from report_generator import generate_report

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: No scan data file provided", file=sys.stderr)
        sys.exit(1)
    
    temp_file = sys.argv[1]
    
    try:
        # Read scan data from temporary file
        if not os.path.exists(temp_file):
            raise FileNotFoundError(f"Temp file not found: {temp_file}")
            
        with open(temp_file, 'r') as f:
            scan_data = json.load(f)
        
        print(f"Loaded scan data, generating PDF...", file=sys.stderr)
        
        # Generate the PDF
        file_path = generate_report(scan_data)
        
        # Print the file path to stdout (this is what Node.js expects)
        print(file_path)
        
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in scan data: {str(e)}", file=sys.stderr)
        sys.exit(1)
    except FileNotFoundError as e:
        print(f"Error: File not found: {str(e)}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)