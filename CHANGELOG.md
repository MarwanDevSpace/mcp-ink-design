# Changelog — mcp-ink-design

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
