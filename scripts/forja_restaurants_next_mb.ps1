param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$map = Import-Csv "$Root\backlog\master_tn_map.csv"
$next = $map | Where-Object { $_.status -eq "planned" } | Select-Object -First 1

if (-not $next) {
  Write-Host "No hay MB planned." -ForegroundColor Yellow
  exit 0
}

Write-Host "SIGUIENTE MB:" -ForegroundColor Cyan
$next | Format-List
