import Link from "next/link";
import { requirePermission } from "@/lib/auth/server-auth";
import { getOrdersBoard } from "@/lib/db";

type SearchParams = Promise<{
  status?: string;
}>;

function badgeColor(status: string) {
  switch (status) {
    case "PLACED":
      return "#f59e0b";
    case "CONFIRMED":
      return "#38bdf8";
    case "PREPARING":
      return "#a78bfa";
    case "READY":
      return "#22c55e";
    case "COMPLETED":
      return "#10b981";
    case "CANCELLED":
      return "#ef4444";
    default:
      return "#94a3b8";
  }
}

export default async function OrdersPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const session = await requirePermission("orders:read");
  const resolved = await searchParams;
  const status = resolved.status ?? "ALL";

  const board = await getOrdersBoard({
    tenantSlug: session.tenantSlug,
    status
  });

  if (!board) {
    return <main><h1>Orders board not available</h1></main>;
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <section style={{ padding: 20, border: "1px solid #1e293b", borderRadius: 16, background: "#0f172a" }}>
        <h1 style={{ marginTop: 0 }}>Orders board</h1>
        <p style={{ color: "#94a3b8" }}>
          Restaurant: {board.restaurant.name}
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["ALL", "PLACED", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"].map((value) => (
            <Link
              key={value}
              href={`/orders?status=${value}`}
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                textDecoration: "none",
                background: status === value ? "#22c55e" : "#111827",
                color: status === value ? "#052e16" : "#e2e8f0",
                border: "1px solid #334155"
              }}
            >
              {value}
            </Link>
          ))}
        </div>
      </section>

      <section style={{ padding: 20, border: "1px solid #1e293b", borderRadius: 16, background: "#0f172a" }}>
        <div style={{ display: "grid", gap: 12 }}>
          {board.orders.length === 0 ? (
            <div style={{ color: "#94a3b8" }}>No orders found.</div>
          ) : (
            board.orders.map((order) => (
              <div
                key={order.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  gap: 16,
                  alignItems: "center",
                  padding: 16,
                  borderRadius: 12,
                  background: "#111827"
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{order.orderNumber}</div>
                  <div style={{ color: "#94a3b8" }}>
                    {order.customer.firstName} {order.customer.lastName ?? ""}
                  </div>
                  <div style={{ color: "#cbd5e1" }}>
                    {order.items.length} lines · ${Number(order.totalAmount).toFixed(2)}
                  </div>
                </div>

                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: 999,
                    background: badgeColor(order.status),
                    color: "#041014",
                    fontWeight: 700
                  }}
                >
                  {order.status}
                </div>

                <Link
                  href={`/orders/${order.id}`}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    textDecoration: "none",
                    background: "#22c55e",
                    color: "#052e16",
                    fontWeight: 700
                  }}
                >
                  Open
                </Link>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}