param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\docs\mb14\DEPLOY_ENVIRONMENTS_CONTRACT.md",
  "$Root\docs\mb14\DEPLOY_SECRETS_AND_DOMAINS.md",
  "$Root\docs\adr\ADR-0014-DEPLOY-BASELINE.md",
  "$Root\apps\admin\.env.deploy.example",
  "$Root\apps\web\.env.deploy.example"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "MB14 CONTRACT HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "MB14 CONTRACT HEALTHCHECK OK" -ForegroundColor Green