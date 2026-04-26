param(
  [string]$Root = "C:\Users\ariel\LaForja\forja-restaurants"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Off

$target = "$Root\apps\web\app\r\[slug]\checkout\page.tsx"
$dir = Split-Path -Parent $target
if ($dir) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }

$content = @'
import { notFound } from "next/navigation";
import { buildCheckoutPageViewModel } from "../../../../lib/checkout/loader";
import { CheckoutClientShell } from "../../../../components/checkout/CheckoutClientShell";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vm = await buildCheckoutPageViewModel(slug);

  if (!vm) {
    notFound();
  }

  return <CheckoutClientShell vm={vm} />;
}
'@

Set-Content -LiteralPath $target -Encoding UTF8 -Value $content
Write-Host "repair_checkout_page_server_import OK" -ForegroundColor Green
