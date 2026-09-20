import {
  CraftComponentInput,
  CraftComponentInputSchema,
  CraftComponentOutputSchema,
  ReadOnlyAnnotations
} from "../contracts/index.js";
import { craftComponent } from "../domain/components/component-engine.js";
import { createSuccessEnvelope, ResultEnvelope } from "../core/result-envelope.js";

export const componentTool = {
  name: "ink_craft_component",
  title: "Craft UI Component with Tactile Physics",
  description:
    "PURPOSE: Synthesize bespoke, tactile UI components (hero sections, glass cards, tactile buttons, navigation bars, metrics grids, modal dialogs) with semantic HTML5, modern CSS logical properties, and spring micro-interaction physics.\n\nBEHAVIOR: Generates component markup, stylesheets, and lifecycle JavaScript strings purely in-memory. Does not mutate the filesystem, write to disk, or initiate network connections. Enforces keyboard accessibility (ARIA dialog, roving tabindex, escape dismiss) and bidi RTL/LTR compliance.\n\nUSAGE GUIDELINES:\n- When to use: Use when creating individual, high-craft UI components and interactive widgets that need to be embedded in an existing layout.\n- When NOT to use: Do NOT use to scaffold an entire web application project (use ink_create_base instead), nor for 3D WebGL scenes (use ink_build_threejs_experience instead), nor for non-visual state stores (use ink_generate_script_logic instead).\n- Alternatives: Use ink_create_base for full application scaffolding; use ink_build_threejs_experience for 3D canvas experiences.\n\nRETURNS: ResultEnvelope containing semantic 'html' markup, scoped 'css' rules using logical properties and OKLCH tokens, tactile 'js' interaction logic, and accessibility notes.",
  annotations: ReadOnlyAnnotations,
  inputSchema: CraftComponentInputSchema,
  outputSchema: CraftComponentOutputSchema,
  execute: async (rawInput: unknown): Promise<ResultEnvelope<unknown>> => {
    const input: CraftComponentInput = CraftComponentInputSchema.parse(rawInput);
    const artifact = craftComponent({
      componentType: input.componentType,
      title: input.title,
      description: input.description,
      interactivePhysics: input.interactivePhysics
    });

    return createSuccessEnvelope(
      `Crafted ${input.componentType} component with micro-interaction physics and keyboard parity.`,
      artifact,
      {
        nextActions: [
          "Insert the HTML into your semantic layout structure.",
          "Append the CSS into your stylesheet.",
          "Attach the JavaScript initialization function to your DOM lifecycle."
        ]
      }
    );
  }
};
