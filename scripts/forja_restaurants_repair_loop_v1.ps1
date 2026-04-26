param(
  [Parameter(Mandatory = $true)][string]$WaveId,
  [int]$Port = 3000,
  [int]$MaxAttempts = 3,
  [switch]$AutoAdvance
)

& "$PSScriptRoot\forja_restaurants_repair_loop_v2.ps1" -WaveId $WaveId -Port $Port -MaxAttempts $MaxAttempts -AutoAdvance:$AutoAdvance
exit $LASTEXITCODE
