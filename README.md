# mcp-ink-design ✒️

> **Model Context Protocol (MCP) Server for High-Craft Web Design & Engineering.**  
> Defeating "AI Slop" through bespoke OKLCH color harmonies, mathematical fluid typography, layered physical depth, Three.js 3D experiences, OWASP security audits, and dedicated Python verification.

---

## 💎 The Anti-AI-Slop Manifesto (`INK_MASTER.md`)

Most AI-generated web interfaces look generic, repetitive, and bland:
- Cliche `#6366f1` / `#a855f7` purple-to-blue linear gradients on dark cards.
- Rigid pixel typography that breaks or looks clumsy on mobile devices.
- Single harsh black drop-shadows instead of layered ambient occlusion.
- Div-heavy markup lacking semantic landmarks (`<main>`, `<header>`, `<nav>`).
- Dangerous client-side DOM injections (`innerHTML`, `eval`) and tokens stored in `localStorage`.

**`mcp-ink-design` enforces a human-grade architectural standard:**
1. **Perceptually Uniform OKLCH Color Spaces**: Uniform lightness and chroma without dead gray zones in gradients.
2. **Mathematical Fluid Typography**: Smooth viewport scaling using `clamp(min, preferred, max)`.
3. **Tactile Micro-Interactions**: Real physical response curves (`cubic-bezier(0.16, 1, 0.3, 1)`).
4. **Purposeful 3D WebGL / Three.js**: Responsive canvases with devicePixelRatio clamping and memory disposal cleanup.
5. **Zero-Trust Security & Auth**: Strict Content Security Policy (CSP), safe DOM sinks, and HttpOnly cookie architecture.
6. **External Verification Suite**: Automated Python linter for AST security, contrast calculations, and design heuristics.

---

## 🛠️ Tool Suite (`tools/list` — 11 Standardized Tools)

All 11 tools strictly follow the MCP Glama Benchmark standards (`ink_<verb>_<noun>`, explicit MCP tool annotations, typed output schemas, and operational usage guidelines):

| Canonical Tool Name | Title | Verb + Noun | Annotations | Output Schema | Purpose |
|---|---|---|---|---|---|
| `ink_create_base` | Scaffold Web Application Foundation | create + base | `readOnlyHint: true` | `CreateBaseOutputSchema` | Scaffolds complete semantic HTML5, CSS architecture, OKLCH tokens, and main.js |
| `ink_generate_palette_tokens` | Generate OKLCH Palette & Design Tokens | generate + palette_tokens | `readOnlyHint: true` | `PaletteTokensOutputSchema` | Generates bespoke OKLCH palettes, CSS custom properties, and WCAG AAA contrast ratios |
| `ink_craft_component` | Craft UI Component with Tactile Physics | craft + component | `readOnlyHint: true` | `CraftComponentOutputSchema` | Crafts tactile components (`glass-card`, `tactile-button`, `hero-section`, `navigation-bar`, etc.) |
| `ink_build_threejs_experience` | Build 3D WebGL Canvas Experience | build + threejs_experience | `readOnlyHint: true` | `ThreejsExperienceOutputSchema` | Generates memory-safe Three.js canvas experiences (`particle-constellation`, `geometric-wireframe`) |
| `ink_generate_script_logic` | Generate Modular Architecture Logic | generate + script_logic | `readOnlyHint: true` | `ScriptLogicOutputSchema` | Generates zero-dependency logic modules (`state-store`, `event-bus`, `scroll-observer`, `form-validator`) |
| `ink_audit_security` | Audit Frontend Code Security & Headers | audit + security | `readOnlyHint: true` | `SecurityAuditOutputSchema` | Scans code for DOM XSS, eval, token leakage in localStorage, and generates tailored CSP headers |
| `ink_validate_design` | Validate Design Craft & Contrast Compliance | validate + design | `readOnlyHint: true` | `ValidateDesignOutputSchema` | Computes Craft Grade (S, A, B, C), checks anti-slop rules, evaluates contrast, and audits RTL/LTR logical properties |
| `ink_run_python_tests` | Run Python AST & Contrast Verification Suite | run + python_tests | `readOnlyHint: true` | `PythonTestRunnerOutputSchema` | Executes the dedicated Python testing suite (`ink_verifier`) via stdin JSON pipeline |
| `ink_capture_viewport` | Capture Multi-Viewport Responsive Snapshots | capture + viewport | `readOnlyHint: false` | `CaptureViewportOutputSchema` | Captures 16:9 Desktop, 9:16 Story, and 390x844 Mobile snapshots with automated overflow checks |
| `ink_inspect_website_style` | Inspect & Reverse-Engineer Website Style | inspect + website_style | `readOnlyHint: true` | `InspectWebsiteStyleOutputSchema` | Deconstructs any website (URL or HTML/CSS) into an OKLCH palette, font hierarchy, and design blueprint |
| `ink_import_custom_assets` | Import & Configure Web Fonts and Assets | import + custom_assets | `readOnlyHint: true` | `ImportCustomAssetsOutputSchema` | Configures dynamic Google Fonts imports (Arabic & Latin) and generates CSS variables with optical line-heights |

---

## 🌍 Arabic Typography & RTL/LTR Logical Properties

`mcp-ink-design` includes first-class engineering for Arabic and bilingual web apps:
- **Modern CSS Logical Properties**: Automatically enforces `margin-inline`, `padding-inline`, `inset-inline`, and `text-align: start` instead of hardcoded physical directions.
- **Arabic Optical Compensation**: Line-heights for Arabic glyphs are adjusted to `1.75 - 1.85` for body text to avoid diacritic and ascender clipping.
- **Curated Arabic Font Stacks**: `IBM Plex Sans Arabic`, `Cairo`, `Tajawal`, `Readex Pro`, and `Amiri`.
- **Bidi Isolation**: Automated `<bdi>` wrapping and `unicode-bidi: isolate` prevent punctuation jumping in mixed-language code snippets.

---

## 📸 Multi-Viewport Capture (16:9, 9:16, Mobile)

After modifying any layout, `ink_capture_viewport` captures:
1. **16:9 Landscape (1600x900 / 1920x1080)**: Desktop container validation.
2. **9:16 Tall Story (540x960 / 1080x1920)**: Vertical social and mobile story view.
3. **Standard Mobile (390x844)**: Responsive mobile layout check, ensuring zero horizontal scrollbar leaks.

## 📖 MCP Resources (`resources/list`)

- **`ink://master/philosophy`**: The complete text of `INK_MASTER.md` constitution and tool execution pipeline.
- **`ink://tokens/design-presets`**: Curated OKLCH presets (`editorial`, `luxury-dark`, `cyber-tactile`, `neo-brutalist`, `organic-modern`).
- **`ink://security/owasp-frontend`**: Client-side OWASP security checklist and guidelines.

---

## 💬 MCP Prompts (`prompts/list`)

- **`ink_creative_direction`**: Guided session to establish project aesthetics, color tokens, and layout before writing code.
- **`ink_anti_slop_audit`**: Guided workflow to inspect any existing code, compute craft scores, and remediate slop.

---

## 🚀 Installation & Client Setup

### 1. Claude Desktop
Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ink-design": {
      "command": "npx",
      "args": ["-y", "mcp-ink-design"]
    }
  }
}
```

Or when developing locally:
```json
{
  "mcpServers": {
    "ink-design": {
      "command": "node",
      "args": ["c:/Users/DKurdistan/Desktop/mcp-ink-design/dist/index.js"],
      "env": {
        "INK_PYTHON_PATH": "python"
      }
    }
  }
}
```

### 2. Antigravity IDE / Cursor / Windsurf
Add to your workspace `.agents/mcp_config.json` or global config:

```json
{
  "mcpServers": {
    "ink-design": {
      "command": "node",
      "args": ["c:/Users/DKurdistan/Desktop/mcp-ink-design/dist/index.js"]
    }
  }
}
```

---

## 🐍 Python Verification Suite (`python/ink_verifier`)

The server includes a dedicated Python testing and verification engine that runs independently or via `ink_run_python_tests`:

```bash
# Run python unit tests
python -m unittest discover -s python/test

# Test contrast ratio directly via CLI
echo '{"foreground": "#ffffff", "background": "#0b0f19"}' | python -m python.ink_verifier.cli --action contrast --stdin

# Test security linter
echo '{"code": "element.innerHTML = userVal;"}' | python -m python.ink_verifier.cli --action security --stdin
```

---

## 🧪 Development & Quality Gates

```bash
# Typecheck
npm run typecheck

# Run Vitest test suite (unit, contract, integration)
npm test

# Build distribution bundle
npm run build

# Inspect package tarball
npm pack --dry-run
```

---

## 📜 License

MIT License — Created by MarwanDevMCP.
