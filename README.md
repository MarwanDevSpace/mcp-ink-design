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

## 🛠️ Tool Suite (`tools/list`)

| Tool Name | Action | Description |
|---|---|---|
| `ink_create_base` | Scaffolding | Scaffolds a complete modern web project (Semantic HTML5, CSS architecture, OKLCH tokens, main.js) |
| `ink_design_palette_tokens` | Color & Tokens | Generates OKLCH palettes, CSS custom properties, and WCAG AAA contrast ratios |
| `ink_craft_component` | UI Components | Crafts tactile components (`glass-card`, `tactile-button`, `hero-section`, `navigation-bar`, etc.) |
| `ink_threejs_experience` | 3D WebGL | Generates memory-safe Three.js canvas experiences (`particle-constellation`, `geometric-wireframe`) |
| `ink_script_logic` | Modern JS/TS | Generates zero-dependency logic modules (`state-store`, `event-bus`, `scroll-observer`, `form-validator`) |
| `ink_security_audit` | Security Audit | Scans code for DOM XSS, eval, token leakage in localStorage, and generates tailored CSP headers |
| `ink_validate_design` | Design QA | Computes Craft Grade (S, A, B, C), checks anti-slop rules, and evaluates contrast |
| `ink_python_test_runner` | External Verification | Executes the dedicated Python testing suite (`ink_verifier`) via stdin JSON pipeline |

---

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

The server includes a dedicated Python testing and verification engine that runs independently or via `ink_python_test_runner`:

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
