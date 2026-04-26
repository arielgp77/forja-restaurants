param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\docs\mb12\MB12_RELEASE_GATES_RECONCILIATION.md",
  "$Root\docs\release\SMOKE_MATRIX.md",
  "$Root\docs\release\KNOWN_GAPS.md",
  "$Root\docs\release\CHANGELOG_MVP.md",
  "$Root\docs\release\RELEASE_READINESS.md",
  "$Root\docs\master_tn_map.md",
  "$Root\backlog\master_tn_map.csv",
  "$Root\apps\web\next.config.ts",
  "$Root\scripts\forja_restaurants_release_gate.ps1",
  "$Root\scripts\forja_restaurants_master_sync_summary.ps1"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "MB12 HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "MB12 HEALTHCHECK OK" -ForegroundColor Green
Write-Host "Next:" -ForegroundColor Cyan
Write-Host " 1) powershell -ExecutionPolicy Bypass -File `"$Root\scripts\forja_restaurants_master_sync_summary.ps1`""
Write-Host " 2) powershell -ExecutionPolicy Bypass -File `"$Root\scripts\forja_restaurants_release_gate.ps1`""
Write-Host " 3) restart web/admin"
Write-Host " 4) run final pricing web smoke"