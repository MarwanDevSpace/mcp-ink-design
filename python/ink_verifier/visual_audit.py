"""
Visual Craft & Anti-AI-Slop Heuristic Auditor.
Scores web interfaces against human-grade craftsmanship principles vs generic AI tropes.
"""

import re
from typing import Dict, Any, List

class VisualCraftAuditor:
    def __init__(self):
        # Known generic AI gradient tropes
        self.ai_gradient_patterns = [
            r"linear-gradient\s*\([^)]*#6366f1[^)]*#a855f7[^)]*\)",
            r"linear-gradient\s*\([^)]*#3b82f6[^)]*#8b5cf6[^)]*\)",
            r"linear-gradient\s*\([^)]*#4f46e5[^)]*#7c3aed[^)]*\)",
            r"linear-gradient\s*\([^)]*rgb\(99,\s*102,\s*241\)[^)]*rgb\(168,\s*85,\s*247\)[^)]*\)"
        ]

    def audit(self, html_or_css: str) -> Dict[str, Any]:
        strengths: List[str] = []
        slop_penalties: List[Dict[str, Any]] = []
        score = 80 # Baseline starting score

        # 1. Anti-AI-Slop: Check for cliche AI purple/blue gradients
        for pattern in self.ai_gradient_patterns:
            if re.search(pattern, html_or_css, re.IGNORECASE):
                slop_penalties.append({
                    "factor": "Cliche AI Gradient",
                    "penalty": -20,
                    "reason": "Generic violet-to-indigo gradient (#6366f1/#a855f7) detected. Replace with bespoke OKLCH tonal scales or physical lighting."
                })
                score -= 20
                break

        # 2. Check for Modern OKLCH color space usage
        if "oklch(" in html_or_css:
            strengths.append("Uses modern OKLCH color space with uniform perceptual lightness.")
            score += 10

        # 3. Check for Fluid Typography (clamp)
        if re.search(r"font-size:\s*clamp\(", html_or_css):
            strengths.append("Fluid mathematical typography with clamp() detected.")
            score += 10
        elif re.search(r"font-size:\s*\d{2,}px", html_or_css):
            slop_penalties.append({
                "factor": "Rigid Fixed Font Sizes",
                "penalty": -10,
                "reason": "Fixed pixel typography detected without fluid responsive scaling."
            })
            score -= 10

        # 4. Check for Layered Ambient Occlusion Shadows
        if re.search(r"box-shadow:[^;]*,\s*[^;]*rgba", html_or_css):
            strengths.append("Multi-layered organic box-shadows detected.")
            score += 5

        # 5. Check for Semantic HTML5 Architecture
        semantic_tags = ["<header", "<nav", "<main", "<section", "<article", "<footer"]
        found_semantics = [tag for tag in semantic_tags if tag in html_or_css.lower()]
        if len(found_semantics) >= 3:
            strengths.append(f"Strong semantic HTML structure ({len(found_semantics)} standard tags).")
            score += 5
        elif "<div" in html_or_css.lower() and len(found_semantics) == 0:
            slop_penalties.append({
                "factor": "Div Soup / Lack of Semantics",
                "penalty": -15,
                "reason": "Exclusive div hierarchy detected without semantic HTML5 milestones."
            })
            score -= 15

        # 6. Check for Responsive Viewport Meta
        if "viewport" in html_or_css and "width=device-width" in html_or_css:
            strengths.append("Standard responsive viewport configuration present.")

        # 7. Check for Micro-interaction curves
        if "cubic-bezier" in html_or_css:
            strengths.append("High-craft cubic-bezier micro-interaction physics.")
            score += 5

        final_score = max(0, min(100, score))
        grade = "S (Masterpiece)" if final_score >= 90 else (
            "A (High Craft)" if final_score >= 75 else (
                "B (Acceptable)" if final_score >= 60 else "C (AI Slop Tendencies)"
            )
        )

        return {
            "craft_score": final_score,
            "craft_grade": grade,
            "strengths": strengths,
            "penalties": slop_penalties,
            "recommendations": [
                "Upgrade colors to OKLCH perceptual tokens with high chroma definition.",
                "Ensure fluid typography with clamp() for dynamic screen adaptations.",
                "Apply multi-layered shadows and micro-interaction spring transitions."
            ] if final_score < 85 else ["Design adheres to high-craft bespoke standards."]
        }
