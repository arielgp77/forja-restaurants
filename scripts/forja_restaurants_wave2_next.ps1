param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$state = Get-Content -LiteralPath "$Root\state\implementation\wave2_state.json" -Raw | ConvertFrom-Json
$next = @($state.blocks | Where-Object { "$($_.status)" -eq "planned" -or "$($_.status)" -eq "in_progress" } | Sort-Object order | Select-Object -First 1)

if ($next.Count -eq 0) {
  Write-Host "No next Wave 2 block found." -ForegroundColor Yellow
  exit 0
}

Write-Host "NEXT WAVE2 BLOCK" -ForegroundColor Green
$next[0] | Format-List
