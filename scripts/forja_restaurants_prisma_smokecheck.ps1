param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

function Invoke-Step {
  param(
    [Parameter(Mandatory=$true)][string]$Name,
    [Parameter(Mandatory=$true)][scriptblock]$Action
  )

  Write-Host "== $Name ==" -ForegroundColor Cyan
  & $Action
  if ($LASTEXITCODE -ne 0) {
    throw "Failed: $Name (exit code $LASTEXITCODE)"
  }
}

Push-Location $Root
try {
  Invoke-Step -Name "prisma format"   -Action { npx prisma format }
  Invoke-Step -Name "prisma validate" -Action { npx prisma validate }
  Invoke-Step -Name "prisma generate" -Action { npx prisma generate }
  Write-Host "OK - schema passed format/validate/generate." -ForegroundColor Green
}
finally {
  Pop-Location
}