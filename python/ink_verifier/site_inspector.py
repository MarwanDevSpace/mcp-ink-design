"""
Website Design Style Reverse-Engineering & Inspection Engine.
Deconstructs third-party sites or code to extract color palettes, fonts, shadows, and layout DNA.
"""

import re
import urllib.request
import urllib.parse
from typing import Dict, Any, List, Set

class SiteStyleInspector:
    def fetch_url_content(self, url: str, timeout: int = 10) -> str:
        """Safely fetches HTML content from an external URL."""
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,text/css"
            }
        )
        with urllib.request.urlopen(req, timeout=timeout) as response:
            charset = response.headers.get_content_charset() or "utf-8"
            return response.read().decode(charset, errors="ignore")

    def inspect_content(self, content: str, source_label: str = "inline") -> Dict[str, Any]:
        """Extracts design primitives from HTML/CSS content."""
        # 1. Extract Colors
        hex_colors: Set[str] = set(re.findall(r"#(?:[0-9a-fA-F]{3}){1,2}\b", content))
        rgb_colors: Set[str] = set(re.findall(r"rgba?\s*\([^)]+\)", content))
        oklch_colors: Set[str] = set(re.findall(r"oklch\s*\([^)]+\)", content))

        all_colors = sorted(list(hex_colors))[:12]

        # 2. Extract Fonts
        font_matches = re.findall(r"font-family\s*:\s*([^;]+);", content, re.IGNORECASE)
        fonts_found: Set[str] = set()
        for f in font_matches:
            for part in f.split(","):
                cleaned = part.strip().strip("'\"")
                if cleaned and cleaned.lower() not in ["sans-serif", "serif", "monospace", "inherit"]:
                    fonts_found.add(cleaned)

        # 3. Extract Border Radius & Shadows
        radii = set(re.findall(r"border-radius\s*:\s*([^;]+);", content, re.IGNORECASE))
        shadows = set(re.findall(r"box-shadow\s*:\s*([^;]+);", content, re.IGNORECASE))

        # 4. Infer Design Archetype
        is_dark_theme = bool(re.search(r"background(?:-color)?\s*:\s*(?:#0[0-9a-fA-F]{2,5}|#1[0-9a-fA-F]{2,5}|rgb\([0-2][0-9],\s*[0-2][0-9])", content))
        has_glass = "backdrop-filter" in content or "blur(" in content
        has_arabic = bool(re.search(r"[\u0600-\u06FF]", content))

        archetype = "Luxury Dark" if is_dark_theme and has_glass else (
            "Modern Editorial" if not is_dark_theme else "Cyber Tactile"
        )

        return {
            "source": source_label,
            "inferredArchetype": archetype,
            "hasGlassmorphism": has_glass,
            "hasArabicSupport": has_arabic,
            "extractedPalette": {
                "hexColors": all_colors,
                "rgbColors": list(rgb_colors)[:6],
                "oklchColors": list(oklch_colors)[:6],
                "totalColorsDetected": len(hex_colors) + len(rgb_colors) + len(oklch_colors)
            },
            "extractedTypography": {
                "fontFamilies": sorted(list(fonts_found))[:8],
                "usesFluidClamp": "clamp(" in content
            },
            "extractedTactileElements": {
                "shadowStyles": list(shadows)[:4],
                "borderRadiusValues": list(radii)[:4]
            },
            "inkUpgradeRecommendation": {
                "action": "Upgrade extracted colors to perceptual OKLCH tokens",
                "recommendedTokens": [
                    f"--ink-bg-surface: oklch(0.12 0.015 220);",
                    f"--ink-accent-primary: oklch(0.68 0.16 200);",
                    f"--ink-text-primary: oklch(0.96 0.01 220);"
                ]
            }
        }

    def inspect_url_or_code(self, target: str) -> Dict[str, Any]:
        if target.startswith("http://") or target.startswith("https://"):
            try:
                html = self.fetch_url_content(target)
                return self.inspect_content(html, target)
            except Exception as e:
                return {
                    "source": target,
                    "error": f"Failed to fetch remote URL: {e}",
                    "status": "failed"
                }
        else:
            return self.inspect_content(target, "code_snippet")
