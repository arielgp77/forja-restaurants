param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\docs\mb05\MB05_CMS_SCAFFOLD.md",
  "$Root\apps\admin\.env.local",
  "$Root\apps\admin\next.config.ts",
  "$Root\apps\admin\src\lib\db.ts",
  "$Root\apps\admin\src\lib\auth\route-session.ts",
  "$Root\apps\admin\src\app\(dashboard)\content\story\page.tsx",
  "$Root\apps\admin\src\app\(dashboard)\settings\branding\page.tsx",
  "$Root\apps\admin\src\app\(dashboard)\menu\page.tsx",
  "$Root\apps\admin\src\app\api\internal\cms\story\route.ts",
  "$Root\apps\admin\src\app\api\internal\cms\branding\route.ts",
  "$Root\apps\admin\src\app\api\internal\cms\menu\category\route.ts",
  "$Root\apps\admin\src\app\api\internal\cms\menu\item\route.ts",
  "$Root\apps\admin\src\app\api\internal\cms\menu\item-toggle\route.ts"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "MB05 HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "MB05 HEALTHCHECK OK" -ForegroundColor Green
Write-Host "Run: npm run dev:admin" -ForegroundColor Cyan
Write-Host "Open: http://localhost:3001/settings/team" -ForegroundColor Cyan
Write-Host "Then test:" -ForegroundColor Cyan
Write-Host " - http://localhost:3001/content/story" -ForegroundColor Cyan
Write-Host " - http://localhost:3001/settings/branding" -ForegroundColor Cyan
Write-Host " - http://localhost:3001/menu" -ForegroundColor Cyan