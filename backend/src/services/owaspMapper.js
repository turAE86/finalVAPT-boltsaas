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

export const mapFindings = (results) => {
  const findings = [];

  if (results.open_ports?.length > 0) {
    findings.push({
      type: "OPEN_PORTS",
      ...owaspMap.OPEN_PORTS,
      evidence: results.open_ports
    });
  }

  if (!results.open_ports?.includes(443)) {
    findings.push({
      type: "NO_HTTPS",
      ...owaspMap.NO_HTTPS
    });
  }

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
