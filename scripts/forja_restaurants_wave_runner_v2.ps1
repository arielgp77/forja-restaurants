param(
  [Parameter(Mandatory = $true)][string]$WaveId,
  [int]$Port = 3000,
  [switch]$AutoAdvance,
  [int]$TimeoutSec = 60
)

$projectRoot = Split-Path -Parent $PSScriptRoot
$forjaRoot = Split-Path -Parent $projectRoot
$core = Join-Path $forjaRoot "forja-core\core\Invoke-ForjaWave.ps1"
$adapter = Join-Path $projectRoot "forja.project.ps1"

& $core -ProjectAdapter $adapter -WaveId $WaveId -Port $Port -AutoAdvance:$AutoAdvance -TimeoutSec $TimeoutSec
exit $LASTEXITCODE
