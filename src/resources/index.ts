/**
 * MCP Resources for Ink Design Server
 */

import { InkMasterProvider } from "../master/ink-master.js";
import { generatePalette } from "../domain/design-tokens/palette-generator.js";

export interface ResourceDefinition {
  uri: string;
  name: string;
  mimeType: string;
  description: string;
  read: () => Promise<{ contents: Array<{ uri: string; mimeType: string; text: string }> }>;
}

export const inkResources: ResourceDefinition[] = [
  {
    uri: "ink://master/philosophy",
    name: "INK_MASTER Constitution & Persona",
    mimeType: "text/markdown",
    description: "The complete Ink Design constitution, anti-AI-slop manifesto, and tool pipeline rules.",
    read: async () => {
      const text = InkMasterProvider.getConstitutionText();
      return {
        contents: [
          {
            uri: "ink://master/philosophy",
            mimeType: "text/markdown",
            text
          }
        ]
      };
    }
  },
  {
    uri: "ink://tokens/design-presets",
    name: "High-Craft Design Token Presets",
    mimeType: "application/json",
    description: "Curated OKLCH design palettes for editorial, luxury, cyber, and brutalist aesthetics.",
    read: async () => {
      const presets = {
        editorial: generatePalette("editorial"),
        luxuryDark: generatePalette("luxury-dark"),
        cyberTactile: generatePalette("cyber-tactile"),
        neoBrutalist: generatePalette("neo-brutalist"),
        organicModern: generatePalette("organic-modern")
      };
      return {
        contents: [
          {
            uri: "ink://tokens/design-presets",
            mimeType: "application/json",
            text: JSON.stringify(presets, null, 2)
          }
        ]
      };
    }
  },
  {
    uri: "ink://security/owasp-frontend",
    name: "OWASP Client-Side Security Standard",
    mimeType: "text/markdown",
    description: "Frontend security checklist: CSP directives, DOM XSS prevention, and secure Auth flows.",
    read: async () => {
      const guide = `
# OWASP Client-Side & Frontend Security Standard (Ink Design)

1. Content Security Policy (CSP):
   - Strict default-src 'self'
   - Nonce-based script execution
   - Frame ancestors 'none' to eliminate Clickjacking
2. DOM Sinks:
   - Prohibit raw innerHTML/outerHTML with dynamic user input.
   - Use textContent or DOMPurify.sanitize().
   - Never invoke eval() or Function().
3. Token & Auth Storage:
   - Never store sensitive JWT or refresh tokens in localStorage or sessionStorage.
   - Store Refresh Tokens in HttpOnly, Secure, SameSite=Strict cookies.
   - Retain Access Tokens in-memory.
4. Navigation:
   - All external links target="_blank" must contain rel="noopener noreferrer".
`.trim();
      return {
        contents: [
          {
            uri: "ink://security/owasp-frontend",
            mimeType: "text/markdown",
            text: guide
          }
        ]
      };
    }
  }
];
