param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$statePath = "$Root\state\implementation\wave2_state.json"
$state = Get-Content -LiteralPath $statePath -Raw | ConvertFrom-Json
$blocks = @($state.blocks)

$done = @($blocks | Where-Object { "$($_.status)" -eq "done" }).Count
$total = $blocks.Count
$percent = if ($total -gt 0) { [math]::Round(($done / $total) * 100, 1) } else { 0 }

Write-Host "WAVE2 STATUS" -ForegroundColor Cyan
Write-Host "Done: $done / $total ($percent%)" -ForegroundColor Yellow
Write-Host ""

$blocks |
  Sort-Object order |
  Select-Object order, block_id, name, status, owner |
  Format-Table -AutoSize
