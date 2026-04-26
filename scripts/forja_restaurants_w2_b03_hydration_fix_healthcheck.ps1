param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\apps\web\components\checkout\CheckoutShellLoading.tsx",
  "$Root\apps\web\app\r\[slug]\checkout\page.tsx"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "W2-B03 HYDRATION FIX HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "W2-B03 HYDRATION FIX HEALTHCHECK OK" -ForegroundColor Green
