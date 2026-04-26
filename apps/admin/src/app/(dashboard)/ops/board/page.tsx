import Link from "next/link";
import { requirePermission } from "@/lib/auth/server-auth";
import { getOpsBoard } from "@/lib/db";

const columns = [
  { key: "PLACED", title: "Placed" },
  { key: "CONFIRMED", title: "Confirmed" },
  { key: "PREPARING", title: "Preparing" },
  { key: "READY", title: "Ready" }
] as const;

type SearchParams = Promise<{ error?: string }>;

function nextActions(status: string): string[] {
  switch (status) {
    case "PLACED":
      return ["CONFIRMED", "CANCELLED"];
    case "CONFIRMED":
      return ["PREPARING", "CANCELLED"];
    case "PREPARING":
      return ["READY", "CANCELLED"];
    case "READY":
      return ["COMPLETED"];
    default:
      return [];
  }
}

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

export default async function OpsBoardPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const session = await requirePermission("orders:read");
  const qp = await searchParams;
  const board = await getOpsBoard(session.tenantSlug);

  if (!board) {
    return <main><h1>Ops board not available</h1></main>;
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {qp.error ? (
        <div style={{ padding: 12, borderRadius: 12, background: "#7f1d1d", color: "#f8fafc", border: "1px solid #ef4444" }}>
          Blocked: {qp.error}
        </div>
      ) : null}

      <section style={{ padding: 20, border: "1px solid #1e293b", borderRadius: 16, background: "#0f172a" }}>
        <h1 style={{ marginTop: 0 }}>Kitchen / Pickup Board</h1>
        <p style={{ color: "#94a3b8" }}>
          Live operational view for {board.restaurant.name}
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(240px, 1fr))",
          gap: 16,
          alignItems: "start"
        }}
      >
        {columns.map((column) => {
          const columnOrders = board.orders.filter((order) => order.status === column.key);

          return (
            <section
              key={column.key}
              style={{
                display: "grid",
                gap: 12,
                padding: 16,
                borderRadius: 16,
                background: "#0f172a",
                border: "1px solid #1e293b",
                minHeight: 300
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 20 }}>{column.title}</div>

              {columnOrders.length === 0 ? (
                <div style={{ color: "#64748b" }}>No orders</div>
              ) : (
                columnOrders.map((order) => (
                  <article key={order.id} style={cardStyle()}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                      <strong>{order.orderNumber}</strong>
                      <span>${Number(order.totalAmount).toFixed(2)}</span>
                    </div>

                    <div style={{ color: "#cbd5e1" }}>
                      {order.customer.firstName} {order.customer.lastName ?? ""}
                    </div>

                    <div style={{ color: "#94a3b8" }}>
                      {order.items.map((item) => `${item.nameSnapshot} x${item.quantity}`).join(" · ")}
                    </div>

                    <div style={{ color: "#93c5fd" }}>
                      Pickup: {order.fulfillment?.pickupName ?? "n/a"}
                    </div>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {nextActions(order.status).map((action) => (
                        <form key={action} action="/api/internal/orders/status-quick" method="POST">
                          <input type="hidden" name="orderId" value={order.id} />
                          <input type="hidden" name="nextStatus" value={action} />
                          <input type="hidden" name="redirectTo" value="/ops/board" />
                          <button
                            type="submit"
                            style={{
                              padding: "8px 12px",
                              borderRadius: 8,
                              border: 0,
                              background: "#22c55e",
                              color: "#052e16",
                              fontWeight: 700
                            }}
                          >
                            {action}
                          </button>
                        </form>
                      ))}

                      <Link
                        href={`/orders/${order.id}`}
                        style={{
                          padding: "8px 12px",
                          borderRadius: 8,
                          textDecoration: "none",
                          background: "#0b1220",
                          color: "#e2e8f0",
                          border: "1px solid #334155"
                        }}
                      >
                        Detail
                      </Link>
                    </div>
                  </article>
                ))
              )}
            </section>
          );
        })}
      </section>
    </div>
  );
}