param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$required = @(
  "$Root\docs\implementation\MASTER_CHECKLIST_BY_ROUTE.md",
  "$Root\docs\implementation\routes\route_public_home_r_slug.md",
  "$Root\docs\implementation\routes\route_public_menu_r_slug_menu.md",
  "$Root\docs\implementation\routes\route_public_checkout_r_slug_checkout.md",
  "$Root\docs\implementation\routes\route_public_confirmation_order_confirmation_id.md",
  "$Root\docs\implementation\routes\route_public_tracking_order_track_id.md",
  "$Root\docs\implementation\routes\route_admin_login.md",
  "$Root\docs\implementation\routes\route_orders_board.md",
  "$Root\docs\implementation\routes\route_orders_detail_id.md",
  "$Root\docs\implementation\routes\route_ops_board.md",
  "$Root\docs\implementation\routes\route_ops_kitchen.md",
  "$Root\docs\implementation\routes\route_ops_curbside.md",
  "$Root\docs\implementation\routes\route_admin_dashboard.md",
  "$Root\docs\implementation\routes\route_admin_menu.md",
  "$Root\docs\implementation\routes\route_admin_branding.md",
  "$Root\docs\implementation\routes\route_admin_staff.md",
  "$Root\docs\implementation\routes\route_admin_integrations.md",
  "$Root\docs\implementation\routes\route_admin_system.md",
  "$Root\docs\implementation\routes\route_admin_activity.md",
  "$Root\docs\implementation\routes\route_payments_checkout_module.md",
  "$Root\docs\implementation\routes\route_auth_internal_module.md",
  "$Root\docs\implementation\routes\route_sms_operational_module.md",
  "$Root\docs\implementation\routes\route_design_system_shared.md"
)

$missing = @()
foreach ($p in $required) {
  if (-not (Test-Path -LiteralPath $p)) {
    $missing += $p
  }
}

if ($missing.Count -gt 0) {
  Write-Host "MASTER CHECKLIST HEALTHCHECK FAILED" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "MASTER CHECKLIST HEALTHCHECK OK" -ForegroundColor Green