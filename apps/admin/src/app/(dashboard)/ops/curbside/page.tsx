import { requirePermission } from "@/lib/auth/server-auth";
import { getCurbsideBoard } from "@/lib/db";

type SearchParams = Promise<{ arrival?: string; error?: string }>;

function cardStyle() {
  return {
    padding: 16,
    borderRadius: 14,
    background: "#111827",
    border: "1px solid #1f2937",
    display: "grid",
    gap: 10
  } as const;
}

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

export default async function CurbsidePage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const session = await requirePermission("orders:read");
  const qp = await searchParams;
  const board = await getCurbsideBoard(session.tenantSlug);

  if (!board) {
    return <main><h1>Curbside board not available</h1></main>;
  }

  const readyOrders = board.orders.filter((x) => x.status === "READY");
  const completedOrders = board.orders.filter((x) => x.status === "COMPLETED");

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {qp.arrival ? (
        <div style={{ padding: 12, borderRadius: 12, background: "#14532d", color: "#f8fafc", border: "1px solid #22c55e" }}>
          Mock arrival registered.
        </div>
      ) : null}
      {qp.error ? (
        <div style={{ padding: 12, borderRadius: 12, background: "#7f1d1d", color: "#f8fafc", border: "1px solid #ef4444" }}>
          Blocked: {qp.error}
        </div>
      ) : null}

      <section style={{ padding: 20, border: "1px solid #1e293b", borderRadius: 16, background: "#0f172a" }}>
        <h1 style={{ marginTop: 0 }}>Curbside arrival mock</h1>
        <p style={{ color: "#94a3b8" }}>
          Simula un SMS inbound para registrar llegada en curbside.
        </p>

        <form action="/api/internal/mock/sms-arrival" method="POST" style={{ display: "grid", gap: 12 }}>
          <label>
            <div>Order number</div>
            <input name="orderNumber" defaultValue="D1002" style={inputStyle()} />
          </label>

          <label>
            <div>From phone</div>
            <input name="fromPhone" defaultValue="6305550199" style={inputStyle()} />
          </label>

          <label>
            <div>Curbside spot</div>
            <input name="curbsideSpot" defaultValue="3" style={inputStyle()} />
          </label>

          <label>
            <div>Car color</div>
            <input name="carColor" defaultValue="Blue" style={inputStyle()} />
          </label>

          <label>
            <div>Car model</div>
            <input name="carModel" defaultValue="Honda Civic" style={inputStyle()} />
          </label>

          <label>
            <div>Mock body</div>
            <input name="body" defaultValue="HERE D1002 SPOT 3 BLUE HONDA CIVIC" style={inputStyle()} />
          </label>

          <button type="submit" style={{ padding: 12, borderRadius: 10, border: 0, background: "#22c55e", color: "#052e16", fontWeight: 700 }}>
            Register mock arrival
          </button>
        </form>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <section style={{ display: "grid", gap: 12, padding: 16, borderRadius: 16, background: "#0f172a", border: "1px solid #1e293b" }}>
          <h2 style={{ margin: 0 }}>Ready curbside</h2>

          {readyOrders.length === 0 ? (
            <div style={{ color: "#64748b" }}>No ready curbside orders</div>
          ) : (
            readyOrders.map((order) => (
              <article key={order.id} style={cardStyle()}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <strong>{order.orderNumber}</strong>
                  <span>${Number(order.totalAmount).toFixed(2)}</span>
                </div>

                <div>{order.customer.firstName} {order.customer.lastName ?? ""}</div>
                <div style={{ color: "#93c5fd" }}>
                  Pickup phone: {order.fulfillment?.pickupPhone ?? "n/a"}
                </div>
                <div style={{ color: "#94a3b8" }}>
                  Arrived: {order.fulfillment?.arrivalNotifiedAt ? new Date(order.fulfillment.arrivalNotifiedAt).toLocaleString() : "waiting"}
                </div>
                <div style={{ color: "#cbd5e1" }}>
                  Spot: {order.fulfillment?.curbsideSpot ?? "-"} · Car: {order.fulfillment?.carColor ?? "-"} {order.fulfillment?.carModel ?? ""}
                </div>

                <form action="/api/internal/orders/status-quick" method="POST">
                  <input type="hidden" name="orderId" value={order.id} />
                  <input type="hidden" name="nextStatus" value="COMPLETED" />
                  <input type="hidden" name="redirectTo" value="/ops/curbside" />
                  <button type="submit" style={{ padding: "8px 12px", borderRadius: 8, border: 0, background: "#22c55e", color: "#052e16", fontWeight: 700 }}>
                    Mark handoff complete
                  </button>
                </form>
              </article>
            ))
          )}
        </section>

        <section style={{ display: "grid", gap: 12, padding: 16, borderRadius: 16, background: "#0f172a", border: "1px solid #1e293b" }}>
          <h2 style={{ margin: 0 }}>Completed curbside</h2>

          {completedOrders.length === 0 ? (
            <div style={{ color: "#64748b" }}>No completed curbside orders</div>
          ) : (
            completedOrders.map((order) => (
              <article key={order.id} style={cardStyle()}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <strong>{order.orderNumber}</strong>
                  <span>${Number(order.totalAmount).toFixed(2)}</span>
                </div>

                <div>{order.customer.firstName} {order.customer.lastName ?? ""}</div>
                <div style={{ color: "#94a3b8" }}>
                  Arrival: {order.fulfillment?.arrivalNotifiedAt ? new Date(order.fulfillment.arrivalNotifiedAt).toLocaleString() : "n/a"}
                </div>
                <div style={{ color: "#cbd5e1" }}>
                  Spot: {order.fulfillment?.curbsideSpot ?? "-"} · Car: {order.fulfillment?.carColor ?? "-"} {order.fulfillment?.carModel ?? ""}
                </div>
              </article>
            ))
          )}
        </section>
      </section>
    </div>
  );
}