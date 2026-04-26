param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$checks = @(
  "$Root\scripts\forja_restaurants_healthcheck.ps1",
  "$Root\scripts\forja_restaurants_mb03_healthcheck.ps1",
  "$Root\scripts\forja_restaurants_mb04_healthcheck.ps1",
  "$Root\scripts\forja_restaurants_mb04_runcheck.ps1",
  "$Root\scripts\forja_restaurants_mb05_healthcheck.ps1",
  "$Root\scripts\forja_restaurants_mb08_healthcheck.ps1",
  "$Root\scripts\forja_restaurants_mb09_healthcheck.ps1",
  "$Root\scripts\forja_restaurants_mb10_healthcheck.ps1",
  "$Root\scripts\forja_restaurants_mb11_healthcheck.ps1",
  "$Root\scripts\forja_restaurants_mb12_healthcheck.ps1"
)

$results = @()

foreach ($script in $checks) {
  if (-not (Test-Path -LiteralPath $script)) {
    $results += [pscustomobject]@{
      script = $script
      status = "missing"
      exit_code = $null
    }
    continue
  }

  & powershell -ExecutionPolicy Bypass -File $script
  $exitCode = $LASTEXITCODE

  $results += [pscustomobject]@{
    script = $script
    status = $(if ($exitCode -eq 0) { "ok" } else { "failed" })
    exit_code = $exitCode
  }
}

$reportDir = "$Root\data\reports"
New-Item -ItemType Directory -Force -Path $reportDir | Out-Null

$jsonPath = "$reportDir\release_gate_latest.json"
$mdPath   = "$reportDir\release_gate_latest.md"

$results | ConvertTo-Json -Depth 5 | Set-Content -Path $jsonPath -Encoding UTF8

$lines = @()
$lines += "# Release Gate Latest"
$lines += ""
$lines += "| Script | Status | ExitCode |"
$lines += "|---|---|---:|"
foreach ($r in $results) {
  $lines += "| $($r.script.Replace($Root,'')) | $($r.status) | $($r.exit_code) |"
}
$lines += ""
$lines += "Generated: $(Get-Date -Format s)"
$lines += ""
$lines += "Manual remaining:"
$lines += "- web quote/place smoke with pricing + tip"
$lines += "- final demo walkthrough"

$lines -join "`r`n" | Set-Content -Path $mdPath -Encoding UTF8

$ok = @($results | Where-Object { $_.status -eq "ok" }).Count
$total = $results.Count

Write-Host ""
Write-Host "RELEASE GATE SUMMARY: $ok / $total scripts OK" -ForegroundColor Cyan
Write-Host "JSON: $jsonPath" -ForegroundColor Green
Write-Host "MD  : $mdPath" -ForegroundColor Green

if (@($results | Where-Object { $_.status -ne "ok" }).Count -gt 0) {
  exit 1
}