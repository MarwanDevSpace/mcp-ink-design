"""
Unit tests for the Python Ink Verifier suite.
"""

import unittest
from python.ink_verifier.contrast import calculate_contrast_ratio
from python.ink_verifier.security_linter import SecurityLinter
from python.ink_verifier.visual_audit import VisualCraftAuditor

class TestInkVerifier(unittest.TestCase):
    def test_contrast_ratio_black_white(self):
        res = calculate_contrast_ratio("#ffffff", "#000000")
        self.assertEqual(res["ratio"], 21.0)
        self.assertTrue(res["wcag"]["normal_text_aaa"])
        self.assertEqual(res["wcag"]["grade"], "AAA")

    def test_contrast_ratio_low(self):
        res = calculate_contrast_ratio("#777777", "#888888")
        self.assertLess(res["ratio"], 3.0)
        self.assertFalse(res["wcag"]["normal_text_aa"])

    def test_security_linter_catches_eval_and_innerhtml(self):
        linter = SecurityLinter()
        bad_code = """
        const data = getUserInput();
        element.innerHTML = data;
        eval("console.log('injected')");
        localStorage.setItem('token', 'xyz123');
        """
        report = linter.lint_content(bad_code)
        self.assertFalse(report["passed"])
        self.assertGreaterEqual(report["total_findings"], 3)
        rule_ids = [f["rule_id"] for f in report["findings"]]
        self.assertIn("SEC-DOM-001", rule_ids)
        self.assertIn("SEC-DOM-002", rule_ids)
        self.assertIn("SEC-AUTH-001", rule_ids)

    def test_visual_craft_detects_ai_slop(self):
        auditor = VisualCraftAuditor()
        slop_code = """
        <div class="card" style="background: linear-gradient(135deg, #6366f1, #a855f7); font-size: 16px;">
          <div><div class="btn">Click me</div></div>
        </div>
        """
        audit_res = auditor.audit(slop_code)
        self.assertLess(audit_res["craft_score"], 70)
        penalty_factors = [p["factor"] for p in audit_res["penalties"]]
        self.assertIn("Cliche AI Gradient", penalty_factors)

    def test_visual_craft_rewards_high_craft(self):
        auditor = VisualCraftAuditor()
        high_craft = """
        <header><nav></nav></header>
        <main>
          <section style="color: oklch(0.95 0.02 240); font-size: clamp(1rem, 2vw, 2.5rem); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);">
          </section>
        </main>
        <footer></footer>
        """
        audit_res = auditor.audit(high_craft)
        self.assertGreaterEqual(audit_res["craft_score"], 85)
        self.assertIn("Masterpiece", audit_res["craft_grade"] + audit_res["craft_grade"] if audit_res["craft_score"] >= 90 else audit_res["craft_grade"])

if __name__ == "__main__":
    unittest.main()
