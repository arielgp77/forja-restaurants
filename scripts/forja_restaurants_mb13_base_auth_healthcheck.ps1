param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\apps\admin\lib\auth\config.ts",
  "$Root\apps\admin\lib\auth\bootstrap.ts",
  "$Root\apps\admin\lib\auth\session.ts",
  "$Root\apps\admin\lib\auth\guards.ts",
  "$Root\apps\admin\app\api\auth\login\route.ts",
  "$Root\apps\admin\app\api\auth\logout\route.ts",
  "$Root\apps\admin\app\login\page.tsx",
  "$Root\apps\web\lib\auth\getOptionalSession.ts"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "MB13 BASE AUTH HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "MB13 BASE AUTH HEALTHCHECK OK" -ForegroundColor Green