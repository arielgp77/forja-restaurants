param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\README.md",
  "$Root\docs\master_tn_map.md",
  "$Root\docs\adr\ADR-0001-ARQUITECTURA-MADRE.md",
  "$Root\docs\mb01\VISION_PRODUCTO.md",
  "$Root\docs\mb02\README_MODELO_DATOS.md",
  "$Root\backlog\master_tn_map.csv",
  "$Root\backlog\tns\MB01.csv",
  "$Root\infra\db\schema.prisma"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path $p)) { $missing += $p }
}

if ($missing.Count -gt 0) {
  Write-Host "FALTAN ARCHIVOS:" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "OK — estructura base forja-restaurants sembrada." -ForegroundColor Green
