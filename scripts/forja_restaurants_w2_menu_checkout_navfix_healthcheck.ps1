param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\apps\web\components\public\PublicHeader.tsx",
  "$Root\apps\web\components\cart\FloatingCartBar.tsx",
  "$Root\apps\web\components\menu\MenuClientShell.tsx",
  "$Root\apps\web\components\menu\MenuExperience.tsx"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "MENU->CHECKOUT NAV FIX HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "MENU->CHECKOUT NAV FIX HEALTHCHECK OK" -ForegroundColor Green
