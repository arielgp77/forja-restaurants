param()

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

function New-ForjaDirectory {
  param([Parameter(Mandatory=$true)][string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) {
    New-Item -ItemType Directory -Force -Path $Path | Out-Null
  }
}

function Write-JsonUtf8 {
  param(
    [Parameter(Mandatory=$true)][string]$Path,
    [Parameter(Mandatory=$true)]$Object
  )
  $dir = Split-Path -Parent $Path
  if ($dir) { New-ForjaDirectory -Path $dir }
  $json = $Object | ConvertTo-Json -Depth 12
  Set-Content -LiteralPath $Path -Encoding UTF8 -Value $json
}

function Get-RunStamp {
  return (Get-Date).ToString("yyyyMMdd_HHmmss")
}

function Get-ListenPid {
  param([int]$Port)
  try {
    return (Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction Stop |
      Select-Object -First 1 -ExpandProperty OwningProcess)
  } catch {
    return $null
  }
}

function Stop-PortProcess {
  param([int]$Port)
  $listenProcId = Get-ListenPid -Port $Port
  if ($listenProcId) {
    try {
      Stop-Process -Id $listenProcId -Force -ErrorAction Stop
      return [ordered]@{ stopped = $true; pid = $listenProcId }
    } catch {
      return [ordered]@{ stopped = $false; pid = $listenProcId; error = $_.Exception.Message }
    }
  }
  return [ordered]@{ stopped = $false; pid = $null }
}

function Remove-ForjaCaches {
  param([Parameter(Mandatory=$true)][string]$Root)
  $paths = @(
    "$Root\apps\web\.next",
    "$Root\apps\admin\.next",
    "$Root\.next"
  )

  $removed = @()
  foreach ($p in $paths) {
    if (Test-Path -LiteralPath $p) {
      Remove-Item -LiteralPath $p -Recurse -Force
      $removed += $p
    }
  }
  return $removed
}

function Start-ForjaWebServer {
  param(
    [Parameter(Mandatory=$true)][string]$Root,
    [int]$Port = 3000
  )

  $stamp = Get-RunStamp
  $logPath = "$Root\state\runner\logs\web_dev_$stamp.log"
  $pidPath = "$Root\state\runner\pids\web_dev_$stamp.pid"

  $command = @"
Set-Location -LiteralPath '$Root'
npm run dev:web *> '$logPath'
"@

  $proc = Start-Process -FilePath "powershell.exe" `
    -ArgumentList @("-NoLogo","-NoProfile","-ExecutionPolicy","Bypass","-Command",$command) `
    -PassThru -WindowStyle Hidden

  Set-Content -LiteralPath $pidPath -Encoding UTF8 -Value $proc.Id

  return [ordered]@{
    pid = $proc.Id
    logPath = $logPath
    pidPath = $pidPath
    started = (Get-Date).ToString("o")
  }
}

function Wait-ForjaServerReady {
  param(
    [int]$Port = 3000,
    [string]$LogPath,
    [int]$TimeoutSec = 60
  )

  $deadline = (Get-Date).AddSeconds($TimeoutSec)

  while ((Get-Date) -lt $deadline) {
    $listenProcId = Get-ListenPid -Port $Port
    if ($listenProcId) {
      return [ordered]@{ ok = $true; reason = "PortListening"; pid = $listenProcId }
    }

    if ($LogPath -and (Test-Path -LiteralPath $LogPath)) {
      $tail = Get-Content -LiteralPath $LogPath -Tail 40 -ErrorAction SilentlyContinue | Out-String
      if ($tail -match "Ready in") {
        return [ordered]@{ ok = $true; reason = "ReadyInLog"; pid = $null }
      }
      if ($tail -match "Failed to start server") {
        return [ordered]@{ ok = $false; reason = "FailedToStart"; pid = $null; log = $tail }
      }
    }

    Start-Sleep -Milliseconds 800
  }

  return [ordered]@{ ok = $false; reason = "Timeout"; pid = $null }
}

function Get-LogTail {
  param([string]$LogPath,[int]$Lines = 120)
  if ($LogPath -and (Test-Path -LiteralPath $LogPath)) {
    return (Get-Content -LiteralPath $LogPath -Tail $Lines -ErrorAction SilentlyContinue | Out-String)
  }
  return ""
}

function Get-WaveSequence {
  return @("W2-B01","W2-B02","W2-B03","W2-B04","W2-B05","W2-B06","W2-B07")
}

function Get-NextWaveId {
  param([string]$WaveId)
  $seq = Get-WaveSequence
  $idx = [Array]::IndexOf($seq, $WaveId)
  if ($idx -ge 0 -and $idx -lt ($seq.Count - 1)) {
    return $seq[$idx + 1]
  }
  return $null
}

function Get-WaveSpec {
  param(
    [Parameter(Mandatory=$true)][string]$WaveId,
    [Parameter(Mandatory=$true)][string]$Root,
    [int]$Port = 3000
  )

  $upper = $WaveId.ToUpperInvariant()

  switch ($upper) {
    "W2-B01" {
      return [ordered]@{
        WaveId = $upper
        Port = $Port
        Healthchecks = @(
          "$Root\scripts\forja_restaurants_w2_b01_real_page_healthcheck.ps1"
        )
        Routes = @(
          @{ Path = "/r/demo-pizzeria"; Expect = "Demo Pizzeria"; AllowLoose = $true }
        )
        ApiSmokes = @()
      }
    }

    "W2-B02" {
      $checks = @(
        "$Root\scripts\forja_restaurants_w2_b02_healthcheck.ps1"
      )
      $optional = "$Root\scripts\forja_restaurants_w2_menu_checkout_navfix_healthcheck.ps1"
      if (Test-Path -LiteralPath $optional) { $checks += $optional }

      return [ordered]@{
        WaveId = $upper
        Port = $Port
        Healthchecks = $checks
        Routes = @(
          @{ Path = "/r/demo-pizzeria/menu"; Expect = "Explora y agrega rápido"; AllowLoose = $true }
        )
        ApiSmokes = @()
      }
    }

    "W2-B03" {
      $checks = @(
        "$Root\scripts\forja_restaurants_w2_b03_healthcheck.ps1"
      )
      $optional = "$Root\scripts\forja_restaurants_w2_b03_hydration_fix_healthcheck.ps1"
      if (Test-Path -LiteralPath $optional) { $checks += $optional }

      return [ordered]@{
        WaveId = $upper
        Port = $Port
        Healthchecks = $checks
        Routes = @(
          @{ Path = "/r/demo-pizzeria/checkout"; Expect = "Quote del pedido"; AllowLoose = $true }
        )
        ApiSmokes = @(
          @{ Kind = "quote" },
          @{ Kind = "place-order" }
        )
      }
    }

    default {
      throw "Wave no soportada en v1: $WaveId"
    }
  }
}

function Invoke-Healthchecks {
  param([string[]]$Scripts)

  $results = @()

  foreach ($script in $Scripts) {
    if (-not (Test-Path -LiteralPath $script)) {
      $results += [ordered]@{
        script = $script
        ok = $false
        exitCode = 404
        output = "Healthcheck script missing."
      }
      continue
    }

    $output = & powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File $script 2>&1 | Out-String
    $exitCode = $LASTEXITCODE

    $results += [ordered]@{
      script = $script
      ok = ($exitCode -eq 0)
      exitCode = $exitCode
      output = $output.Trim()
    }
  }

  return $results
}

function Test-RouteHtmlHealthy {
  param([string]$Content)

  $badPatterns = @(
    "This page could not be found",
    "Build Error",
    "Runtime Error",
    "Module not found",
    "Cannot find module",
    "Expected unicode escape",
    "Missing <html> and <body> tags in the root layout"
  )

  foreach ($pattern in $badPatterns) {
    if ($Content -match [regex]::Escape($pattern)) {
      return $false
    }
  }

  return $true
}

function Invoke-RouteSmoke {
  param(
    [Parameter(Mandatory=$true)][string]$BaseUrl,
    [Parameter(Mandatory=$true)]$RouteSpec
  )

  $url = $BaseUrl.TrimEnd("/") + $RouteSpec.Path
  $expect = [string]$RouteSpec.Expect
  $allowLoose = $false

  if ($null -ne $RouteSpec.AllowLoose -and [bool]$RouteSpec.AllowLoose) {
    $allowLoose = $true
  }

  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 20
    $content = [string]$response.Content
    $statusOk = ($response.StatusCode -eq 200)
    $healthy = Test-RouteHtmlHealthy -Content $content

    $expectOk = $false
    if ([string]::IsNullOrWhiteSpace($expect)) {
      $expectOk = $statusOk
    } else {
      if ($content -match [regex]::Escape($expect)) {
        $expectOk = $true
      } elseif ($content.ToLowerInvariant().Contains($expect.ToLowerInvariant())) {
        $expectOk = $true
      }
    }

    $ok = $statusOk -and (($expectOk) -or ($allowLoose -and $healthy))

    return [ordered]@{
      kind = "route"
      url = $url
      ok = $ok
      statusCode = [int]$response.StatusCode
      expect = $expect
      expectOk = $expectOk
      healthy = $healthy
      allowLoose = $allowLoose
    }
  } catch {
    return [ordered]@{
      kind = "route"
      url = $url
      ok = $false
      statusCode = 0
      expect = $expect
      expectOk = $false
      healthy = $false
      allowLoose = $allowLoose
      error = $_.Exception.Message
    }
  }
}

function Invoke-QuoteSmoke {
  param([string]$BaseUrl)

  $uri = $BaseUrl.TrimEnd("/") + "/api/checkout/quote"
  $body = @{
    slug = "demo-pizzeria"
    fulfillment = "pickup"
    tipPercent = 15
    lines = @(
      @{ quantity = 1; priceValue = 16.99 },
      @{ quantity = 1; priceValue = 12.99 },
      @{ quantity = 1; priceValue = 3.49 }
    )
  } | ConvertTo-Json -Depth 6

  try {
    $response = Invoke-RestMethod -Uri $uri -Method Post -ContentType "application/json" -Body $body -TimeoutSec 20
    $ok = ($response.ok -eq $true) -and ($null -ne $response.totalLabel)

    return [ordered]@{
      kind = "api"
      name = "quote"
      url = $uri
      ok = $ok
      totalLabel = [string]$response.totalLabel
      etaLabel = [string]$response.etaLabel
      raw = $response
    }
  } catch {
    return [ordered]@{
      kind = "api"
      name = "quote"
      url = $uri
      ok = $false
      error = $_.Exception.Message
    }
  }
}

function Invoke-PlaceOrderSmoke {
  param(
    [string]$BaseUrl,
    $QuoteRaw
  )

  $uri = $BaseUrl.TrimEnd("/") + "/api/checkout/place-order"
  $body = @{
    slug = "demo-pizzeria"
    fulfillment = "pickup"
    customer = @{
      name = "Ariel Demo"
      phone = "6305550199"
      email = "ariel.demo@example.com"
      notes = ""
    }
    lines = @(
      @{ itemId = "pepperoni-pizza"; quantity = 1; priceValue = 16.99; priceLabel = "$16.99"; name = "Pepperoni Pizza" },
      @{ itemId = "10-piece-wings"; quantity = 1; priceValue = 12.99; priceLabel = "$12.99"; name = "10 Piece Wings" },
      @{ itemId = "2l-soda"; quantity = 1; priceValue = 3.49; priceLabel = "$3.49"; name = "2L Soda" }
    )
    quote = $QuoteRaw
  } | ConvertTo-Json -Depth 8

  try {
    $response = Invoke-RestMethod -Uri $uri -Method Post -ContentType "application/json" -Body $body -TimeoutSec 20
    $ok = ($response.ok -eq $true) -and ($response.orderNumber -match "^W")

    return [ordered]@{
      kind = "api"
      name = "place-order"
      url = $uri
      ok = $ok
      orderNumber = [string]$response.orderNumber
      totalLabel = [string]$response.totalLabel
      raw = $response
    }
  } catch {
    return [ordered]@{
      kind = "api"
      name = "place-order"
      url = $uri
      ok = $false
      error = $_.Exception.Message
    }
  }
}

function Get-BlockingPatterns {
  return @(
    "Failed to start server",
    "Module not found",
    "Runtime Error",
    "Build Error",
    "Cannot find module",
    "Expected unicode escape",
    "Missing <html> and <body> tags in the root layout",
    "EADDRINUSE",
    "is not allowed with `next/dynamic` in Server Components"
  )
}

function Get-WarningPatterns {
  return @(
    "hydration mismatch",
    "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties",
    "SECURITY WARNING: The SSL modes"
  )
}

function Invoke-ForjaWaveRun {
  param(
    [Parameter(Mandatory=$true)][string]$Root,
    [Parameter(Mandatory=$true)][string]$WaveId,
    [int]$Port = 3000,
    [switch]$StartWeb,
    [switch]$StopExisting,
    [switch]$CleanCaches,
    [switch]$RunSmoke,
    [switch]$AutoAdvance,
    [int]$TimeoutSec = 60
  )

  New-ForjaDirectory -Path "$Root\state\runner\logs"
  New-ForjaDirectory -Path "$Root\state\runner\reports"
  New-ForjaDirectory -Path "$Root\state\runner\pids"

  $spec = Get-WaveSpec -WaveId $WaveId -Root $Root -Port $Port
  $stamp = Get-RunStamp
  $reportPath = "$Root\state\runner\reports\wave_runner_$($spec.WaveId)_$stamp.json"
  $latestPath = "$Root\state\runner\reports\wave_runner_$($spec.WaveId)_latest.json"
  $baseUrl = "http://localhost:$Port"

  $report = [ordered]@{
    waveId = $spec.WaveId
    startedAt = (Get-Date).ToString("o")
    baseUrl = $baseUrl
    port = $Port
    success = $false
    actions = @()
    healthchecks = @()
    smokes = @()
    blockers = @()
    warnings = @()
    server = $null
    logTail = ""
  }

  if ($StopExisting) {
    $stopResult = Stop-PortProcess -Port $Port
    $report.actions += [ordered]@{ step = "stop-existing"; result = $stopResult }
  }

  if ($CleanCaches) {
    $removed = Remove-ForjaCaches -Root $Root
    $report.actions += [ordered]@{ step = "clean-caches"; removed = $removed }
  }

  $serverInfo = $null
  if ($StartWeb) {
    $serverInfo = Start-ForjaWebServer -Root $Root -Port $Port
    $wait = Wait-ForjaServerReady -Port $Port -LogPath $serverInfo.logPath -TimeoutSec $TimeoutSec
    $serverInfo.wait = $wait
    $report.server = $serverInfo
  } else {
    $report.server = [ordered]@{ mode = "reuse-existing"; pid = (Get-ListenPid -Port $Port) }
  }

  $report.healthchecks = Invoke-Healthchecks -Scripts $spec.Healthchecks

  if ($RunSmoke) {
    foreach ($route in $spec.Routes) {
      $report.smokes += Invoke-RouteSmoke -BaseUrl $baseUrl -RouteSpec $route
    }

    foreach ($api in $spec.ApiSmokes) {
      if ($api.Kind -eq "quote") {
        $quoteResult = Invoke-QuoteSmoke -BaseUrl $baseUrl
        $report.smokes += $quoteResult
      }

      if ($api.Kind -eq "place-order") {
        $quoteRaw = ($report.smokes | Where-Object { $_.kind -eq "api" -and $_.name -eq "quote" } | Select-Object -First 1).raw
        if ($quoteRaw) {
          $report.smokes += Invoke-PlaceOrderSmoke -BaseUrl $baseUrl -QuoteRaw $quoteRaw
        } else {
          $report.smokes += [ordered]@{
            kind = "api"
            name = "place-order"
            url = $baseUrl.TrimEnd("/") + "/api/checkout/place-order"
            ok = $false
            error = "Quote smoke failed; place-order skipped."
          }
        }
      }
    }
  }

  $logPath = $report.server.logPath
  $tail = Get-LogTail -LogPath $logPath -Lines 160
  $report.logTail = $tail

  foreach ($pattern in Get-BlockingPatterns) {
    if ($tail -match [regex]::Escape($pattern)) {
      $report.blockers += $pattern
    }
  }

  foreach ($pattern in Get-WarningPatterns) {
    if ($tail -match [regex]::Escape($pattern)) {
      $report.warnings += $pattern
    }
  }

  $healthOk = @($report.healthchecks | Where-Object { -not $_.ok }).Count -eq 0
  $smokeOk = @($report.smokes | Where-Object { -not $_.ok }).Count -eq 0
  $blockerFree = @($report.blockers).Count -eq 0

  $report.success = ($healthOk -and $smokeOk -and $blockerFree)
  $report.endedAt = (Get-Date).ToString("o")

  Write-JsonUtf8 -Path $reportPath -Object $report
  Write-JsonUtf8 -Path $latestPath -Object $report

  if ($report.success -and $AutoAdvance) {
    $markScript = "$Root\scripts\forja_restaurants_wave2_mark.ps1"
    if (Test-Path -LiteralPath $markScript) {
      & powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File $markScript -BlockId $spec.WaveId -Status "done" | Out-Null
      $nextWave = Get-NextWaveId -WaveId $spec.WaveId
      if ($nextWave) {
        & powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File $markScript -BlockId $nextWave -Status "in_progress" | Out-Null
      }
    }
  }

  return $report
}

function Write-RunnerSummary {
  param($Report)

  Write-Host ""
  Write-Host "FORJA WAVERUNNER V1.1" -ForegroundColor Cyan
  Write-Host "Wave: $($Report.waveId)"
  Write-Host "Success: $($Report.success)"
  Write-Host "Healthchecks failed: $(@($Report.healthchecks | Where-Object { -not $_.ok }).Count)"
  Write-Host "Smokes failed: $(@($Report.smokes | Where-Object { -not $_.ok }).Count)"
  Write-Host "Blockers: $(@($Report.blockers).Count)"
  Write-Host "Warnings: $(@($Report.warnings).Count)"
  Write-Host ""

  foreach ($h in $Report.healthchecks) {
    $color = if ($h.ok) { "Green" } else { "Red" }
    Write-Host "[HC] $($h.script) -> $($h.ok)" -ForegroundColor $color
  }

  foreach ($s in $Report.smokes) {
    $label = if ($s.kind -eq "route") { $s.url } else { $s.name }
    $color = if ($s.ok) { "Green" } else { "Red" }
    Write-Host "[SMOKE] $label -> $($s.ok)" -ForegroundColor $color
  }

  if (@($Report.blockers).Count -gt 0) {
    Write-Host ""
    Write-Host "Blockers:" -ForegroundColor Red
    $Report.blockers | Sort-Object -Unique | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  }

  if (@($Report.warnings).Count -gt 0) {
    Write-Host ""
    Write-Host "Warnings:" -ForegroundColor Yellow
    $Report.warnings | Sort-Object -Unique | ForEach-Object { Write-Host " - $_" -ForegroundColor Yellow }
  }
}

function Find-RepairRule {
  param($Report)

  $tail = [string]$Report.logTail

  if ($tail -match "EADDRINUSE") { return "port-in-use" }
  if ($tail -match "is not allowed with `next/dynamic` in Server Components") { return "checkout-dynamic-ssr" }
  if ($tail -match "Missing <html> and <body> tags in the root layout") { return "root-layout" }
  if ($tail -match "Can't resolve 'tailwindcss'") { return "tailwind-bootstrap" }

  return $null
}

function Invoke-RepairRule {
  param(
    [Parameter(Mandatory=$true)][string]$Root,
    [Parameter(Mandatory=$true)][string]$Rule,
    [int]$Port = 3000
  )

  switch ($Rule) {
    "port-in-use" {
      return Stop-PortProcess -Port $Port
    }

    "checkout-dynamic-ssr" {
      $script = "$Root\scripts\repairs\repair_checkout_page_server_import.ps1"
      if (-not (Test-Path -LiteralPath $script)) {
        return [ordered]@{ ok = $false; rule = $Rule; error = "Repair script missing." }
      }
      & powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File $script -Root $Root
      return [ordered]@{ ok = ($LASTEXITCODE -eq 0); rule = $Rule; script = $script }
    }

    "root-layout" {
      $script = "$Root\scripts\repairs\repair_root_layout_basic.ps1"
      if (-not (Test-Path -LiteralPath $script)) {
        return [ordered]@{ ok = $false; rule = $Rule; error = "Repair script missing." }
      }
      & powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File $script -Root $Root
      return [ordered]@{ ok = ($LASTEXITCODE -eq 0); rule = $Rule; script = $script }
    }

    "tailwind-bootstrap" {
      $script = "$Root\scripts\repairs\repair_tailwind_bootstrap_v4.ps1"
      if (-not (Test-Path -LiteralPath $script)) {
        return [ordered]@{ ok = $false; rule = $Rule; error = "Repair script missing." }
      }
      & powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File $script -Root $Root
      return [ordered]@{ ok = ($LASTEXITCODE -eq 0); rule = $Rule; script = $script }
    }

    default {
      return [ordered]@{ ok = $false; rule = $Rule; error = "Unknown rule." }
    }
  }
}
