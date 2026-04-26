import { requirePermission } from "@/lib/auth/server-auth";
import { getAdminRestaurantBundle } from "@/lib/db";

function cardStyle() {
  return {
    padding: 20,
    border: "1px solid #1e293b",
    borderRadius: 16,
    background: "#0f172a",
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

export default async function MenuPage() {
  const session = await requirePermission("menu:read");
  const bundle = await getAdminRestaurantBundle(session.tenantSlug);

  if (!bundle?.restaurant) {
    return <main><h1>Restaurant not found for tenant {session.tenantSlug}</h1></main>;
  }

  const menu = bundle.restaurant.menus[0];
  const categories = menu?.categories ?? [];

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <section style={cardStyle()}>
        <h1 style={{ marginTop: 0 }}>Menu CMS</h1>
        <p style={{ color: "#94a3b8" }}>
          Crea categorias e items. Tambien puedes activar o desactivar items.
        </p>
      </section>

      <section style={cardStyle()}>
        <h2 style={{ marginTop: 0 }}>Create category</h2>
        <form action="/api/internal/cms/menu/category" method="POST" style={{ display: "grid", gap: 12 }}>
          <label>
            <div>Name</div>
            <input name="name" style={inputStyle()} />
          </label>

          <label>
            <div>Description</div>
            <input name="description" style={inputStyle()} />
          </label>

          <label>
            <div>Sort order</div>
            <input name="sortOrder" defaultValue="10" style={inputStyle()} />
          </label>

          <button type="submit" style={{ padding: 12, borderRadius: 10, border: 0, background: "#22c55e", color: "#052e16", fontWeight: 700 }}>
            Create category
          </button>
        </form>
      </section>

      <section style={cardStyle()}>
        <h2 style={{ marginTop: 0 }}>Create item</h2>
        <form action="/api/internal/cms/menu/item" method="POST" style={{ display: "grid", gap: 12 }}>
          <label>
            <div>Category</div>
            <select name="categoryId" style={inputStyle()}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>

          <label>
            <div>Name</div>
            <input name="name" style={inputStyle()} />
          </label>

          <label>
            <div>Slug</div>
            <input name="slug" style={inputStyle()} />
          </label>

          <label>
            <div>Description</div>
            <input name="description" style={inputStyle()} />
          </label>

          <label>
            <div>Price</div>
            <input name="price" defaultValue="0.00" style={inputStyle()} />
          </label>

          <label>
            <div>Sort order</div>
            <input name="sortOrder" defaultValue="10" style={inputStyle()} />
          </label>

          <button type="submit" style={{ padding: 12, borderRadius: 10, border: 0, background: "#22c55e", color: "#052e16", fontWeight: 700 }}>
            Create item
          </button>
        </form>
      </section>

      <section style={cardStyle()}>
        <h2 style={{ marginTop: 0 }}>Categories and items</h2>

        <div style={{ display: "grid", gap: 16 }}>
          {categories.map((category) => (
            <section key={category.id} style={{ padding: 16, borderRadius: 12, background: "#111827" }}>
              <h3 style={{ marginTop: 0 }}>{category.name}</h3>
              {category.description ? <p style={{ color: "#94a3b8" }}>{category.description}</p> : null}

              <div style={{ display: "grid", gap: 10 }}>
                {category.items.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: 12, borderRadius: 10, background: "#0b1220" }}>
                    <div>
                      <strong>{item.name}</strong>
                      <div style={{ color: "#94a3b8" }}>{item.slug}</div>
                      {item.description ? <div style={{ color: "#cbd5e1" }}>{item.description}</div> : null}
                    </div>

                    <div style={{ display: "grid", justifyItems: "end", gap: 8 }}>
                      <div>${Number(item.price).toFixed(2)}</div>
                      <div style={{ color: item.isActive ? "#22c55e" : "#f87171" }}>
                        {item.isActive ? "active" : "inactive"}
                      </div>

                      <form action="/api/internal/cms/menu/item-toggle" method="POST">
                        <input type="hidden" name="itemId" value={item.id} />
                        <input type="hidden" name="nextState" value={item.isActive ? "false" : "true"} />
                        <button type="submit" style={{ padding: "8px 12px", borderRadius: 8, border: 0, background: item.isActive ? "#ef4444" : "#22c55e", color: "#fff" }}>
                          {item.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}