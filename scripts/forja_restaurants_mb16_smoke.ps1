param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

& powershell -ExecutionPolicy Bypass -File "$Root\scripts\forja_restaurants_mb16_contract_healthcheck.ps1"
if ($LASTEXITCODE -ne 0) { throw "contract healthcheck failed" }

& powershell -ExecutionPolicy Bypass -File "$Root\scripts\forja_restaurants_mb16_base_impl_healthcheck.ps1"
if ($LASTEXITCODE -ne 0) { throw "base impl healthcheck failed" }

$checks = @(
  @{ Path = "$Root\apps\admin\lib\sms\service.ts"; Pattern = "sendSms" },
  @{ Path = "$Root\apps\admin\app\api\internal\sms\outbound\route.ts"; Pattern = "NextResponse.json" },
  @{ Path = "$Root\apps\admin\app\api\internal\sms\inbound\route.ts"; Pattern = 'direction: "inbound"' }
)

foreach ($check in $checks) {
  if (-not (Select-String -Path $check.Path -Pattern $check.Pattern -Quiet)) {
    Write-Host "MB16 SMOKE FAILED" -ForegroundColor Red
    Write-Host " - Pattern not found: $($check.Pattern) in $($check.Path)" -ForegroundColor Red
    exit 1
  }
}

Write-Host "MB16 SMOKE OK" -ForegroundColor Green