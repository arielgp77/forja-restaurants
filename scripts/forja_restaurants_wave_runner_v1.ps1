param(
  [Parameter(Mandatory = $true)][string]$WaveId,
  [int]$Port = 3000,
  [switch]$AutoAdvance,
  [int]$TimeoutSec = 60
)

& "$PSScriptRoot\forja_restaurants_wave_runner_v2.ps1" -WaveId $WaveId -Port $Port -AutoAdvance:$AutoAdvance -TimeoutSec $TimeoutSec
exit $LASTEXITCODE
