import sys
import json
from report_generator import generate_report

if __name__ == "__main__":
    scan_data = json.loads(sys.argv[1])
    file_path = generate_report(scan_data)
    print(file_path)
