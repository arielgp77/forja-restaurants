param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\apps\web\lib\checkout\types.ts",
  "$Root\apps\web\lib\checkout\loader.ts",
  "$Root\apps\web\app\api\checkout\quote\route.ts",
  "$Root\apps\web\app\api\checkout\place-order\route.ts",
  "$Root\apps\web\components\checkout\FulfillmentSelector.tsx",
  "$Root\apps\web\components\checkout\TipSelector.tsx",
  "$Root\apps\web\components\checkout\OrderSummaryCard.tsx",
  "$Root\apps\web\components\checkout\CheckoutClientShell.tsx",
  "$Root\apps\web\app\r\[slug]\checkout\page.tsx"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "W2-B03 HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "W2-B03 HEALTHCHECK OK" -ForegroundColor Green
