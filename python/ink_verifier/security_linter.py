"""
Static Security Linter for HTML, CSS, JavaScript and Fullstack configs.
Checks for OWASP Top 10 client-side vulnerabilities, DOM XSS, and security headers.
"""

import re
from typing import List, Dict, Any

class SecurityLinter:
    def __init__(self):
        self.rules = [
            {
                "id": "SEC-DOM-001",
                "severity": "HIGH",
                "pattern": r"(?:\.innerHTML|\.outerHTML)\s*=\s*(?!['\"][^'\"]*['\"])",
                "message": "Direct assignment to innerHTML/outerHTML with potential user input risks DOM XSS. Use textContent or DOMPurify.sanitize().",
                "category": "DOM XSS"
            },
            {
                "id": "SEC-DOM-002",
                "severity": "CRITICAL",
                "pattern": r"\b(?:eval|Function)\s*\(",
                "message": "Use of eval() or new Function() allows arbitrary code execution. Refactor with safe parser.",
                "category": "Code Injection"
            },
            {
                "id": "SEC-DOM-003",
                "severity": "HIGH",
                "pattern": r"document\.write\s*\(",
                "message": "document.write is strongly discouraged and prone to XSS attacks.",
                "category": "DOM XSS"
            },
            {
                "id": "SEC-HTML-001",
                "severity": "MEDIUM",
                "pattern": r"<a\b[^>]*\btarget=[\"']_blank[\"'](?![^>]*\brel=[\"'][^\"']*noopener)[^>]*>",
                "message": "target='_blank' links must include rel='noopener noreferrer' to prevent reverse tabnabbing.",
                "category": "Link Target Hijacking"
            },
            {
                "id": "SEC-NET-001",
                "severity": "HIGH",
                "pattern": r"http://[a-zA-Z0-9\-\.]+(?:\:[0-9]+)?/",
                "message": "Insecure HTTP scheme detected. Modern web standards require TLS (HTTPS) to prevent MitM attacks.",
                "category": "Transport Security"
            },
            {
                "id": "SEC-SECRET-001",
                "severity": "CRITICAL",
                "pattern": r"(?:api[_-]?key|secret[_-]?key|password|jwt_secret|bearer\s+[a-zA-Z0-9\-\._~+/=]{20,})\s*[:=]\s*['\"][^'\"]{6,}['\"]",
                "message": "Potential hardcoded secret or token detected in client-side code.",
                "category": "Secret Leakage"
            },
            {
                "id": "SEC-AUTH-001",
                "severity": "MEDIUM",
                "pattern": r"localStorage\.setItem\s*\(\s*['\"](?:token|jwt|access_token|refresh_token|auth)['\"]",
                "message": "Storing raw authentication tokens in localStorage exposes them to XSS exfiltration. Prefer HttpOnly SameSite cookies.",
                "category": "Authentication Storage"
            }
        ]

    def lint_content(self, content: str, filename: str = "snippet") -> Dict[str, Any]:
        findings: List[Dict[str, Any]] = []
        lines = content.splitlines()

        for rule in self.rules:
            pattern = re.compile(rule["pattern"], re.IGNORECASE)
            for idx, line in enumerate(lines, start=1):
                match = pattern.search(line)
                if match:
                    findings.append({
                        "rule_id": rule["id"],
                        "severity": rule["severity"],
                        "category": rule["category"],
                        "message": rule["message"],
                        "file": filename,
                        "line": idx,
                        "snippet": line.strip()[:100]
                    })

        severity_counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}
        for f in findings:
            sev = f["severity"]
            severity_counts[sev] = severity_counts.get(sev, 0) + 1

        is_passed = (severity_counts["CRITICAL"] == 0 and severity_counts["HIGH"] == 0)

        return {
            "passed": is_passed,
            "total_findings": len(findings),
            "severity_summary": severity_counts,
            "findings": findings
        }
