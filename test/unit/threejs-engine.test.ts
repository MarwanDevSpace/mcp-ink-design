import { describe, it, expect } from "vitest";
import { generateThreeExperience } from "../../src/domain/threejs/threejs-engine.js";

describe("Three.js Experience Engine", () => {
  it("generates particle constellation scene with disposal teardown", () => {
    const scene = generateThreeExperience({
      sceneType: "particle-constellation",
      particleCount: 500,
      accentColorHex: "#38bdf8"
    });

    expect(scene.sceneType).toBe("particle-constellation");
    expect(scene.html).toContain("<canvas id=\"inkThreeCanvas\"");
    expect(scene.javascript).toContain("function initInkThreeScene");
    expect(scene.javascript).toContain("return function teardown");
    expect(scene.javascript).toContain("renderer.dispose");
    expect(scene.javascript).toContain("Math.min(window.devicePixelRatio, 2)");
    expect(scene.lifecycle.memoryDisposal).toBe(true);
    expect(scene.lifecycle.dprClamped).toBe(true);
  });
});
