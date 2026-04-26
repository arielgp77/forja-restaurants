"use client";

import { useMemo, useState } from "react";
import type { CartItemInput, PlaceOrderResponse, QuoteResponse } from "@/lib/cart-types";
import { clearCart, readCart, writeCart } from "@/lib/cart-storage";

type MenuItemLite = {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
};

type CategoryLite = {
  id: string;
  name: string;
  items: MenuItemLite[];
};

type Props = {
  restaurantSlug: string;
  restaurantName: string;
  categories: CategoryLite[];
};

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function OrderClient(props: Props) {
  const [cart, setCart] = useState<CartItemInput[]>(() => readCart(props.restaurantSlug));
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [customerName, setCustomerName] = useState("Ariel Demo");
  const [customerEmail, setCustomerEmail] = useState("ariel.demo@example.com");
  const [customerPhone, setCustomerPhone] = useState("6305550199");
  const [tipPercent, setTipPercent] = useState(0);

  const itemsMap = useMemo(() => {
    const map = new Map<string, MenuItemLite>();
    for (const category of props.categories) {
      for (const item of category.items) {
        map.set(item.id, item);
      }
    }
    return map;
  }, [props.categories]);

  const totalUnits = cart.reduce((acc, item) => acc + item.quantity, 0);
  const tipOptions = quote?.suggestedTipPercents ?? [15, 18, 20];

  function syncCart(nextCart: CartItemInput[]) {
    setCart(nextCart);
    writeCart(props.restaurantSlug, nextCart);
  }

  function addItem(menuItemId: string) {
    const found = cart.find((item) => item.menuItemId === menuItemId);
    if (found) {
      syncCart(
        cart.map((item) =>
          item.menuItemId === menuItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      return;
    }

    syncCart([...cart, { menuItemId, quantity: 1 }]);
  }

  function decrementItem(menuItemId: string) {
    const found = cart.find((item) => item.menuItemId === menuItemId);
    if (!found) return;

    if (found.quantity <= 1) {
      syncCart(cart.filter((item) => item.menuItemId !== menuItemId));
      return;
    }

    syncCart(
      cart.map((item) =>
        item.menuItemId === menuItemId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  }

  async function runQuote() {
    setLoadingQuote(true);
    try {
      const response = await fetch("/api/order/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantSlug: props.restaurantSlug,
          items: cart,
          tipPercent
        })
      });

      const data = (await response.json()) as QuoteResponse;
      setQuote(data);
    } finally {
      setLoadingQuote(false);
    }
  }

  async function placeOrder() {
    setPlacingOrder(true);
    try {
      const response = await fetch("/api/order/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantSlug: props.restaurantSlug,
          customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone
          },
          items: cart,
          tipPercent
        })
      });

      const data = (await response.json()) as PlaceOrderResponse;
      if (data.ok && data.redirectUrl) {
        clearCart(props.restaurantSlug);
        window.location.href = data.redirectUrl;
        return;
      }

      alert(data.error ?? "Could not place order.");
    } finally {
      setPlacingOrder(false);
    }
  }

  return (
    <section style={{ padding: "32px 24px 64px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 24 }}>
        <div style={{ padding: 20, border: "1px solid #1e293b", borderRadius: 16, background: "#0f172a" }}>
          <h2 style={{ marginTop: 0 }}>Order now</h2>
          <p style={{ color: "#94a3b8" }}>
            Pickup flow V1 for {props.restaurantName}.
          </p>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          {props.categories.map((category) => (
            <section key={category.id} style={{ padding: 20, border: "1px solid #1e293b", borderRadius: 16, background: "#0f172a" }}>
              <h3 style={{ marginTop: 0 }}>{category.name}</h3>
              <div style={{ display: "grid", gap: 12 }}>
                {category.items.map((item) => {
                  const qty = cart.find((x) => x.menuItemId === item.id)?.quantity ?? 0;
                  return (
                    <div
                      key={item.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gap: 12,
                        padding: 12,
                        borderRadius: 12,
                        background: "#111827",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <strong>{item.name}</strong>
                        {item.description ? (
                          <div style={{ color: "#94a3b8", marginTop: 4 }}>{item.description}</div>
                        ) : null}
                        <div style={{ marginTop: 6 }}>${Number(item.price).toFixed(2)}</div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button onClick={() => decrementItem(item.id)} style={{ padding: "8px 12px" }}>-</button>
                        <div style={{ minWidth: 24, textAlign: "center" }}>{qty}</div>
                        <button onClick={() => addItem(item.id)} style={{ padding: "8px 12px" }}>+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <section style={{ padding: 20, border: "1px solid #1e293b", borderRadius: 16, background: "#0f172a", display: "grid", gap: 12 }}>
          <h3 style={{ marginTop: 0 }}>Pickup customer info</h3>

          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Name" style={{ padding: 10, borderRadius: 8 }} />
          <input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="Email" style={{ padding: 10, borderRadius: 8 }} />
          <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Phone" style={{ padding: 10, borderRadius: 8 }} />
        </section>

        <section style={{ padding: 20, border: "1px solid #1e293b", borderRadius: 16, background: "#0f172a", display: "grid", gap: 12 }}>
          <h3 style={{ marginTop: 0 }}>Tip</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => setTipPercent(0)} style={{ padding: "10px 14px", borderRadius: 10, background: tipPercent === 0 ? "#22c55e" : "#111827", color: tipPercent === 0 ? "#052e16" : "#e2e8f0" }}>
              No tip
            </button>
            {tipOptions.map((tip) => (
              <button
                key={tip}
                onClick={() => setTipPercent(tip)}
                style={{ padding: "10px 14px", borderRadius: 10, background: tipPercent === tip ? "#22c55e" : "#111827", color: tipPercent === tip ? "#052e16" : "#e2e8f0" }}
              >
                {tip}%
              </button>
            ))}
          </div>
        </section>

        <section style={{ padding: 20, border: "1px solid #1e293b", borderRadius: 16, background: "#0f172a", display: "grid", gap: 12 }}>
          <h3 style={{ marginTop: 0 }}>Cart</h3>

          <div>Total units: {totalUnits}</div>

          <div style={{ display: "grid", gap: 8 }}>
            {cart.length === 0 ? (
              <div style={{ color: "#94a3b8" }}>Your cart is empty.</div>
            ) : (
              cart.map((line) => {
                const item = itemsMap.get(line.menuItemId);
                if (!item) return null;
                return (
                  <div key={line.menuItemId} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div>{item.name} x {line.quantity}</div>
                    <div>{money(Number(item.price) * line.quantity)}</div>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={runQuote} disabled={cart.length === 0 || loadingQuote} style={{ padding: "12px 16px", borderRadius: 10 }}>
              {loadingQuote ? "Quoting..." : "Quote order"}
            </button>

            <button onClick={placeOrder} disabled={cart.length === 0 || placingOrder} style={{ padding: "12px 16px", borderRadius: 10, background: "#22c55e", color: "#052e16", fontWeight: 700 }}>
              {placingOrder ? "Placing..." : "Place pickup order"}
            </button>
          </div>

          {quote ? (
            <div style={{ marginTop: 8, padding: 16, borderRadius: 12, background: "#111827", display: "grid", gap: 6 }}>
              <div>Subtotal: {money(quote.subtotal)}</div>
              <div>Tax: {money(quote.tax)}</div>
              <div>Service fee: {money(quote.serviceFee)}</div>
              <div>Tip: {money(quote.tipAmount)}</div>
              <div><strong>Total: {money(quote.total)}</strong></div>
            </div>
          ) : null}
        </section>
      </div>
    </section>
  );
}