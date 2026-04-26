import { requirePermission } from "@/lib/auth/server-auth";
import { getPricingPolicy } from "@/lib/db";

function inputStyle() {
  return {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #334155",
    background: "#020617",
    color: "#e2e8f0",
  } as const;
}

type SearchParams = Promise<{ saved?: string }>;

export default async function PricingPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const session = await requirePermission("settings:read");
  const qp = await searchParams;
  const data = await getPricingPolicy(session.tenantSlug);

  if (!data) {
    return <main><h1>Pricing policy unavailable</h1></main>;
  }

  const p = data.policy;

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {qp.saved ? (
        <div style={{ padding: 12, borderRadius: 12, background: "#14532d", color: "#f8fafc", border: "1px solid #22c55e" }}>
          Pricing policy saved.
        </div>
      ) : null}

      <section style={{ padding: 20, border: "1px solid #1e293b", borderRadius: 16, background: "#0f172a" }}>
        <h1 style={{ marginTop: 0 }}>Pricing policy</h1>
        <p style={{ color: "#94a3b8" }}>
          Restaurant: {data.restaurant.name}
        </p>

        <form action="/api/internal/pricing/save" method="POST" style={{ display: "grid", gap: 12 }}>
          <label>
            <div>Tax rate percent</div>
            <input name="taxRatePercent" defaultValue={String(p.taxRatePercent)} style={inputStyle()} />
          </label>

          <label>
            <div>Service fee type</div>
            <select name="serviceFeeType" defaultValue={p.serviceFeeType} style={inputStyle()}>
              <option value="fixed">fixed</option>
              <option value="percent">percent</option>
            </select>
          </label>

          <label>
            <div>Service fee value</div>
            <input name="serviceFeeValue" defaultValue={String(p.serviceFeeValue)} style={inputStyle()} />
          </label>

          <label>
            <div>Suggested tip 1</div>
            <input name="tip1" defaultValue={String(p.suggestedTipPercents[0] ?? 15)} style={inputStyle()} />
          </label>

          <label>
            <div>Suggested tip 2</div>
            <input name="tip2" defaultValue={String(p.suggestedTipPercents[1] ?? 18)} style={inputStyle()} />
          </label>

          <label>
            <div>Suggested tip 3</div>
            <input name="tip3" defaultValue={String(p.suggestedTipPercents[2] ?? 20)} style={inputStyle()} />
          </label>

          <label>
            <div>Driver base pay estimate</div>
            <input name="driverBasePay" defaultValue={String(p.driverBasePay)} style={inputStyle()} />
          </label>

          <label>
            <div>Tips pass through</div>
            <select name="tipsPassThrough" defaultValue={p.tipsPassThrough ? "true" : "false"} style={inputStyle()}>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </label>

          <button type="submit" style={{ padding: 12, borderRadius: 10, border: 0, background: "#22c55e", color: "#052e16", fontWeight: 700 }}>
            Save pricing policy
          </button>
        </form>
      </section>
    </div>
  );
}