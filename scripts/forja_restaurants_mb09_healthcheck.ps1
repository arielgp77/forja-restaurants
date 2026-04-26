param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\docs\mb09\MB09_SMS_INBOUND_CURBSIDE.md",
  "$Root\apps\admin\src\lib\db.ts",
  "$Root\apps\admin\src\app\(dashboard)\layout.tsx",
  "$Root\apps\admin\src\app\(dashboard)\ops\curbside\page.tsx",
  "$Root\apps\admin\src\app\api\internal\mock\sms-arrival\route.ts"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "MB09 HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "MB09 HEALTHCHECK OK" -ForegroundColor Green
Write-Host "Restart admin dev server and test /ops/curbside" -ForegroundColor Cyan