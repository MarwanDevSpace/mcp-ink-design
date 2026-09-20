/**
 * Tool: ink_craft_component
 * Crafts bespoke UI components with micro-interactions, responsive CSS, and keyboard accessibility.
 */

import { CraftComponentInput, CraftComponentInputSchema } from "../contracts/index.js";
import { craftComponent } from "../domain/components/component-engine.js";
import { createSuccessEnvelope, ResultEnvelope } from "../core/result-envelope.js";

export const componentTool = {
  name: "ink_craft_component",
  title: "Craft High-Craft UI Component",
  description:
    "Generate tactile, beautifully animated, anti-slop web components (hero-section, glass-card, tactile-button, navigation-bar, metrics-grid, modal-dialog) with HTML, CSS, and clean JS.",
  inputSchema: CraftComponentInputSchema,
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
