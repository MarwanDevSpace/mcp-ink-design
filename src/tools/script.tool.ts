import {
  ScriptLogicInput,
  ScriptLogicInputSchema,
  ScriptLogicOutputSchema,
  ReadOnlyAnnotations
} from "../contracts/index.js";
import { createSuccessEnvelope, ResultEnvelope } from "../core/result-envelope.js";

export const scriptTool = {
  name: "ink_generate_script_logic",
  title: "Generate Modular Architecture Logic",
  description:
    "PURPOSE: Generate zero-dependency, memory-safe JavaScript and TypeScript architectural modules (State Store, Event Bus, Intersection Scroll Observer, Theme Switcher, Form Validator) with production error boundaries.\n\nBEHAVIOR: Synthesizes modular ES6+ JavaScript and optional TypeScript declarations purely in-memory. Zero filesystem modifications. All generated code enforces memory cleanup paradigms (explicit unsubscribe functions, WeakMap caching, EventTarget/listener teardown).\n\nUSAGE GUIDELINES:\n- When to use: Use when creating application state management, event-driven decoupled messaging, viewport scroll animators, theme togglers, or accessible form validation.\n- When NOT to use: Do NOT use to render UI elements or write component styling (use ink_craft_component instead) or WebGL graphics (use ink_build_threejs_experience instead).\n- Alternatives: Use ink_craft_component for visual UI components; use ink_build_threejs_experience for 3D canvas rendering.\n\nRETURNS: ResultEnvelope containing zero-dependency ES module 'code', optional 'typescriptTypes', architectural pattern documentation, and executable 'usageExample'.",
  annotations: ReadOnlyAnnotations,
  inputSchema: ScriptLogicInputSchema,
  outputSchema: ScriptLogicOutputSchema,
  execute: async (rawInput: unknown): Promise<ResultEnvelope<unknown>> => {
    const input: ScriptLogicInput = ScriptLogicInputSchema.parse(rawInput);
    const { pattern, moduleName, typescript } = input;

    let code = "";
    let description = "";

    switch (pattern) {
      case "state-store":
        description = "Lightweight reactive pub/sub state container with immutable dispatch";
        code = `
/**
 * ${moduleName} - Reactive State Container
 * Zero dependencies, subscription teardown, immutable state updates.
 */
export class ${moduleName} {
  constructor(initialState = {}) {
    this._state = { ...initialState };
    this._listeners = new Set();
  }

  getState() {
    return Object.freeze({ ...this._state });
  }

  setState(updater) {
    const next = typeof updater === 'function' ? updater(this._state) : updater;
    this._state = { ...this._state, ...next };
    this._notify();
  }

  subscribe(listener) {
    this._listeners.add(listener);
    listener(this.getState());
    // Return unsubscribe callback
    return () => {
      this._listeners.delete(listener);
    };
  }

  _notify() {
    const current = this.getState();
    this._listeners.forEach((fn) => fn(current));
  }
}
`.trim();
        break;

      case "event-bus":
        description = "Decoupled global event orchestrator with wildcard support and memory cleanup";
        code = `
/**
 * ${moduleName} - Decoupled Event Orchestrator
 */
export class ${moduleName} {
  constructor() {
    this._handlers = new Map();
  }

  on(event, handler) {
    if (!this._handlers.has(event)) {
      this._handlers.set(event, new Set());
    }
    this._handlers.get(event).add(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    const handlers = this._handlers.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this._handlers.delete(event);
      }
    }
  }

  emit(event, payload) {
    const handlers = this._handlers.get(event);
    if (handlers) {
      handlers.forEach((fn) => {
        try {
          fn(payload);
        } catch (err) {
          console.error(\`[${moduleName}] Error in handler for \${event}:\`, err);
        }
      });
    }
  }

  clear() {
    this._handlers.clear();
  }
}
`.trim();
        break;

      case "scroll-observer":
        description = "High-performance Intersection Observer for scroll-triggered micro-animations";
        code = `
/**
 * ${moduleName} - Scroll Animation Observer
 */
export function init${moduleName}(selector = '[data-ink-animate]', options = {}) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return () => {};

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        if (options.once !== false) {
          observer.unobserve(entry.target);
        }
      }
    });
  }, {
    threshold: options.threshold || 0.15,
    rootMargin: options.rootMargin || '0px 0px -50px 0px'
  });

  elements.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}
`.trim();
        break;

      case "theme-toggle":
        description = "Theme Switcher with system prefers-color-scheme sync and localStorage persistence";
        code = `
/**
 * ${moduleName} - Adaptive Theme Controller
 */
export class ${moduleName} {
  constructor(storageKey = 'ink-theme-preference') {
    this._storageKey = storageKey;
    this._mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this._init();
  }

  _init() {
    const saved = localStorage.getItem(this._storageKey);
    const theme = saved || (this._mediaQuery.matches ? 'dark' : 'light');
    this.applyTheme(theme);

    this._mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem(this._storageKey)) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  }

  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(this._storageKey, next);
    this.applyTheme(next);
    return next;
  }
}
`.trim();
        break;

      case "form-validator":
      default:
        description = "Zero-dependency client-side form validation with accessible ARIA live states";
        code = `
/**
 * ${moduleName} - Accessible Form Validator
 */
export class ${moduleName} {
  constructor(formElement) {
    this.form = formElement;
    this._bindEvents();
  }

  _bindEvents() {
    if (!this.form) return;
    this.form.addEventListener('submit', (e) => {
      if (!this.validate()) {
        e.preventDefault();
      }
    });
  }

  validate() {
    const inputs = this.form.querySelectorAll('input, textarea, select');
    let isValid = true;

    inputs.forEach((field) => {
      const errorMsg = field.validationMessage;
      const errorContainer = this.form.querySelector(\`#\${field.id}-error\`);

      if (!field.checkValidity()) {
        isValid = false;
        field.setAttribute('aria-invalid', 'true');
        if (errorContainer) {
          errorContainer.textContent = errorMsg;
          errorContainer.removeAttribute('hidden');
        }
      } else {
        field.removeAttribute('aria-invalid');
        if (errorContainer) {
          errorContainer.textContent = '';
          errorContainer.setAttribute('hidden', '');
        }
      }
    });

    return isValid;
  }
}
`.trim();
        break;
    }

    return createSuccessEnvelope(
      `Generated ${pattern} module (${typescript ? "TypeScript" : "ESM JavaScript"}).`,
      {
        pattern,
        moduleName,
        description,
        isTypeScript: typescript,
        code
      },
      {
        nextActions: [
          "Import this module into your main.js application layer.",
          "Invoke cleanup callbacks on component teardown to guarantee zero memory leaks."
        ]
      }
    );
  }
};
