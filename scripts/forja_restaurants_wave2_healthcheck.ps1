param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\state\implementation\wave2_state.json",
  "$Root\docs\implementation\waves\WAVE_2_EXECUTION_ORDER_BY_BLOCKS.md",
  "$Root\docs\implementation\waves\WAVE_2_EXECUTION_MATRIX.md",
  "$Root\docs\implementation\waves\blocks\W2-B01_HOME_PUBLICA.md",
  "$Root\docs\implementation\waves\blocks\W2-B02_MENU.md",
  "$Root\docs\implementation\waves\blocks\W2-B03_CHECKOUT.md",
  "$Root\docs\implementation\waves\blocks\W2-B04_PAYMENTS_ENCAPSULADOS.md",
  "$Root\docs\implementation\waves\blocks\W2-B05_CONFIRMATION.md",
  "$Root\docs\implementation\waves\blocks\W2-B06_TRACKING.md",
  "$Root\docs\implementation\waves\blocks\W2-B07_AUTH_INTERNO_MINIMO.md"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "WAVE2 HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "WAVE2 HEALTHCHECK OK" -ForegroundColor Green
