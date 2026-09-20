/**
 * Master Persona, Constitution, and Execution Chain loader
 * Reads and encapsulates INK_MASTER.md
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class InkMasterProvider {
  private static cachedContent: string | null = null;

  public static getMasterConstitutionPath(): string {
    // Look up relative to compiled dist or source root
    const candidates = [
      path.resolve(process.cwd(), "INK_MASTER.md"),
      path.resolve(__dirname, "../../INK_MASTER.md"),
      path.resolve(__dirname, "../INK_MASTER.md")
    ];

    for (const p of candidates) {
      if (fs.existsSync(p)) {
        return p;
      }
    }
    return candidates[0]!;
  }

  public static getConstitutionText(): string {
    if (this.cachedContent) {
      return this.cachedContent;
    }

    const filePath = this.getMasterConstitutionPath();
    try {
      if (fs.existsSync(filePath)) {
        this.cachedContent = fs.readFileSync(filePath, "utf-8");
        return this.cachedContent;
      }
    } catch {
      // fallback
    }

    return `# INK_MASTER Fallback Constitution
- Anti-AI-Slop design with OKLCH, micro-interactions, clamp() fluid typography.
- Multi-step pipeline: tokens -> base -> components -> script -> threejs -> security -> validate -> python.`;
  }

  public static getToolPipelineSteps() {
    return [
      { step: 1, tool: "ink_design_palette_tokens", purpose: "Generate OKLCH color harmony & typography tokens" },
      { step: 2, tool: "ink_create_base", purpose: "Scaffold modern semantic HTML5 and clean CSS architecture" },
      { step: 3, tool: "ink_craft_component", purpose: "Craft high-craft interactive components (glassmorphism/tactile)" },
      { step: 4, tool: "ink_script_logic", purpose: "Write clean, zero-leak modern JS logic & state orchestration" },
      { step: 5, tool: "ink_threejs_experience", purpose: "Assemble responsive 3D WebGL scenes (particles/shaders)" },
      { step: 6, tool: "ink_security_audit", purpose: "Audit CSP, headers, Auth flows, and DOM XSS vulnerabilities" },
      { step: 7, tool: "ink_validate_design", purpose: "Validate visual craft score, contrast, and layout shifts" },
      { step: 8, tool: "ink_python_test_runner", purpose: "Run external Python verification suite for deep validation" }
    ];
  }
}
