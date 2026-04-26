param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

& powershell -ExecutionPolicy Bypass -File "$Root\scripts\forja_restaurants_mb14_contract_healthcheck.ps1"
if ($LASTEXITCODE -ne 0) { throw "contract healthcheck failed" }

& powershell -ExecutionPolicy Bypass -File "$Root\scripts\forja_restaurants_mb14_base_impl_healthcheck.ps1"
if ($LASTEXITCODE -ne 0) { throw "base impl healthcheck failed" }

$checks = @(
  @{ Path = "$Root\apps\admin\.env.deploy.example"; Pattern = "^ADMIN_BASE_URL=" },
  @{ Path = "$Root\apps\web\.env.deploy.example"; Pattern = "^WEB_BASE_URL=" },
  @{ Path = "$Root\apps\admin\app\api\ready\route.ts"; Pattern = "status: ready \? 200 : 503" },
  @{ Path = "$Root\apps\web\app\api\ready\route.ts"; Pattern = "status: ready \? 200 : 503" }
)

foreach ($check in $checks) {
  if (-not (Select-String -Path $check.Path -Pattern $check.Pattern -Quiet)) {
    Write-Host "MB14 READINESS VERIFY FAILED" -ForegroundColor Red
    Write-Host " - Pattern not found: $($check.Pattern) in $($check.Path)" -ForegroundColor Red
    exit 1
  }
}

Write-Host "MB14 READINESS VERIFY OK" -ForegroundColor Green