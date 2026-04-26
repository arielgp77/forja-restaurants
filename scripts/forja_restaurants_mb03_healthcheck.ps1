param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\docs\mb03\AUTH_ROLES_PERMISSIONS.md",
  "$Root\docs\mb03\MB03_NEXT_STEPS.md",
  "$Root\apps\admin\tsconfig.json",
  "$Root\apps\admin\src\lib\auth\types.ts",
  "$Root\apps\admin\src\lib\auth\rbac.ts",
  "$Root\apps\admin\src\lib\auth\session-cookie.ts",
  "$Root\apps\admin\src\lib\auth\server-auth.ts",
  "$Root\apps\admin\src\lib\auth\dev-team.ts",
  "$Root\apps\admin\src\app\sign-in\page.tsx",
  "$Root\apps\admin\src\app\(dashboard)\settings\team\page.tsx",
  "$Root\apps\admin\src\app\api\internal\dev-sign-in\route.ts",
  "$Root\apps\admin\src\app\api\internal\dev-sign-out\route.ts",
  "$Root\apps\admin\src\app\api\internal\team\route.ts",
  "$Root\apps\admin\src\proxy.ts"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if (Test-Path -LiteralPath "$Root\apps\admin\src\middleware.ts") {
  $missing += "$Root\apps\admin\src\middleware.ts should not exist"
}

if ($missing.Count -gt 0) {
  Write-Host "MB03 HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "MB03 HEALTHCHECK OK" -ForegroundColor Green