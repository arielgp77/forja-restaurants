param(
  [Parameter(Mandatory=$true)][string]$Slug
)

$ErrorActionPreference="Stop"
$root="C:\Users\ariel\LaForja\forja-restaurants"
$manifest=Join-Path $root "data\clients\$Slug.client.yaml"
$out=Join-Path $root "apps\web\app\r\$Slug"

if(!(Test-Path $manifest)){ throw "No existe manifest: $manifest" }

New-Item -ItemType Directory -Force -Path $out,(Join-Path $out "menu"),(Join-Path $out "checkout") | Out-Null

$raw=Get-Content $manifest -Raw

function Val($key){
  $m=[regex]::Match($raw,"(?m)^$key:\s*""?(.*?)""?\s*$")
  if($m.Success){ return $m.Groups[1].Value.Trim() }
  return ""
}

$name=Val "name"
$tagline=Val "tagline"
$phone=Val "phone"
$address=Val "address"
$hours=Val "hours"
$heroTitle=Val "heroTitle"
$heroDescription=Val "heroDescription"
$heroImage=Val "heroImage"
$logo=Val "logo"

if(!$name){ throw "Manifest inválido: falta name" }
if(!$heroImage){ $heroImage="/assets/positanos/hero.jpg" }
if(!$logo){ $logo="/assets/positanos/logo.jpg" }

$page=@"
export default function ClientHomePage() {
  return (
    <main className="min-h-screen bg-[#f7f1e8] text-neutral-950">
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="$logo" className="h-14 w-14 rounded-full object-contain" />
          <div>
            <h1 className="text-xl font-black">$name</h1>
            <p className="text-sm text-neutral-500">$tagline</p>
          </div>
        </div>
        <a href="/r/$Slug/menu" className="rounded-full bg-black px-5 py-3 text-sm font-black text-white">Ver menú</a>
      </header>

      <section className="relative min-h-[72vh] overflow-hidden bg-black text-white">
        <img src="$heroImage" className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-24">
          <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em]">
            Local Order Demo
          </div>
          <h2 className="max-w-3xl text-6xl font-black leading-none">$heroTitle</h2>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-white/85">$heroDescription</p>
          <div className="mt-8 flex gap-4">
            <a href="/r/$Slug/menu" className="rounded-full bg-red-600 px-8 py-4 font-black text-white">ORDER NOW</a>
            <a href="/r/$Slug/menu" className="rounded-full border border-white/40 px-8 py-4 font-black text-white">VIEW MENU</a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">Contacto</p>
          <h2 className="mt-2 text-3xl font-black">$name</h2>
          <p className="mt-3">$phone · $address</p>
          <p className="mt-1 text-neutral-500">$hours</p>
        </div>
      </section>
    </main>
  );
}
"@

$menu=@"
export default function ClientMenuPage() {
  const items = [
    ["Thin Cheese Slice", "$4.50", "Classic slice ready from the counter."],
    ["Thin Pepperoni Slice", "$4.50", "Pepperoni, cheese and red sauce."],
    ["Double Dough Cheese Slice", "$5.00", "Thicker bite, more comfort."],
    ["Deep Dish Slice", "$6.00", "Heavy, cheesy and premium."]
  ];

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-neutral-950">
      <section className="relative overflow-hidden bg-black text-white">
        <img src="$heroImage" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />
        <div className="relative mx-auto max-w-6xl px-6 py-16">
          <a href="/r/$Slug" className="text-white/70">← Back to home</a>
          <h1 className="mt-8 text-6xl font-black">Menu</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">$heroDescription</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-5 md:grid-cols-2">
          {items.map(([n,p,d]) => (
            <div key={n} className="rounded-[2rem] bg-white p-6 shadow-sm">
              <div className="flex justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">{n}</h2>
                  <p className="mt-2 text-neutral-600">{d}</p>
                </div>
                <p className="font-black text-red-600">{p}</p>
              </div>
              <button className="mt-5 w-full rounded-full bg-black px-5 py-3 font-black text-white">ADD TO ORDER</button>
            </div>
          ))}
        </div>
      </section>

      <div className="sticky bottom-0 bg-white/95 px-6 py-4 shadow-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <strong>Ready for pickup</strong>
          <a href="/r/$Slug/checkout" className="rounded-full bg-red-600 px-6 py-3 font-black text-white">Continue to Checkout</a>
        </div>
      </div>
    </main>
  );
}
"@

$checkout=@"
export default function ClientCheckoutPage() {
  return (
    <main className="min-h-screen bg-[#f7f1e8] text-neutral-950">
      <section className="relative bg-black text-white">
        <img src="$heroImage" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative mx-auto max-w-5xl px-6 py-16">
          <a href="/r/$Slug/menu" className="text-white/70">← Back to menu</a>
          <h1 className="mt-8 text-6xl font-black">Pickup order preview</h1>
          <p className="mt-4 text-white/75">Simple branded checkout preview, ready for Stripe or Square after approval.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 py-10 md:grid-cols-[1.4fr_.8fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">Customer info</h2>
          {["Name","Phone","Pickup notes"].map((label) => (
            <label key={label} className="mt-4 grid gap-2">
              <span className="font-bold text-neutral-600">{label}</span>
              <input className="rounded-2xl border px-4 py-3" placeholder={label} />
            </label>
          ))}
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">Order summary</h2>
          <div className="mt-5 space-y-3">
            <div className="flex justify-between"><span>Popular item</span><strong>$4.50</strong></div>
            <div className="flex justify-between"><span>Tax estimate</span><strong>$0.40</strong></div>
            <div className="flex justify-between text-xl"><strong>Total</strong><strong>$4.90</strong></div>
          </div>
          <button className="mt-6 w-full rounded-full bg-red-600 px-6 py-4 font-black text-white">PLACE ORDER</button>
        </div>
      </section>
    </main>
  );
}
"@

[System.IO.File]::WriteAllText((Join-Path $out "page.tsx"),$page,[System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText((Join-Path $out "menu\page.tsx"),$menu,[System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText((Join-Path $out "checkout\page.tsx"),$checkout,[System.Text.UTF8Encoding]::new($false))

Write-Host "CLIENT DEMO BUILT => /r/$Slug"
