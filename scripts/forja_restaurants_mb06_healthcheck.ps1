param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\docs\mb06\MB06_ORDER_ENGINE_V1.md",
  "$Root\apps\web\src\lib\cart-types.ts",
  "$Root\apps\web\src\lib\cart-storage.ts",
  "$Root\apps\web\src\components\order\OrderClient.tsx",
  "$Root\apps\web\src\app\api\order\quote\route.ts",
  "$Root\apps\web\src\app\api\order\place\route.ts",
  "$Root\apps\web\src\app\order\confirmation\[orderId]\page.tsx",
  "$Root\apps\web\src\app\r\[slug]\page.tsx",
  "$Root\apps\web\src\lib\db.ts"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "MB06 HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "MB06 HEALTHCHECK OK" -ForegroundColor Green
Write-Host "Restart web dev server and test /r/demo-pizzeria" -ForegroundColor Cyan