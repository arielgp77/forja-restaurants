param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\apps\web\lib\provider-connections\types.ts",
  "$Root\apps\web\lib\provider-connections\config.ts",
  "$Root\apps\web\lib\provider-connections\store.server.ts",
  "$Root\apps\web\lib\provider-connections\providers\stripe-connect.server.ts",
  "$Root\apps\web\lib\provider-connections\providers\square-oauth.server.ts",
  "$Root\apps\web\lib\provider-connections\providers\adyen-hidden.server.ts",
  "$Root\apps\web\app\api\provider-connections\list\route.ts",
  "$Root\apps\web\app\api\provider-connections\disconnect\route.ts",
  "$Root\apps\web\app\api\provider-connections\stripe\start\route.ts",
  "$Root\apps\web\app\api\provider-connections\stripe\callback\route.ts",
  "$Root\apps\web\app\api\provider-connections\square\start\route.ts",
  "$Root\apps\web\app\api\provider-connections\square\callback\route.ts",
  "$Root\apps\web\app\api\provider-connections\adyen\save\route.ts",
  "$Root\apps\web\app\ops\payments\connections\page.tsx",
  "$Root\.env.connections.example",
  "$Root\docs\implementation\payments\provider_connection_architecture.md"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "W2-B04 CONNECTION ADAPTERS HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "W2-B04 CONNECTION ADAPTERS HEALTHCHECK OK" -ForegroundColor Green
