/**
 * MCP Guided Prompts for Ink Design Server
 */

export interface PromptDefinition {
  name: string;
  description: string;
  arguments?: Array<{
    name: string;
    description: string;
    required?: boolean;
  }>;
  generateMessages: (args: Record<string, string>) => {
    messages: Array<{
      role: "user" | "assistant";
      content: { type: "text"; text: string };
    }>;
  };
}

export const inkPrompts: PromptDefinition[] = [
  {
    name: "ink_creative_direction",
    description: "Launch a bespoke creative direction session to establish typography, OKLCH palette, and component plan.",
    arguments: [
      {
        name: "product_description",
        description: "What does this website or application do?",
        required: true
      },
      {
        name: "desired_vibe",
        description: "Desired aesthetic (editorial, luxury-dark, cyber-tactile, neo-brutalist, organic-modern)",
        required: false
      }
    ],
    generateMessages: (args) => {
      const product = args.product_description || "Web Application";
      const vibe = args.desired_vibe || "editorial";
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Please establish the creative direction and visual architecture for: "${product}".
Desired aesthetic mood: "${vibe}".
Follow the INK_MASTER principles:
1. Select a tailored OKLCH color harmony with calculated contrast (no generic AI purple/blue gradients).
2. Establish a fluid clamp() typography scale.
3. Outline the component hierarchy (Hero, Cards, Micro-interactions).
4. Run the ink_design_palette_tokens and ink_create_base tools to generate the foundation.`
            }
          }
        ]
      };
    }
  },
  {
    name: "ink_anti_slop_audit",
    description: "Audit an existing web page or codebase to eliminate AI slop, fix contrast, and harden security.",
    arguments: [
      {
        name: "code_snippet",
        description: "The HTML, CSS, or JS code to audit",
        required: true
      }
    ],
    generateMessages: (args) => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Execute an Anti-AI-Slop and Security Audit on the following code according to the INK_MASTER constitution:

\`\`\`
${args.code_snippet || ""}
\`\`\`

1. Invoke ink_validate_design to score the craft quality and check contrast.
2. Invoke ink_security_audit to detect DOM XSS, eval, and auth storage risks.
3. Invoke ink_python_test_runner with action 'full' for external verification.
4. Produce a prioritized remediation diff.`
            }
          }
        ]
      };
    }
  }
];
