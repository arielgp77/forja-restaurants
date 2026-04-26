param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\apps\web\lib\menu\types.ts",
  "$Root\apps\web\lib\menu\fallback.ts",
  "$Root\apps\web\lib\menu\fallback-images.ts",
  "$Root\apps\web\lib\menu\loader.ts",
  "$Root\apps\web\components\menu\CategoryTabs.tsx",
  "$Root\apps\web\components\menu\ProductCard.tsx",
  "$Root\apps\web\components\menu\ProductDetailSheet.tsx",
  "$Root\apps\web\components\menu\MenuExperience.tsx",
  "$Root\apps\web\components\menu\MenuClientShell.tsx",
  "$Root\apps\web\components\cart\FloatingCartBar.tsx",
  "$Root\apps\web\app\r\[slug]\menu\page.tsx"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "W2-B02 HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "W2-B02 HEALTHCHECK OK" -ForegroundColor Green
