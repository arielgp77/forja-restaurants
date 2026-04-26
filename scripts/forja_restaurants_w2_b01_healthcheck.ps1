param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\apps\web\lib\public-home\types.ts",
  "$Root\apps\web\lib\public-home\view-model.ts",
  "$Root\apps\web\components\public\PublicHeader.tsx",
  "$Root\apps\web\components\public\HeroBanner.tsx",
  "$Root\apps\web\components\public\QuickInfoStrip.tsx",
  "$Root\apps\web\components\public\ProductHighlightCard.tsx",
  "$Root\apps\web\components\public\PublicFooter.tsx",
  "$Root\apps\web\app\r\[slug]\home-preview\page.tsx"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "W2-B01 HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "W2-B01 HEALTHCHECK OK" -ForegroundColor Green
