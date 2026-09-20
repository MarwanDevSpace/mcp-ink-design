# Architecture Documentation — mcp-ink-design

## 1. System Overview

`mcp-ink-design` is a Model Context Protocol (MCP) server engineered to provide high-craft web design, anti-AI-slop heuristics, Three.js 3D capabilities, frontend security auditing, and external Python verification.

## 2. Layering & Module Boundaries

The codebase adheres strictly to the MarwanDevMCP layered architecture:

```text
src/
├── index.ts                # Transport entry point (StdioServerTransport)
├── server.ts               # Server assembly & public MCP registration
├── config/                 # Typed environment & configuration
├── core/                   # Stderr logger, error taxonomy, result envelopes
├── contracts/              # Zod validation schemas for all tools
├── master/                 # INK_MASTER.md loader & philosophy provider
├── tools/                  # 8 Public tool modules
├── resources/              # 3 MCP resource providers
├── prompts/                # 2 MCP guided prompts
├── domain/                 # Domain capabilities (zero transport dependencies)
│   ├── design-tokens/      # OKLCH math, palette generation, clamp typography
│   ├── components/         # High-craft UI templates with micro-interactions
│   ├── threejs/            # WebGL scene generation with memory cleanup
│   ├── security/           # OWASP heuristics, CSP generation, Auth patterns
│   └── verification/       # Design scoring & anti-slop rules
└── integrations/
    └── python/             # Child process bridge with stdin JSON streaming
```

### Dependency Rules:
1. `domain` has no knowledge of MCP SDK or transport layers. It operates purely on inputs and returns typed domain artifacts.
2. `tools` adapt validated input schemas (from `contracts`) to `domain` functions, wrapping outputs in standard `ResultEnvelope` structures.
3. `server.ts` acts solely as an assembly point.
4. `core/logger.ts` writes exclusively to `stderr` to maintain protocol purity on `stdout`.

## 3. Tool Invocation Pipeline

The recommended choreography for building or enhancing a web page:
1. `ink_design_palette_tokens`: Generate OKLCH tokens and fluid typography.
2. `ink_create_base`: Scaffold semantic HTML5 layout and CSS structure.
3. `ink_craft_component`: Generate tactile components (Hero, Cards, Buttons, Nav).
4. `ink_script_logic`: Implement zero-dependency client state/events.
5. `ink_threejs_experience`: Mount interactive 3D WebGL hero background.
6. `ink_security_audit`: Verify CSP, sanitize DOM, review Auth flows.
7. `ink_validate_design`: Verify craft score and WCAG AAA contrast ratios.
8. `ink_python_test_runner`: Run deep headless verification via Python suite.
