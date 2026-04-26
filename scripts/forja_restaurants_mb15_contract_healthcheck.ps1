param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\docs\mb15\PAYMENTS_REAL_CONTRACT.md",
  "$Root\docs\adr\ADR-0015-PAYMENTS-BASELINE.md",
  "$Root\apps\admin\.env.payments.example",
  "$Root\apps\web\.env.payments.example"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "MB15 CONTRACT HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "MB15 CONTRACT HEALTHCHECK OK" -ForegroundColor Green