param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\apps\web\lib\payments\types.ts",
  "$Root\apps\web\lib\payments\config.ts",
  "$Root\apps\web\lib\payments\registry.server.ts",
  "$Root\apps\web\lib\payments\providers\stripe.server.ts",
  "$Root\apps\web\lib\payments\providers\square.server.ts",
  "$Root\apps\web\lib\payments\providers\adyen.server.ts",
  "$Root\apps\web\app\api\payments\prepare\route.ts",
  "$Root\.env.payments.example",
  "$Root\docs\implementation\payments\payment_adapter_architecture.md",
  "$Root\docs\implementation\payments\provider_notes.md"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "W2-B04 PAYMENT ADAPTER HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "W2-B04 PAYMENT ADAPTER HEALTHCHECK OK" -ForegroundColor Green
