"""
Bilingual (RTL/LTR) & Optical Alignment Auditor.
Audits CSS Logical Properties, Arabic typography scale, centering hygiene, and overflow leaks.
"""

import re
from typing import Dict, Any, List

class BidiAlignmentAuditor:
    def __init__(self):
        self.physical_css_rules = [
            {
                "property": "margin-left",
                "recommended": "margin-inline-start",
                "reason": "Hardcoded margin-left breaks RTL layout mirroring."
            },
            {
                "property": "margin-right",
                "recommended": "margin-inline-end",
                "reason": "Hardcoded margin-right breaks RTL layout mirroring."
            },
            {
                "property": "padding-left",
                "recommended": "padding-inline-start",
                "reason": "Hardcoded padding-left breaks RTL symmetry."
            },
            {
                "property": "padding-right",
                "recommended": "padding-inline-end",
                "reason": "Hardcoded padding-right breaks RTL symmetry."
            },
            {
                "property": "text-align:\\s*left",
                "recommended": "text-align: start",
                "reason": "text-align: left does not dynamically adapt between Arabic and English."
            }
        ]

    def audit(self, html_or_css: str) -> Dict[str, Any]:
        findings: List[Dict[str, Any]] = []
        strengths: List[str] = []
        score = 85

        # 1. Physical properties check
        for rule in self.physical_css_rules:
            matches = re.finditer(r"\b" + rule["property"], html_or_css, re.IGNORECASE)
            for m in matches:
                findings.append({
                    "category": "Non-Logical CSS Property",
                    "severity": "MEDIUM",
                    "matched": m.group(0),
                    "recommendation": f"Replace with '{rule['recommended']}'",
                    "reason": rule["reason"]
                })
                score -= 3

        # 2. Check for Modern CSS Logical Properties
        logical_props = ["margin-inline", "padding-inline", "inset-inline", "text-align: start", "border-inline"]
        found_logical = [p for p in logical_props if p in html_or_css]
        if found_logical:
            strengths.append(f"Uses modern CSS Logical Properties ({', '.join(found_logical)}).")
            score += 10

        # 3. Arabic Font Stack Check
        arabic_fonts = ["IBM Plex Sans Arabic", "Cairo", "Tajawal", "Readex Pro", "Amiri", "Almarai"]
        found_fonts = [f for f in arabic_fonts if f.lower() in html_or_css.lower()]
        if found_fonts:
            strengths.append(f"High-craft Arabic typography detected: {', '.join(found_fonts)}.")
            score += 5

        # 4. Optical Centering Hygiene
        # Penalize center-aligned long paragraphs
        if re.search(r"p\s*\{[^}]*text-align:\s*center", html_or_css, re.IGNORECASE):
            findings.append({
                "category": "Optical Centering",
                "severity": "LOW",
                "matched": "text-align: center on paragraph",
                "recommendation": "Use text-align: start for body copy; center-align only headings and single-line titles.",
                "reason": "Center-aligned body paragraphs degrade reading speed and look clumsy in both Arabic and English."
            })
            score -= 5

        # 5. Overflow-X Leak Check
        if re.search(r"width:\s*[4-9]\d\dpx", html_or_css) and not re.search(r"max-width:\s*100%", html_or_css):
            findings.append({
                "category": "Horizontal Overflow Risk",
                "severity": "HIGH",
                "matched": "Fixed pixel width >= 400px without max-width: 100%",
                "recommendation": "Use max-width: 100% or fluid clamp() to prevent horizontal mobile viewport scrollbars.",
                "reason": "Fixed widths larger than 390px cause horizontal layout breaking on mobile devices."
            })
            score -= 10

        # 6. Check for Bidi Isolation (<bdi> or unicode-bidi: isolate)
        has_arabic = bool(re.search(r"[\u0600-\u06FF]", html_or_css))
        has_latin = bool(re.search(r"[a-zA-Z]", html_or_css))
        if has_arabic and has_latin:
            if "<bdi" in html_or_css or "unicode-bidi" in html_or_css:
                strengths.append("Bilingual code-switching properly protected with bidi isolation.")
                score += 5
            else:
                findings.append({
                    "category": "Bidi Isolation",
                    "severity": "MEDIUM",
                    "matched": "Mixed Arabic and Latin text",
                    "recommendation": "Wrap embedded Latin terms/numbers in <bdi> or set unicode-bidi: isolate.",
                    "reason": "Prevents misplaced punctuation marks and inverted bidirectional layout flow."
                })
                score -= 5

        final_score = max(0, min(100, score))
        grade = "S" if final_score >= 90 else ("A" if final_score >= 75 else ("B" if final_score >= 60 else "C"))

        return {
            "bidi_score": final_score,
            "grade": grade,
            "hasArabicContent": has_arabic,
            "hasLatinContent": has_latin,
            "strengths": strengths,
            "total_findings": len(findings),
            "findings": findings
        }
