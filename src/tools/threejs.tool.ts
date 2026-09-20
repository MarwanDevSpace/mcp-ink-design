/**
 * Tool: ink_threejs_experience
 * Generates interactive 3D WebGL experiences with lifecycle management and memory cleanup.
 */

import { ThreeExperienceInput, ThreeExperienceInputSchema } from "../contracts/index.js";
import { generateThreeExperience } from "../domain/threejs/threejs-engine.js";
import { createSuccessEnvelope, ResultEnvelope } from "../core/result-envelope.js";

export const threejsTool = {
  name: "ink_threejs_experience",
  title: "Generate 3D WebGL / Three.js Canvas Experience",
  description:
    "Generate lightweight, responsive 3D WebGL experiences (particles, geometric wireframes, interactive canvas) with devicePixelRatio clamping and memory disposal cleanup.",
  inputSchema: ThreeExperienceInputSchema,
  execute: async (rawInput: unknown): Promise<ResultEnvelope<unknown>> => {
    const input: ThreeExperienceInput = ThreeExperienceInputSchema.parse(rawInput);
    const artifact = generateThreeExperience({
      sceneType: input.sceneType,
      accentColorHex: input.accentColorHex,
      particleCount: input.particleCount,
      enableMouseParallax: input.enableMouseParallax
    });

    return createSuccessEnvelope(
      `Generated ${input.sceneType} 3D experience with memory disposal lifecycle.`,
      artifact,
      {
        nextActions: [
          "Include the Three.js library script in your HTML head.",
          "Mount the canvas element in your hero section.",
          "Call initInkThreeScene(container) and retain the teardown function for unmount."
        ]
      }
    );
  }
};
