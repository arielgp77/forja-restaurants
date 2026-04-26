param([Parameter(Mandatory=$true)][string]$Slug)

$ErrorActionPreference="Stop"
$root="C:\Users\ariel\LaForja\forja-restaurants"
$base=Join-Path $root "apps\web\app\r\$Slug"
$manifest=Join-Path $root "data\clients\$Slug.client.yaml"

$missing=@()
if(!(Test-Path $manifest)){ $missing+="manifest" }
if(!(Test-Path (Join-Path $base "page.tsx"))){ $missing+="home" }
if(!(Test-Path (Join-Path $base "menu\page.tsx"))){ $missing+="menu" }
if(!(Test-Path (Join-Path $base "checkout\page.tsx"))){ $missing+="checkout" }

if($missing.Count -gt 0){
  Write-Host "HEALTHCHECK FAIL => $($missing -join ', ')" -ForegroundColor Red
  exit 1
}

Write-Host "HEALTHCHECK OK => $Slug"
exit 0
