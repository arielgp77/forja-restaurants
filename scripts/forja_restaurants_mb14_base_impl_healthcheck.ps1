param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\apps\admin\app\api\health\route.ts",
  "$Root\apps\admin\app\api\ready\route.ts",
  "$Root\apps\web\app\api\health\route.ts",
  "$Root\apps\web\app\api\ready\route.ts",
  "$Root\apps\admin\lib\deploy\env.ts",
  "$Root\apps\web\lib\deploy\env.ts"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "MB14 BASE IMPL HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "MB14 BASE IMPL HEALTHCHECK OK" -ForegroundColor Green