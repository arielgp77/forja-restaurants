param()

$script:ForjaRestaurantsRoot = $PSScriptRoot

function Get-ForjaProjectConfig {
  [ordered]@{
    ProjectName = "forja-restaurants"
    Root = $script:ForjaRestaurantsRoot
    DefaultPort = 3000
    StartCommand = "npm run dev:web"
    StateRoot = Join-Path $script:ForjaRestaurantsRoot "state\runner"
    CachePaths = @(
      (Join-Path $script:ForjaRestaurantsRoot "apps\web\.next"),
      (Join-Path $script:ForjaRestaurantsRoot "apps\admin\.next"),
      (Join-Path $script:ForjaRestaurantsRoot ".next")
    )
    MarkScript = Join-Path $script:ForjaRestaurantsRoot "scripts\forja_restaurants_wave2_mark.ps1"
    StatusScript = Join-Path $script:ForjaRestaurantsRoot "scripts\forja_restaurants_wave2_status.ps1"
  }
}

function Get-ForjaWaveSequence {
  @("W2-B01","W2-B02","W2-B03","W2-B04","W2-B05","W2-B06","W2-B07")
}

function Get-ForjaWaveSpec {
  param(
    [Parameter(Mandatory = $true)][string]$WaveId,
    [Parameter(Mandatory = $true)][string]$Root,
    [int]$Port = 3000
  )

  $upper = $WaveId.ToUpperInvariant()

  switch ($upper) {
    "W2-B01" {
      [ordered]@{
        WaveId = $upper
        Port = $Port
        Healthchecks = @(
          (Join-Path $Root "scripts\forja_restaurants_w2_b01_real_page_healthcheck.ps1")
        )
        Routes = @(
          @{ Path = "/r/demo-pizzeria"; Expect = "Demo Pizzeria"; AllowLoose = $true }
        )
        ApiSmokes = @()
      }
    }

    "W2-B02" {
      $checks = @(
        (Join-Path $Root "scripts\forja_restaurants_w2_b02_healthcheck.ps1")
      )

      $optional = Join-Path $Root "scripts\forja_restaurants_w2_menu_checkout_navfix_healthcheck.ps1"
      if (Test-Path -LiteralPath $optional) { $checks += $optional }

      [ordered]@{
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
        (Join-Path $Root "scripts\forja_restaurants_w2_b03_healthcheck.ps1")
      )

      $optional = Join-Path $Root "scripts\forja_restaurants_w2_b03_hydration_fix_healthcheck.ps1"
      if (Test-Path -LiteralPath $optional) { $checks += $optional }

      [ordered]@{
        WaveId = $upper
        Port = $Port
        Healthchecks = $checks
        Routes = @(
          @{ Path = "/r/demo-pizzeria/checkout"; Expect = "Checkout"; AllowLoose = $true }
        )
        ApiSmokes = @(
          @{
            Name = "quote"
            Method = "POST"
            Path = "/api/checkout/quote"
            Body = @{
              slug = "demo-pizzeria"
              fulfillment = "pickup"
              tipPercent = 15
              lines = @(
                @{ quantity = 1; priceValue = 16.99 },
                @{ quantity = 1; priceValue = 12.99 },
                @{ quantity = 1; priceValue = 3.49 }
              )
            }
            ExpectOk = $true
            ExpectNonEmpty = @("totalLabel", "etaLabel")
          },
          @{
            Name = "place-order"
            Method = "POST"
            Path = "/api/checkout/place-order"
            Body = @{
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
              quote = @{
                ok = $true
                subtotal = 33.47
                tax = 2.68
                fee = 0
                tip = 5.02
                total = 41.17
                subtotalLabel = "$33.47"
                taxLabel = "$2.68"
                feeLabel = "$0.00"
                tipLabel = "$5.02"
                totalLabel = "$41.17"
                etaMinutes = 20
                etaLabel = "20-30 min"
              }
            }
            ExpectOk = $true
            ExpectNonEmpty = @("orderNumber", "totalLabel")
            ExpectRegex = [ordered]@{
              orderNumber = "^W"
            }
          }
        )
      }
    }

    default {
      throw "Wave no soportada por forja-restaurants adapter: $WaveId"
    }
  }
}

function Get-ForjaRepairMap {
  [ordered]@{
    "checkout-dynamic-ssr" = (Join-Path $script:ForjaRestaurantsRoot "scripts\repairs\repair_checkout_page_server_import.ps1")
    "root-layout" = (Join-Path $script:ForjaRestaurantsRoot "scripts\repairs\repair_root_layout_basic.ps1")
    "tailwind-bootstrap" = (Join-Path $script:ForjaRestaurantsRoot "scripts\repairs\repair_tailwind_bootstrap_v4.ps1")
  }
}

function Get-ForjaRepairRule {
  param($Report)

  $tail = [string]$Report.logTail

  if ($tail -match "EADDRINUSE") { return "port-in-use" }
  if ($tail -match "is not allowed with `next/dynamic` in Server Components") { return "checkout-dynamic-ssr" }
  if ($tail -match "Missing <html> and <body> tags in the root layout") { return "root-layout" }
  if ($tail -match "Can't resolve 'tailwindcss'") { return "tailwind-bootstrap" }

  $null
}
