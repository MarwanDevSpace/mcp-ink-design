#!/usr/bin/env node
import("../dist/index.js").catch((err) => {
  console.error("Failed to run mcp-ink-design:", err);
  process.exit(1);
});
