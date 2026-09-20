"""
CLI Interface for Ink Verifier Python Engine.
Invoked by Node.js MCP tools or run standalone.
"""

import sys
import json
import argparse
from typing import Dict, Any

from .contrast import calculate_contrast_ratio
from .security_linter import SecurityLinter
from .visual_audit import VisualCraftAuditor
from .viewport_capture import capture_all_viewports
from .bidi_linter import BidiAlignmentAuditor
from .site_inspector import SiteStyleInspector

def run_suite(action: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    result: Dict[str, Any] = {"action": action, "status": "success"}

    if action == "contrast":
        c1 = payload.get("foreground", "#ffffff")
        c2 = payload.get("background", "#000000")
        result["data"] = calculate_contrast_ratio(c1, c2)

    elif action == "security":
        code = payload.get("code", "")
        filename = payload.get("filename", "input_snippet")
        linter = SecurityLinter()
        result["data"] = linter.lint_content(code, filename)

    elif action == "audit" or action == "visual":
        code = payload.get("code", "")
        auditor = VisualCraftAuditor()
        result["data"] = auditor.audit(code)

    elif action == "bidi":
        code = payload.get("code", "")
        auditor = BidiAlignmentAuditor()
        result["data"] = auditor.audit(code)

    elif action == "inspect":
        target = payload.get("target") or payload.get("code") or payload.get("url") or ""
        inspector = SiteStyleInspector()
        result["data"] = inspector.inspect_url_or_code(target)

    elif action == "capture":
        html_or_url = payload.get("url") or payload.get("code") or payload.get("html") or "<h1>Ink Preview</h1>"
        out_dir = payload.get("output_dir")
        title = payload.get("title", "Site Snapshot")
        result["data"] = capture_all_viewports(html_or_url, out_dir, title)

    elif action == "full":
        code = payload.get("code", "")
        fg = payload.get("foreground", "#ffffff")
        bg = payload.get("background", "#0f172a")

        auditor = VisualCraftAuditor()
        linter = SecurityLinter()
        bidi = BidiAlignmentAuditor()

        result["data"] = {
            "visual_audit": auditor.audit(code),
            "security_lint": linter.lint_content(code, "full_audit"),
            "bidi_audit": bidi.audit(code),
            "contrast_check": calculate_contrast_ratio(fg, bg)
        }
    else:
        result["status"] = "error"
        result["message"] = f"Unknown action: {action}"

    return result

def main():
    parser = argparse.ArgumentParser(description="Ink Design Python Verifier CLI")
    parser.add_argument(
        "--action",
        choices=["contrast", "security", "visual", "audit", "full", "bidi", "inspect", "capture"],
        default="full"
    )
    parser.add_argument("--input-json", help="Direct JSON input payload", default=None)
    parser.add_argument("--file", help="Path to file to analyze", default=None)
    parser.add_argument("--code", help="Raw code string to analyze", default=None)
    parser.add_argument("--stdin", action="store_true", help="Read JSON payload from standard input")

    args = parser.parse_args()
    payload = {}

    if args.stdin or args.input_json == "-":
        try:
            stdin_data = sys.stdin.read()
            if stdin_data.strip():
                payload = json.loads(stdin_data)
        except Exception as e:
            sys.stderr.write(f"Invalid JSON from stdin: {e}\n")
            sys.exit(1)
    elif args.input_json:
        try:
            payload = json.loads(args.input_json)
        except Exception as e:
            sys.stderr.write(f"Invalid JSON input: {e}\n")
            sys.exit(1)
    elif args.file:
        try:
            with open(args.file, "r", encoding="utf-8") as f:
                payload["code"] = f.read()
                payload["filename"] = args.file
        except Exception as e:
            sys.stderr.write(f"Could not read file {args.file}: {e}\n")
            sys.exit(1)
    elif args.code:
        payload["code"] = args.code

    res = run_suite(args.action, payload)
    print(json.dumps(res, indent=2))

if __name__ == "__main__":
    main()
