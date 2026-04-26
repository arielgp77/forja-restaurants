param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\docs\implementation\ROADMAP_EXECUTABLE_BY_WAVES.md",
  "$Root\docs\implementation\EXECUTION_MATRIX_BY_WAVE.md",
  "$Root\docs\implementation\waves\WAVE_2_REVENUE_CORE_AND_CUSTOMER_UX.md",
  "$Root\docs\implementation\waves\WAVE_3_OPERATIONS_AND_OWNER_CONTROL.md",
  "$Root\docs\implementation\waves\WAVE_FINAL_POLISH_AND_LAUNCH.md"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "WAVE ROADMAP HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "WAVE ROADMAP HEALTHCHECK OK" -ForegroundColor Green