param(
  [Parameter(Mandatory = $true)][string]$WaveId,
  [int]$Port = 3000,
  [int]$MaxAttempts = 3,
  [switch]$AutoAdvance
)

$projectRoot = Split-Path -Parent $PSScriptRoot
$forjaRoot = Split-Path -Parent $projectRoot
$core = Join-Path $forjaRoot "forja-core\core\Invoke-ForjaRepairLoop.ps1"
$adapter = Join-Path $projectRoot "forja.project.ps1"

& $core -ProjectAdapter $adapter -WaveId $WaveId -Port $Port -MaxAttempts $MaxAttempts -AutoAdvance:$AutoAdvance
exit $LASTEXITCODE
