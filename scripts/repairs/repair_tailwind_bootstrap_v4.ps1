param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

Set-Location -LiteralPath $Root

npm install -D tailwindcss @tailwindcss/postcss postcss

$postcss = @'
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
'@

$globals = @'
@import "tailwindcss";

html, body {
  margin: 0;
  padding: 0;
}

body {
  background: #f5f5f5;
  color: #111827;
  font-family: Arial, Helvetica, sans-serif;
}
'@

Set-Content -LiteralPath "$Root\postcss.config.mjs" -Encoding UTF8 -Value $postcss
Set-Content -LiteralPath "$Root\apps\web\app\globals.css" -Encoding UTF8 -Value $globals
Write-Host "repair_tailwind_bootstrap_v4 OK" -ForegroundColor Green
