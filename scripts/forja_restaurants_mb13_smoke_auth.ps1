param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\apps\admin\lib\auth\config.ts",
  "$Root\apps\admin\lib\auth\bootstrap.ts",
  "$Root\apps\admin\lib\auth\session.ts",
  "$Root\apps\admin\lib\auth\guards.ts",
  "$Root\apps\admin\app\api\auth\login\route.ts",
  "$Root\apps\admin\app\api\auth\logout\route.ts",
  "$Root\apps\admin\app\login\page.tsx",
  "$Root\apps\web\lib\auth\getOptionalSession.ts"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "MB13 SMOKE AUTH FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

$checks = @(
  @{ Path = "$Root\apps\admin\app\api\auth\login\route.ts"; Pattern = "createAdminSessionToken" },
  @{ Path = "$Root\apps\admin\app\api\auth\logout\route.ts"; Pattern = "expires: new Date\(0\)" },
  @{ Path = "$Root\apps\admin\lib\auth\guards.ts"; Pattern = 'redirect\("/login"\)' },
  @{ Path = "$Root\apps\admin\app\login\page.tsx"; Pattern = 'form action="/api/auth/login"' }
)

foreach ($check in $checks) {
  if (-not (Select-String -Path $check.Path -Pattern $check.Pattern -Quiet)) {
    Write-Host "MB13 SMOKE AUTH FAILED" -ForegroundColor Red
    Write-Host " - Pattern not found: $($check.Pattern) in $($check.Path)" -ForegroundColor Red
    exit 1
  }
}

Write-Host "MB13 SMOKE AUTH OK" -ForegroundColor Green