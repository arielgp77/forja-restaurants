param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\docs\mb07\MB07_ORDERS_BOARD_ADMIN.md",
  "$Root\apps\admin\src\lib\db.ts",
  "$Root\apps\admin\src\app\(dashboard)\layout.tsx",
  "$Root\apps\admin\src\app\(dashboard)\orders\page.tsx",
  "$Root\apps\admin\src\app\(dashboard)\orders\[orderId]\page.tsx",
  "$Root\apps\admin\src\app\api\internal\orders\status\route.ts"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "MB07 HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "MB07 HEALTHCHECK OK" -ForegroundColor Green
Write-Host "Restart admin dev server and test /orders" -ForegroundColor Cyan