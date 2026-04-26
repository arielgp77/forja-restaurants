import Link from "next/link";
import { requirePermission } from "@/lib/auth/server-auth";
import { getAdminOrderDetail } from "@/lib/db";

type PageProps = {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ updated?: string; error?: string }>;
};

const NEXT_STATUS_OPTIONS = [
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "COMPLETED",
  "CANCELLED"
] as const;

function banner(text: string, tone: "ok" | "error") {
  return {
    padding: 12,
    borderRadius: 12,
    background: tone === "ok" ? "#14532d" : "#7f1d1d",
    color: "#f8fafc",
    border: tone === "ok" ? "1px solid #22c55e" : "1px solid #ef4444"
  } as const;
}

export default async function OrderDetailPage({ params, searchParams }: PageProps) {
  const session = await requirePermission("orders:read");
  const { orderId } = await params;
  const qp = await searchParams;

  const order = await getAdminOrderDetail({
    tenantSlug: session.tenantSlug,
    orderId
  });

  if (!order) {
    return (
      <main>
        <h1>Order not found</h1>
        <p>
          <Link href="/orders" style={{ color: "#22c55e" }}>
            Back to orders
          </Link>
        </p>
      </main>
    );
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {qp.updated ? <div style={banner("Status updated.", "ok")}>Status updated.</div> : null}
      {qp.error ? <div style={banner(`Blocked: ${qp.error}`, "error")}>Blocked: {qp.error}</div> : null}

      <section style={{ padding: 20, border: "1px solid #1e293b", borderRadius: 16, background: "#0f172a" }}>
        <h1 style={{ marginTop: 0 }}>Order {order.orderNumber}</h1>
        <div style={{ display: "grid", gap: 8 }}>
          <div><strong>Status:</strong> {order.status}</div>
          <div><strong>Customer:</strong> {order.customer.firstName} {order.customer.lastName ?? ""}</div>
          <div><strong>Email:</strong> {order.customer.email ?? "n/a"}</div>
          <div><strong>Phone:</strong> {order.customer.phone ?? "n/a"}</div>
          <div><strong>Total:</strong> ${Number(order.totalAmount).toFixed(2)}</div>
          <div><strong>Pickup name:</strong> {order.fulfillment?.pickupName ?? "n/a"}</div>
          <div><strong>Pickup phone:</strong> {order.fulfillment?.pickupPhone ?? "n/a"}</div>
        </div>
      </section>

      <section style={{ padding: 20, border: "1px solid #1e293b", borderRadius: 16, background: "#0f172a" }}>
        <h2 style={{ marginTop: 0 }}>Change status</h2>
        <form action="/api/internal/orders/status" method="POST" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <input type="hidden" name="orderId" value={order.id} />
          <select name="nextStatus" defaultValue={order.status} style={{ padding: 10, borderRadius: 8 }}>
            {NEXT_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <button type="submit" style={{ padding: "10px 14px", borderRadius: 10, border: 0, background: "#22c55e", color: "#052e16", fontWeight: 700 }}>
            Update status
          </button>
        </form>
      </section>

      <section style={{ padding: 20, border: "1px solid #1e293b", borderRadius: 16, background: "#0f172a" }}>
        <h2 style={{ marginTop: 0 }}>Items</h2>
        <div style={{ display: "grid", gap: 10 }}>
          {order.items.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: 12, borderRadius: 10, background: "#111827" }}>
              <div>{item.nameSnapshot} x {item.quantity}</div>
              <div>${Number(item.lineSubtotal).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: 20, border: "1px solid #1e293b", borderRadius: 16, background: "#0f172a" }}>
        <h2 style={{ marginTop: 0 }}>Timeline</h2>
        <div style={{ display: "grid", gap: 10 }}>
          {order.statusEvents.map((event) => (
            <div key={event.id} style={{ padding: 12, borderRadius: 10, background: "#111827" }}>
              <div><strong>{event.toStatus}</strong></div>
              <div style={{ color: "#94a3b8" }}>{new Date(event.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}