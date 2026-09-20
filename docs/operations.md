# Operations & Runbook — mcp-ink-design

## 1. Environment Variables

| Variable | Type | Default | Description |
|---|---|---|---|
| `INK_LOG_LEVEL` | string | `info` | Logging verbosity (`debug`, `info`, `warn`, `error`). Writes to `stderr`. |
| `INK_PYTHON_PATH` | string | `python` | Path to python executable for external verification suite. |

## 2. Health & Diagnostics

- Verify installation:
  ```bash
  node ./bin/mcp-ink-design.js
  ```
  The process will start on stdio and output diagnostic logs to `stderr`.

- Run all automated quality checks:
  ```bash
  npm run typecheck
  npm test
  npm run test:python
  npm run build
  npm pack --dry-run
  ```

## 3. Troubleshooting

- **Python tests fail or runner times out**:
  Ensure Python 3.10+ is installed and present in your system PATH (`python --version`). You can set `INK_PYTHON_PATH=C:/path/to/python.exe`.
- **MCP Client reports protocol parse error**:
  Check that no console logs or standard output calls were added that write to `stdout`. All diagnostics must use `process.stderr.write()`.
