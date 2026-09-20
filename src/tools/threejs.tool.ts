import {
  ThreeExperienceInput,
  ThreeExperienceInputSchema,
  ThreeExperienceOutputSchema,
  ReadOnlyAnnotations
} from "../contracts/index.js";
import { generateThreeExperience } from "../domain/threejs/threejs-engine.js";
import { createSuccessEnvelope, ResultEnvelope } from "../core/result-envelope.js";

export const threejsTool = {
  name: "ink_build_threejs_experience",
  title: "Build 3D WebGL Canvas Experience",
  description:
    "PURPOSE: Generate high-performance, responsive 3D WebGL scenes using Three.js (particle constellations, geometric wireframes, morphing meshes, or interactive hero canvases) with memory-safe lifecycles.\n\nBEHAVIOR: Generates client-side HTML container, full-bleed CSS, and JavaScript module code purely in-memory. Zero filesystem mutations. Incorporates GPU protections: automatically clamps window.devicePixelRatio to 2, attaches window resize listeners, pauses requestAnimationFrame on hidden browser tabs via the Page Visibility API, and exposes a clean teardown disposal function (geometries, materials, renderer.dispose()).\n\nUSAGE GUIDELINES:\n- When to use: Use when a page needs an interactive 3D hero background, ambient particle field, or futuristic geometric visual experience.\n- When NOT to use: Do NOT use for standard 2D UI widgets or layouts (use ink_craft_component instead), nor for basic CSS animations without WebGL.\n- Alternatives: Use ink_craft_component for 2D UI components; use ink_create_base for scaffolding the full application shell.\n\nRETURNS: ResultEnvelope containing canvas mounting 'html', full-bleed responsive 'css', initialization and teardown 'js', and lifecycle documentation.",
  annotations: ReadOnlyAnnotations,
  inputSchema: ThreeExperienceInputSchema,
  outputSchema: ThreeExperienceOutputSchema,
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
