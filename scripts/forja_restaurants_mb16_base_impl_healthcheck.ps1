param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\apps\admin\lib\sms\config.ts",
  "$Root\apps\admin\lib\sms\service.ts",
  "$Root\apps\admin\app\api\internal\sms\outbound\route.ts",
  "$Root\apps\admin\app\api\internal\sms\inbound\route.ts"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "MB16 BASE IMPL HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "MB16 BASE IMPL HEALTHCHECK OK" -ForegroundColor Green