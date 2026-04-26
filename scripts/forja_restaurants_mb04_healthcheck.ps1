param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\docs\mb04\MB04_PUBLIC_SITE.md",
  "$Root\apps\web\tsconfig.json",
  "$Root\apps\web\src\lib\db.ts",
  "$Root\apps\web\src\app\layout.tsx",
  "$Root\apps\web\src\app\page.tsx",
  "$Root\apps\web\src\app\r\[slug]\page.tsx"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "MB04 HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "MB04 HEALTHCHECK OK" -ForegroundColor Green