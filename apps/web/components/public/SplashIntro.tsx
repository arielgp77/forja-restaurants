export function SplashIntro({
  logoUrl,
  restaurantName,
}: {
  logoUrl: string;
  restaurantName: string;
}) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505] animate-[splashFade_2.05s_ease-in-out_forwards]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,.28),transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,120,62,.18),transparent_35%,rgba(255,255,255,.08))]" />

      <div className="relative flex flex-col items-center gap-5 animate-[logoPop_1.45s_ease-out_forwards]">
        <div className="rounded-full bg-white p-5 shadow-2xl ring-4 ring-red-600/90">
          <img src={logoUrl} alt={restaurantName} className="h-28 w-28 rounded-full object-contain" />
        </div>

        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-red-500">
            Pizza by the Slice
          </p>
          <h1 className="mt-2 text-3xl font-black text-white drop-shadow">
            {restaurantName}
          </h1>
          <p className="mt-2 text-sm font-semibold text-white/70">
            Fresh slices · Deep dish · Italian ice
          </p>
        </div>
      </div>

      <style>{`
        @keyframes splashFade {
          0% { opacity: 1; visibility: visible; }
          78% { opacity: 1; visibility: visible; }
          100% { opacity: 0; visibility: hidden; }
        }
        @keyframes logoPop {
          0% { transform: scale(.72) translateY(14px); opacity: 0; filter: blur(8px); }
          52% { transform: scale(1.08) translateY(0); opacity: 1; filter: blur(0); }
          100% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0); }
        }
      `}</style>
    </div>
  );
}