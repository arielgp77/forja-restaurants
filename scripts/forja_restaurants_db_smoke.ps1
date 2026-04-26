param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

Push-Location $Root
try {
  npx tsx .\scripts\db_smoke_probe.ts
  if ($LASTEXITCODE -ne 0) {
    throw "DB smoke probe failed with exit code $LASTEXITCODE"
  }
}
finally {
  Pop-Location
}