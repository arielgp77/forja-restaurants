param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

& powershell -ExecutionPolicy Bypass -File "$Root\scripts\forja_restaurants_wave2_mark.ps1" -BlockId "W2-B01" -Status "in_progress"
if ($LASTEXITCODE -ne 0) { throw "Could not mark W2-B01 in_progress" }

& powershell -ExecutionPolicy Bypass -File "$Root\scripts\forja_restaurants_w2_b01_healthcheck.ps1"
if ($LASTEXITCODE -ne 0) { throw "W2-B01 healthcheck failed" }

Write-Host "W2-B01 START OK" -ForegroundColor Green
