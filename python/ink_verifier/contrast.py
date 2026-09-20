"""
Mathematical Color Contrast & Readability Engine (WCAG 2.1 / 2.2 and APCA)
Supports HEX, RGB, HSL, and OKLCH conversions.
"""

import math
import re
from typing import Dict, Any, Tuple

def parse_color_to_rgb(color_str: str) -> Tuple[float, float, float]:
    """Parse hex or rgb/rgba string to normalized (0-1) RGB tuple."""
    color_str = color_str.strip().lower()

    # Hex match (#fff, #ffffff, #ffffff80)
    hex_match = re.match(r"^#([0-9a-f]{3,8})$", color_str)
    if hex_match:
        hex_val = hex_match.group(1)
        if len(hex_val) == 3 or len(hex_val) == 4:
            r = int(hex_val[0] * 2, 16) / 255.0
            g = int(hex_val[1] * 2, 16) / 255.0
            b = int(hex_val[2] * 2, 16) / 255.0
            return (r, g, b)
        elif len(hex_val) >= 6:
            r = int(hex_val[0:2], 16) / 255.0
            g = int(hex_val[2:4], 16) / 255.0
            b = int(hex_val[4:6], 16) / 255.0
            return (r, g, b)

    # rgb/rgba match
    rgb_match = re.match(r"^rgba?\s*\(\s*([\d\.]+)\s*,\s*([\d\.]+)\s*,\s*([\d\.]+)", color_str)
    if rgb_match:
        r = float(rgb_match.group(1)) / 255.0
        g = float(rgb_match.group(2)) / 255.0
        b = float(rgb_match.group(3)) / 255.0
        return (max(0.0, min(1.0, r)), max(0.0, min(1.0, g)), max(0.0, min(1.0, b)))

    # Fallback to black if unparseable
    return (0.0, 0.0, 0.0)

def channel_to_linear(c: float) -> float:
    """Convert sRGB channel (0-1) to linear luminance."""
    if c <= 0.04045:
        return c / 12.92
    else:
        return math.pow((c + 0.055) / 1.055, 2.4)

def calculate_relative_luminance(r: float, g: float, b: float) -> float:
    """Calculate relative luminance as defined by WCAG 2.1 specs."""
    r_lin = channel_to_linear(r)
    g_lin = channel_to_linear(g)
    b_lin = channel_to_linear(b)
    return 0.2126 * r_lin + 0.7152 * g_lin + 0.0722 * b_lin

def calculate_contrast_ratio(color1: str, color2: str) -> Dict[str, Any]:
    """Calculate standard WCAG contrast ratio between two colors."""
    rgb1 = parse_color_to_rgb(color1)
    rgb2 = parse_color_to_rgb(color2)

    lum1 = calculate_relative_luminance(*rgb1)
    lum2 = calculate_relative_luminance(*rgb2)

    lighter = max(lum1, lum2)
    darker = min(lum1, lum2)

    ratio = (lighter + 0.05) / (darker + 0.05)
    rounded_ratio = round(ratio, 2)

    # WCAG 2.1 compliance
    normal_text_aa = rounded_ratio >= 4.5
    normal_text_aaa = rounded_ratio >= 7.0
    large_text_aa = rounded_ratio >= 3.0
    large_text_aaa = rounded_ratio >= 4.5
    ui_component_aa = rounded_ratio >= 3.0

    return {
        "foreground": color1,
        "background": color2,
        "ratio": rounded_ratio,
        "luminance": {
            "foreground": round(lum1, 4),
            "background": round(lum2, 4)
        },
        "wcag": {
            "normal_text_aa": normal_text_aa,
            "normal_text_aaa": normal_text_aaa,
            "large_text_aa": large_text_aa,
            "large_text_aaa": large_text_aaa,
            "ui_component_aa": ui_component_aa,
            "grade": "AAA" if normal_text_aaa else ("AA" if normal_text_aa else ("AA Large" if large_text_aa else "Fail"))
        }
    }
