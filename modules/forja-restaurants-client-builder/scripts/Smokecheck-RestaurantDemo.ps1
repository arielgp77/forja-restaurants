param(
  [Parameter(Mandatory=$true)][string]$Slug,
  [string]$BaseUrl="http://localhost:3000"
)

$ErrorActionPreference="Stop"
$routes=@(
  "$BaseUrl/r/$Slug",
  "$BaseUrl/r/$Slug/menu",
  "$BaseUrl/r/$Slug/checkout"
)

foreach($r in $routes){
  try{
    $status=(Invoke-WebRequest $r -UseBasicParsing).StatusCode
    Write-Host "$status => $r"
    if($status -ne 200){ exit 1 }
  }catch{
    Write-Host "SMOKECHECK FAIL => $r :: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
  }
}

Write-Host "SMOKECHECK OK => $Slug"
exit 0
