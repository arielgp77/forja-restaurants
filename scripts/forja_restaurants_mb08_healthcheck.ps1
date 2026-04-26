param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\docs\mb08\MB08_KITCHEN_PICKUP_BOARD.md",
  "$Root\apps\admin\src\lib\db.ts",
  "$Root\apps\admin\src\app\(dashboard)\layout.tsx",
  "$Root\apps\admin\src\app\(dashboard)\ops\board\page.tsx",
  "$Root\apps\admin\src\app\api\internal\orders\status-quick\route.ts"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "MB08 HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "MB08 HEALTHCHECK OK" -ForegroundColor Green
Write-Host "Restart admin dev server and test /ops/board" -ForegroundColor Cyan