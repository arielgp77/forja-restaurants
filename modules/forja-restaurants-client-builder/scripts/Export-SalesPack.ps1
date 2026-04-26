param(
  [Parameter(Mandatory=$true)][string]$Slug,
  [string]$PublicUrl="https://forja-restaurants.vercel.app"
)

$ErrorActionPreference="Stop"
$root="C:\Users\ariel\LaForja\forja-restaurants"
$out=Join-Path $root "data\reports\client-builder\$Slug"
New-Item -ItemType Directory -Force -Path $out | Out-Null

$manifest=Join-Path $root "data\clients\$Slug.client.yaml"
$raw=Get-Content $manifest -Raw

function Val($key){
  $m=[regex]::Match($raw,"(?m)^$key:\s*""?(.*?)""?\s*$")
  if($m.Success){ return $m.Groups[1].Value.Trim() }
  return ""
}

$name=Val "name"
$link="$PublicUrl/r/$Slug"

@"
# Sales Pack — $name

## Link demo
$link

## Mensaje corto
Hola, estoy empezando un servicio para ayudar negocios locales con páginas de pedido más claras y bonitas.

Vi que su negocio puede vender mejor si el cliente entiende rápido qué pedir desde el celular, así que armé una demo rápida.

No es compromiso. Solo quería enseñártela porque creo que puede ayudar a que la gente pida más fácil.

## Oferta fundador
- Setup: `$149
- Mensualidad: `$39/mes los primeros 3 meses
- Después: `$79/mes
- Sin contrato largo

## Incluye
- Página pública
- Menú visual
- Checkout demo
- Link público
- Cambios básicos
- Preparado para pagos reales después

## Checklist presentación
- Abrir demo en celular
- Enseñar home
- Enseñar menú
- Enseñar checkout
- Callarse y escuchar reacción
"@ | Set-Content -Path (Join-Path $out "sales_pitch.md") -Encoding UTF8

@"
{
  "slug": "$Slug",
  "name": "$name",
  "url": "$link",
  "generated_at": "$(Get-Date -Format s)",
  "status": "sales_pack_ready"
}
"@ | Set-Content -Path (Join-Path $out "closeout.json") -Encoding UTF8

Write-Host "SALES PACK OK => $out"
