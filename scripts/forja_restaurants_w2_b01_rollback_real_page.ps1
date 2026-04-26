param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$realPage = "$Root\apps\web\app\r\[slug]\page.tsx"
$backupPage = "$Root\apps\web\app\r\[slug]\page.pre_w2_b01_backup.tsx"

if (-not (Test-Path -LiteralPath $backupPage)) {
  Write-Host "Rollback backup not found." -ForegroundColor Red
  exit 1
}

Copy-Item -LiteralPath $backupPage -Destination $realPage -Force
Write-Host "W2-B01 ROLLBACK OK" -ForegroundColor Green