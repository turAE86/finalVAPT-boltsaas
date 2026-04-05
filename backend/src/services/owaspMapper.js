const owaspMap = {
  OPEN_PORTS: {
    owasp: "A05:2021 – Security Misconfiguration",
    severity: "MEDIUM",
    description: "Unnecessary open ports increase attack surface"
  },
  NO_HTTPS: {
    owasp: "A02:2021 – Cryptographic Failures",
    severity: "HIGH",
    description: "Target does not enforce HTTPS"
  }
};

const vulnTypeMap = {
  "XSS": { owasp: "A03:2021 – Injection", severity: "HIGH" },
  "SQLI": { owasp: "A03:2021 – Injection", severity: "CRITICAL" },
  "SQL Injection": { owasp: "A03:2021 – Injection", severity: "CRITICAL" },
  "Directory Traversal": { owasp: "A01:2021 – Broken Access Control", severity: "HIGH" },
  "Command Injection": { owasp: "A03:2021 – Injection", severity: "CRITICAL" },
  "Open Redirect": { owasp: "A03:2021 – Injection", severity: "MEDIUM" },
  "SSRF": { owasp: "A10:2021 – Server-Side Request Forgery (SSRF)", severity: "HIGH" },
  "DIRECTORY_TRAVERSAL": { owasp: "A01:2021 – Broken Access Control", severity: "HIGH" },
  "COMMAND_INJECTION": { owasp: "A03:2021 – Injection", severity: "CRITICAL" },
  "OPEN_REDIRECT": { owasp: "A03:2021 – Injection", severity: "MEDIUM" }
};

export const mapFindings = (results) => {
  const findings = [];

  // Handle open ports (legacy structure from engine.py)
  if (results.open_ports?.length > 0) {
    findings.push({
      type: "OPEN_PORTS",
      ...owaspMap.OPEN_PORTS,
      evidence: results.open_ports
    });
  }

  // Handle NO_HTTPS check
  if (!results.open_ports?.includes(443)) {
    findings.push({
      type: "NO_HTTPS",
      ...owaspMap.NO_HTTPS
    });
  }

  // Handle findings array from engine.py (flat structure)
  if (results.findings && Array.isArray(results.findings)) {
    for (const finding of results.findings) {
      if (typeof finding === 'object' && finding.type) {
        const vulnInfo = vulnTypeMap[finding.type] || {};
        findings.push({
          type: finding.type,
          owasp: finding.owasp || vulnInfo.owasp || "A03:2021 – Injection",
          severity: finding.severity || vulnInfo.severity || "MEDIUM",
          description: finding.description || `${finding.type} vulnerability detected`,
          evidence: finding.evidence || finding.payload || [],
          url: finding.url,
          param: finding.param
        });
      }
    }
  }

  // Handle legacy structured results
  if (results.headers?.missing_headers?.length > 0) {
    findings.push({
      type: "MISSING_SECURITY_HEADERS",
      owasp: "A05:2021 – Security Misconfiguration",
      severity: "MEDIUM",
      description: "Important HTTP security headers are missing",
      evidence: results.headers.missing_headers
    });
  }

  if (results.xss?.vulnerable) {
    findings.push({
      type: "XSS",
      owasp: "A03:2021 – Injection",
      severity: "HIGH",
      description: "Reflected XSS vulnerability detected",
      evidence: results.xss.payload
    });
  }

  if (results.sqli?.vulnerable) {
    findings.push({
      type: "SQLI",
      owasp: "A03:2021 – Injection",
      severity: "CRITICAL",
      description: "Possible SQL Injection vulnerability detected",
      evidence: results.sqli.payload
    });
  }

  return findings;
};
