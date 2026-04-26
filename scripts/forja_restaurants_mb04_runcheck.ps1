param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\package.json",
  "$Root\apps\web\next.config.ts",
  "$Root\apps\web\package.json",
  "$Root\apps\web\.env.local",
  "$Root\apps\web\src\app\page.tsx",
  "$Root\apps\web\src\app\r\[slug]\page.tsx",
  "$Root\apps\web\src\lib\db.ts"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "MB04.1 RUNCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "MB04.1 RUNCHECK OK" -ForegroundColor Green
Write-Host "Run next with: npm run dev:web" -ForegroundColor Cyan
Write-Host "Open: http://localhost:3000/r/demo-pizzeria" -ForegroundColor Cyan