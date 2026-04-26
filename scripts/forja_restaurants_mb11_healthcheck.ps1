param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\docs\mb11\MB11_PRICING_TIPS_PAYOUTS.md",
  "$Root\apps\admin\src\lib\db.ts",
  "$Root\apps\admin\src\app\api\internal\pricing\save\route.ts",
  "$Root\apps\admin\src\app\(dashboard)\settings\pricing\page.tsx",
  "$Root\apps\admin\src\app\(dashboard)\finance\payouts\page.tsx",
  "$Root\apps\admin\src\app\(dashboard)\layout.tsx",
  "$Root\apps\web\src\lib\cart-types.ts",
  "$Root\apps\web\src\lib\db.ts",
  "$Root\apps\web\src\app\api\order\quote\route.ts",
  "$Root\apps\web\src\app\api\order\place\route.ts",
  "$Root\apps\web\src\components\order\OrderClient.tsx"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "MB11 HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "MB11 HEALTHCHECK OK" -ForegroundColor Green
Write-Host "Restart web/admin and test pricing + payouts." -ForegroundColor Cyan