param(
  [ValidateSet("wave","repair","status","readme")]
  [string]$Action = "status",
  [string]$WaveId = "W2-B03",
  [int]$Port = 3000,
  [int]$MaxAttempts = 3,
  [switch]$AutoAdvance
)

switch ($Action) {
  "wave" {
    & "$PSScriptRoot\forja_restaurants_wave_runner_v2.ps1" -WaveId $WaveId -Port $Port -AutoAdvance:$AutoAdvance
    exit $LASTEXITCODE
  }

  "repair" {
    & "$PSScriptRoot\forja_restaurants_repair_loop_v2.ps1" -WaveId $WaveId -Port $Port -MaxAttempts $MaxAttempts -AutoAdvance:$AutoAdvance
    exit $LASTEXITCODE
  }

  "status" {
    $status = Join-Path $PSScriptRoot "forja_restaurants_wave2_status.ps1"
    if (Test-Path -LiteralPath $status) {
      & powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File $status
      exit $LASTEXITCODE
    }
    Write-Host "No existe status script." -ForegroundColor Yellow
    exit 1
  }

  "readme" {
    Write-Host "USO RAPIDO" -ForegroundColor Cyan
    Write-Host ".\scripts\fr.ps1 -Action wave   -WaveId W2-B03"
    Write-Host ".\scripts\fr.ps1 -Action repair -WaveId W2-B03 -MaxAttempts 3"
    Write-Host ".\scripts\fr.ps1 -Action status"
    exit 0
  }
}
