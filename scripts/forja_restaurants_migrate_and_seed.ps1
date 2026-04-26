param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants",
  [string]$MigrationName = "init_forja_restaurants"
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
  if (-not (Test-Path ".env")) {
    throw ".env no existe en $Root"
  }

  $envText = Get-Content ".env" -Raw
  if ($envText -notmatch 'DATABASE_URL\s*=\s*".+?"') {
    throw "DATABASE_URL vacia o invalida en .env"
  }

  Invoke-Step -Name "prisma format"   -Action { npx prisma format }
  Invoke-Step -Name "prisma validate" -Action { npx prisma validate }
  Invoke-Step -Name "prisma generate" -Action { npx prisma generate }
  Invoke-Step -Name "prisma migrate"  -Action { npx prisma migrate dev --name $MigrationName }
  Invoke-Step -Name "prisma seed"     -Action { npx tsx infra/db/seeds/seed_demo.ts }

  Write-Host "OK - migrate + seed completados." -ForegroundColor Green
}
finally {
  Pop-Location
}