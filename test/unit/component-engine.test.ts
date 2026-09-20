import { describe, it, expect } from "vitest";
import { craftComponent } from "../../src/domain/components/component-engine.js";

describe("Component Engine", () => {
  it("crafts a glass card with responsive CSS and micro-interactions", () => {
    const card = craftComponent({
      componentType: "glass-card",
      title: "Telemetry Node",
      description: "Real-time edge computation"
    });

    expect(card.componentType).toBe("glass-card");
    expect(card.html).toContain("ink-card");
    expect(card.html).toContain("Telemetry Node");
    expect(card.css).toContain("backdrop-filter");
    expect(card.css).toContain("cubic-bezier");
    expect(card.javascript).toContain("initCardTilt");
    expect(card.accessibilityNotes.length).toBeGreaterThan(0);
  });

  it("crafts a tactile button with keyboard parity and ripple physics", () => {
    const btn = craftComponent({
      componentType: "tactile-button",
      title: "Execute Action"
    });

    expect(btn.componentType).toBe("tactile-button");
    expect(btn.html).toContain("<button type=\"button\"");
    expect(btn.css).toContain(":focus-visible");
    expect(btn.javascript).toContain("initTactileButton");
  });
});
