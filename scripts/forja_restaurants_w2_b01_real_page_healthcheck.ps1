param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\apps\web\lib\public-home\tenant-loader.ts",
  "$Root\apps\web\app\r\[slug]\page.tsx",
  "$Root\apps\web\app\r\[slug]\home-preview\page.tsx"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "W2-B01 REAL PAGE HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "W2-B01 REAL PAGE HEALTHCHECK OK" -ForegroundColor Green