param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants",
  [Parameter(Mandatory=$true)][string]$BlockId
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$map = @{
  "W2-B01" = "$Root\docs\implementation\waves\blocks\W2-B01_HOME_PUBLICA.md"
  "W2-B02" = "$Root\docs\implementation\waves\blocks\W2-B02_MENU.md"
  "W2-B03" = "$Root\docs\implementation\waves\blocks\W2-B03_CHECKOUT.md"
  "W2-B04" = "$Root\docs\implementation\waves\blocks\W2-B04_PAYMENTS_ENCAPSULADOS.md"
  "W2-B05" = "$Root\docs\implementation\waves\blocks\W2-B05_CONFIRMATION.md"
  "W2-B06" = "$Root\docs\implementation\waves\blocks\W2-B06_TRACKING.md"
  "W2-B07" = "$Root\docs\implementation\waves\blocks\W2-B07_AUTH_INTERNO_MINIMO.md"
}

if (-not $map.ContainsKey($BlockId)) {
  Write-Host "Block not mapped: $BlockId" -ForegroundColor Red
  exit 1
}

Get-Content -Encoding UTF8 $map[$BlockId] -TotalCount 200
