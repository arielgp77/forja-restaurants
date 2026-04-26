param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\docs\mb10\MB10_TRANSITION_GUARDS_AUDIT.md",
  "$Root\apps\admin\src\proxy.ts",
  "$Root\apps\admin\src\lib\db.ts",
  "$Root\apps\admin\src\app\api\internal\orders\status\route.ts",
  "$Root\apps\admin\src\app\api\internal\orders\status-quick\route.ts",
  "$Root\apps\admin\src\app\api\internal\mock\sms-arrival\route.ts",
  "$Root\apps\admin\src\app\(dashboard)\orders\[orderId]\page.tsx",
  "$Root\apps\admin\src\app\(dashboard)\ops\board\page.tsx",
  "$Root\apps\admin\src\app\(dashboard)\ops\curbside\page.tsx"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if (Test-Path -LiteralPath "$Root\apps\admin\src\middleware.ts") {
  $missing += "$Root\apps\admin\src\middleware.ts should be removed"
}

if ($missing.Count -gt 0) {
  Write-Host "MB10 HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "MB10 HEALTHCHECK OK" -ForegroundColor Green
Write-Host "Restart admin dev server and test invalid transitions." -ForegroundColor Cyan