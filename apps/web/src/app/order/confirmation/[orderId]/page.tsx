import Link from "next/link";
import { getOrderConfirmation } from "@/lib/db";

type PageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { orderId } = await params;
  const order = await getOrderConfirmation(orderId);

  if (!order) {
    return (
      <main style={{ padding: 32 }}>
        <h1>Order not found</h1>
        <p>
          <Link href="/" style={{ color: "#22c55e" }}>
            Back home
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#020617", color: "#e2e8f0", padding: 32 }}>
      <div style={{ maxWidth: 800, margin: "0 auto", display: "grid", gap: 24 }}>
        <section style={{ padding: 24, borderRadius: 16, background: "#0f172a", border: "1px solid #1e293b" }}>
          <h1 style={{ marginTop: 0 }}>Order confirmed</h1>
          <p style={{ color: "#94a3b8" }}>
            Thank you for ordering from {order.restaurant.name}.
          </p>

          <div style={{ display: "grid", gap: 8 }}>
            <div><strong>Order number:</strong> {order.orderNumber}</div>
            <div><strong>Status:</strong> {order.status}</div>
            <div><strong>Pickup name:</strong> {order.fulfillment?.pickupName ?? "n/a"}</div>
            <div><strong>Pickup phone:</strong> {order.fulfillment?.pickupPhone ?? "n/a"}</div>
            <div><strong>Total:</strong> ${Number(order.totalAmount).toFixed(2)}</div>
          </div>
        </section>

        <section style={{ padding: 24, borderRadius: 16, background: "#0f172a", border: "1px solid #1e293b" }}>
          <h2 style={{ marginTop: 0 }}>Items</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {order.items.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>{item.nameSnapshot} x {item.quantity}</div>
                <div>${Number(item.lineSubtotal).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </section>

        <p>
          <Link href={`/r/${order.restaurant.publicSlug}`} style={{ color: "#22c55e" }}>
            Back to restaurant
          </Link>
        </p>
      </div>
    </main>
  );
}