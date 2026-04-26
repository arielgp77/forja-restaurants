param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\docs\mb16\SMS_REAL_CONTRACT.md",
  "$Root\docs\adr\ADR-0016-SMS-BASELINE.md",
  "$Root\apps\admin\.env.sms.example"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "MB16 CONTRACT HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "MB16 CONTRACT HEALTHCHECK OK" -ForegroundColor Green