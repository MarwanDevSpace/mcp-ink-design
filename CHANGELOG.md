# Changelog — mcp-ink-design

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-09-20

### Added
- **Multi-Viewport Visual Capture Engine** (`ink_capture_viewport`):
  - Captures 16:9 Desktop Landscape (1600x900 / 1920x1080).
  - Captures 9:16 Vertical Story (540x960 / 1080x1920).
  - Captures 390x844 Mobile View with zero-overflow verification.
  - Headless Chrome runner with isolated temp user-data-dirs to avoid process lockups.
- **Arabic Typography & Bilingual RTL/LTR Architecture**:
  - Full support for modern CSS Logical Properties (`margin-inline`, `padding-inline`, `inset-inline`, `text-align: start`).
  - Arabic optical line-height compensation (`1.75 - 1.85`).
  - Curated Arabic font scales: IBM Plex Sans Arabic, Cairo, Tajawal, Readex Pro, Amiri.
  - Bidirectional isolation checks (`<bdi>`, `unicode-bidi: isolate`).
- **Optical Centering & Alignment Auditing**:
  - Detection of paragraph centering misuse and horizontal overflow risks.
- **Website Style Reverse-Engineering & Inspection** (`ink_inspect_website_style`):
  - Deconstruction of external URLs or HTML/CSS into color gamuts, OKLCH upgrade tokens, font hierarchies, and shadow systems.
- **Dynamic Asset & Font Importer** (`ink_import_custom_assets`):
  - Configures and imports Google Fonts and `@font-face` rules with accessible fallbacks.
- Vitest test suite expanded to 31 tests across 13 test files; Python test suite expanded to 9 unit tests.

## [1.0.0] - 2026-09-20

### Added
- Complete MCP Server with stdio transport built on `@modelcontextprotocol/sdk`.
- `INK_MASTER.md` central design manifesto and anti-AI-slop constitution.
- 8 specialized tools:
  - `ink_create_base`
  - `ink_design_palette_tokens`
  - `ink_craft_component`
  - `ink_threejs_experience`
  - `ink_script_logic`
  - `ink_security_audit`
  - `ink_validate_design`
  - `ink_python_test_runner`
- 3 MCP resources (`ink://master/philosophy`, `ink://tokens/design-presets`, `ink://security/owasp-frontend`).
- 2 MCP prompts (`ink_creative_direction`, `ink_anti_slop_audit`).
- Pure TypeScript color math engine calculating WCAG 2.1/2.2 AAA contrast ratios and OKLCH color spaces.
- Mathematical fluid typography generator using CSS `clamp()`.
- Responsive Three.js WebGL scene engine with memory teardown lifecycle.
- Static client-side OWASP security scanner and CSP header generator.
- Dedicated Python verification suite (`python/ink_verifier`) with unit tests and stdin CLI bridge.
- Vitest test suite with 24 passing tests covering unit, contract, and integration levels.
