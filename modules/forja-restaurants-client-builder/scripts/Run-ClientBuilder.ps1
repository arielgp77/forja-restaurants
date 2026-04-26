param([Parameter(Mandatory=$true)][string]$Slug)

$ErrorActionPreference="Stop"
$root="C:\Users\ariel\LaForja\forja-restaurants"
$mod=Join-Path $root "modules\forja-restaurants-client-builder\scripts"

& (Join-Path $mod "Build-RestaurantDemo.ps1") -Slug $Slug
& (Join-Path $mod "Healthcheck-RestaurantDemo.ps1") -Slug $Slug
& (Join-Path $mod "Export-SalesPack.ps1") -Slug $Slug

Write-Host ""
Write-Host "CLOSEOUT OK"
Write-Host "Cliente: $Slug"
Write-Host "Local: http://localhost:3000/r/$Slug"
Write-Host "Public: https://forja-restaurants.vercel.app/r/$Slug"
Write-Host ""
Write-Host "Siguiente:"
Write-Host "npm run dev:web"
Write-Host "powershell -ExecutionPolicy Bypass -File `"$mod\Smokecheck-RestaurantDemo.ps1`" -Slug $Slug"
