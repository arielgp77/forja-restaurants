import { requirePermission } from "@/lib/auth/server-auth";
import { getPayoutLedgerBase } from "@/lib/db";

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export default async function PayoutsPage() {
  const session = await requirePermission("orders:read");
  const data = await getPayoutLedgerBase(session.tenantSlug);

  if (!data) {
    return <main><h1>Payout ledger unavailable</h1></main>;
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <section style={{ padding: 20, border: "1px solid #1e293b", borderRadius: 16, background: "#0f172a" }}>
        <h1 style={{ marginTop: 0 }}>Payout ledger base</h1>
        <p style={{ color: "#94a3b8" }}>
          Restaurant: {data.restaurant.name}
        </p>
        <ul style={{ color: "#cbd5e1" }}>
          <li>Tax rate: {data.policy.taxRatePercent}%</li>
          <li>Service fee: {data.policy.serviceFeeType} {data.policy.serviceFeeValue}</li>
          <li>Suggested tips: {data.policy.suggestedTipPercents.join(", ")}</li>
          <li>Driver base pay estimate: {money(data.policy.driverBasePay)}</li>
          <li>Tips pass through: {String(data.policy.tipsPassThrough)}</li>
        </ul>
      </section>

      <section style={{ padding: 20, border: "1px solid #1e293b", borderRadius: 16, background: "#0f172a" }}>
        <h2 style={{ marginTop: 0 }}>Recent order economics</h2>

        <div style={{ display: "grid", gap: 10 }}>
          {data.rows.map((row) => (
            <div key={row.id} style={{ padding: 14, borderRadius: 12, background: "#111827", display: "grid", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <strong>{row.orderNumber}</strong>
                <span>{row.status}</span>
              </div>
              <div>{row.customerName}</div>
              <div style={{ color: "#94a3b8" }}>
                subtotal {money(row.subtotal)} · tax {money(row.tax)} · service fee {money(row.serviceFee)} · tip {money(row.tip)} · total {money(row.total)}
              </div>
              <div style={{ color: "#93c5fd" }}>
                driver base est {money(row.driverBaseEstimate)} · tip to driver est {money(row.tipToDriverEstimate)} · platform net est {money(row.platformNetEstimate)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}