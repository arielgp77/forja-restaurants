param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants",
  [Parameter(Mandatory=$true)][string]$BlockId,
  [Parameter(Mandatory=$true)][ValidateSet("planned","in_progress","blocked","done")][string]$Status
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$path = "$Root\state\implementation\wave2_state.json"
$state = Get-Content -LiteralPath $path -Raw | ConvertFrom-Json
$blocks = @($state.blocks)

$target = @($blocks | Where-Object { "$($_.block_id)" -eq $BlockId } | Select-Object -First 1)
if ($target.Count -eq 0) {
  Write-Host "Block not found: $BlockId" -ForegroundColor Red
  exit 1
}

$target[0].status = $Status
$state.updated_at = (Get-Date).ToString("s")
$state | ConvertTo-Json -Depth 10 | Set-Content -Path $path -Encoding UTF8

Write-Host "WAVE2 BLOCK UPDATED" -ForegroundColor Green
Write-Host "$BlockId -> $Status" -ForegroundColor Yellow
