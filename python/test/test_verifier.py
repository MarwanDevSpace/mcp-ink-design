"""
Unit tests for the Python Ink Verifier suite.
"""

import unittest
from python.ink_verifier.contrast import calculate_contrast_ratio
from python.ink_verifier.security_linter import SecurityLinter
from python.ink_verifier.visual_audit import VisualCraftAuditor
from python.ink_verifier.bidi_linter import BidiAlignmentAuditor
from python.ink_verifier.site_inspector import SiteStyleInspector
from python.ink_verifier.viewport_capture import capture_all_viewports

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

    def test_bidi_linter_detects_physical_properties(self):
        auditor = BidiAlignmentAuditor()
        bad_css = """
        .card {
            margin-left: 20px;
            padding-right: 15px;
            text-align: left;
        }
        """
        res = auditor.audit(bad_css)
        self.assertGreaterEqual(res["total_findings"], 3)
        categories = [f["category"] for f in res["findings"]]
        self.assertIn("Non-Logical CSS Property", categories)

    def test_bidi_linter_approves_logical_arabic_css(self):
        auditor = BidiAlignmentAuditor()
        clean_arabic = """
        body {
            font-family: 'IBM Plex Sans Arabic', sans-serif;
            margin-inline: auto;
            padding-inline-start: 1.5rem;
            text-align: start;
        }
        """
        res = auditor.audit(clean_arabic)
        self.assertGreaterEqual(res["bidi_score"], 85)
        self.assertIn("S", [res["grade"], "A"])

    def test_site_inspector_extracts_palette_and_fonts(self):
        inspector = SiteStyleInspector()
        snippet = """
        <style>
          :root { --bg: #0b0f19; --accent: #38bdf8; }
          body { font-family: 'Cairo', 'Outfit', sans-serif; font-size: clamp(1rem, 2vw, 1.5rem); }
          .card { backdrop-filter: blur(12px); border-radius: 16px; }
        </style>
        """
        extracted = inspector.inspect_content(snippet)
        self.assertIn("#0b0f19", extracted["extractedPalette"]["hexColors"])
        self.assertIn("#38bdf8", extracted["extractedPalette"]["hexColors"])
        self.assertTrue(extracted["hasGlassmorphism"])
        self.assertTrue(extracted["extractedTypography"]["usesFluidClamp"])

    def test_viewport_capture_generates_all_three_aspects(self):
        html = "<html><body style='background:#0b0f19;color:#fff;'><h1>Ink Viewport Test</h1></body></html>"
        res = capture_all_viewports(html, title="Test Spec")
        self.assertEqual(len(res["snapshots"]), 3)
        ids = [s["viewport_id"] for s in res["snapshots"]]
        self.assertIn("desktop_16_9", ids)
        self.assertIn("vertical_9_16", ids)
        self.assertIn("mobile_view", ids)
        self.assertTrue(res["viewportQualityChecks"]["allThreeViewportsGenerated"])

if __name__ == "__main__":
    unittest.main()

