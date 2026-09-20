@echo off
title Publish mcp-ink-design to NPM
echo ===================================================
echo  mcp-ink-design v1.2.0 - Publishing to NPM Registry
echo ===================================================
echo.
echo Running npm publish --access public ...
echo.
call npm publish --access public
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================
    echo  [SUCCESS] mcp-ink-design v1.2.0 is now live on npm!
    echo  View at: https://www.npmjs.com/package/mcp-ink-design
    echo ===================================================
) else (
    echo.
    echo ===================================================
    echo  [NOTICE] npm publish returned code %ERRORLEVEL%.
    echo  If not logged in, run: npm login
    echo ===================================================
)
echo.
pause
