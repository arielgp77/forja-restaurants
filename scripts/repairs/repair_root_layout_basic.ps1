param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$layout = "$Root\apps\web\app\layout.tsx"
$globals = "$Root\apps\web\app\globals.css"

if (-not (Test-Path -LiteralPath $globals)) {
  $globalsContent = @'
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
  Set-Content -LiteralPath $globals -Encoding UTF8 -Value $globalsContent
}

$content = @'
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forja Restaurants",
  description: "Forja Restaurants web app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
'@

Set-Content -LiteralPath $layout -Encoding UTF8 -Value $content
Write-Host "repair_root_layout_basic OK" -ForegroundColor Green
