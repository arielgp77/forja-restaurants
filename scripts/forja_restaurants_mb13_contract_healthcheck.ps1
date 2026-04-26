param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\docs\mb13\AUTH_REAL_CONTRACT.md",
  "$Root\docs\mb13\AUTH_ROLES_AND_ACCESS.md",
  "$Root\docs\adr\ADR-0013-AUTH-REAL-BASELINE.md",
  "$Root\apps\admin\.env.auth.example",
  "$Root\apps\web\.env.auth.example"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "MB13 CONTRACT HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "MB13 CONTRACT HEALTHCHECK OK" -ForegroundColor Green