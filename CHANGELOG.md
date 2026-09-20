# Changelog — mcp-ink-design

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-09-21

### Changed — Glama Benchmark Tier-S Quality Elevation (5.0 / 5.0 Standard)
- **Standardized All 11 Tools to Strict `ink_<verb>_<noun>` Pattern**:
  - `ink_create_base` (Scaffold Web Application Foundation)
  - `ink_generate_palette_tokens` *(renamed from `ink_design_palette_tokens`)*
  - `ink_craft_component` (Craft UI Component with Tactile Physics)
  - `ink_build_threejs_experience` *(renamed from `ink_threejs_experience`)*
  - `ink_generate_script_logic` *(renamed from `ink_script_logic`)*
  - `ink_audit_security` *(renamed from `ink_security_audit`)*
  - `ink_validate_design` (Validate Design Craft & Contrast Compliance)
  - `ink_run_python_tests` *(renamed from `ink_python_test_runner`)*
  - `ink_capture_viewport` (Capture Multi-Viewport Responsive Snapshots)
  - `ink_inspect_website_style` (Inspect & Reverse-Engineer Website Style)
  - `ink_import_custom_assets` (Import & Configure Web Fonts and Assets)
- **Explicit MCP Tool Annotations**:
  - Attached `readOnlyHint`, `destructiveHint`, `idempotentHint`, and `openWorldHint` across all 11 tools using modern `server.registerTool(...)`.
- **Typed Output Schemas & Dual Result Envelope Output**:
  - Added Zod `OutputSchema` definitions for all 11 tools in `src/contracts/index.ts`.
  - Returned both text serialized JSON in `content` and validated typed objects in `structuredContent`.
- **Comprehensive 4-Part Tool Descriptions**:
  - Rewrote every tool description into structured sections: `PURPOSE`, `BEHAVIOR`, `USAGE GUIDELINES` (When to use, When NOT to use, Alternatives), and `RETURNS`.
- **Crisp Disambiguation for Verification Tools**:
  - Defined clear boundaries between `ink_validate_design` (fast in-memory CSS/craft/bidi linting), `ink_audit_security` (OWASP DOM XSS & CSP auditing), and `ink_run_python_tests` (external Python AST/matrix testing).
- **Glama MCP Registry Manifest**:
  - Added `glama.json` with schema validation (`https://glama.ai/mcp/schemas/server.json`) for maintainer ownership claiming (`MarwanDevSpace`, `MarwanDevMCP`).

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
