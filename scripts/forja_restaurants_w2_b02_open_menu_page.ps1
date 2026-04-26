param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

Get-Content -LiteralPath "$Root\apps\web\app\r\[slug]\menu\page.tsx" -TotalCount 120
