param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$map = @(Import-Csv "$Root\backlog\master_tn_map.csv")

$done = @($map | Where-Object { "$($_.status)".Trim() -eq "done" }).Count
$inReview = @($map | Where-Object { "$($_.status)".Trim() -eq "in_review" }).Count
$inProgress = @($map | Where-Object { "$($_.status)".Trim() -eq "in_progress" }).Count
$total = $map.Count

Write-Host "MASTER TN MAP RECONCILED" -ForegroundColor Green
Write-Host "Done       : $done / $total" -ForegroundColor Cyan
Write-Host "In review  : $inReview / $total" -ForegroundColor Yellow
Write-Host "In progress: $inProgress / $total" -ForegroundColor Yellow