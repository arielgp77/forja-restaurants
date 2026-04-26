import Link from "next/link";
import { getPublicRestaurantBySlug } from "@/lib/db";
import OrderClient from "@/components/order/OrderClient";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function RestaurantPage({ params }: PageProps) {
  const { slug } = await params;
  const restaurant = await getPublicRestaurantBySlug(slug);

  if (!restaurant) {
    return (
      <main style={{ padding: 32 }}>
        <h1>Restaurant not found</h1>
        <p style={{ color: "#94a3b8" }}>Slug: {slug}</p>
        <p>
          <Link href="/" style={{ color: "#22c55e" }}>
            Back home
          </Link>
        </p>
      </main>
    );
  }

  const theme = restaurant.theme;
  const profile = restaurant.profile;
  const menu = restaurant.menus[0];
  const featuredCategories = menu?.categories ?? [];
  const story = restaurant.storySections;

  const clientCategories = featuredCategories.map((category) => ({
    id: category.id,
    name: category.name,
    items: category.items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: String(item.price)
    }))
  }));

  return (
    <main style={{ minHeight: "100vh", background: "#020617", color: "#e2e8f0" }}>
      <section
        style={{
          padding: "48px 24px",
          background: theme?.primaryColor ?? "#111827"
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ color: "#cbd5e1", marginBottom: 8 }}>
            {restaurant.publicSlug}
          </div>
          <h1 style={{ margin: 0, fontSize: 42 }}>{restaurant.name}</h1>
          <p style={{ maxWidth: 700, color: "#e2e8f0" }}>
            {profile?.storyHeadline ?? restaurant.descriptionShort ?? "Neighborhood restaurant"}
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <a
              href="#menu"
              style={{
                background: theme?.accentColor ?? "#22c55e",
                color: "#052e16",
                padding: "12px 16px",
                borderRadius: 10,
                textDecoration: "none",
                fontWeight: 700
              }}
            >
              View menu
            </a>
            <a
              href="#story"
              style={{
                background: "transparent",
                color: "#f8fafc",
                padding: "12px 16px",
                borderRadius: 10,
                border: "1px solid #cbd5e1",
                textDecoration: "none"
              }}
            >
              Our story
            </a>
          </div>
        </div>
      </section>

      <section id="story" style={{ padding: "32px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 16 }}>
          <h2 style={{ marginBottom: 0 }}>Story</h2>
          <p style={{ color: "#94a3b8", marginTop: 0 }}>
            {profile?.storyBody ?? restaurant.descriptionLong ?? "Story not configured yet."}
          </p>

          {story.length > 0 && (
            <div style={{ display: "grid", gap: 16 }}>
              {story.map((section) => (
                <article
                  key={section.id}
                  style={{
                    border: "1px solid #1e293b",
                    borderRadius: 16,
                    padding: 20,
                    background: "#0f172a"
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>{section.title ?? section.type}</h3>
                  {section.subtitle ? (
                    <p style={{ color: "#93c5fd" }}>{section.subtitle}</p>
                  ) : null}
                  {section.body ? (
                    <p style={{ color: "#cbd5e1" }}>{section.body}</p>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="menu" style={{ padding: "32px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 20 }}>
          <h2 style={{ marginBottom: 0 }}>Menu preview</h2>

          {featuredCategories.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>No active menu categories yet.</p>
          ) : (
            featuredCategories.map((category) => (
              <section
                key={category.id}
                style={{
                  border: "1px solid #1e293b",
                  borderRadius: 16,
                  padding: 20,
                  background: "#0f172a"
                }}
              >
                <h3 style={{ marginTop: 0 }}>{category.name}</h3>
                {category.description ? (
                  <p style={{ color: "#94a3b8" }}>{category.description}</p>
                ) : null}

                <div style={{ display: "grid", gap: 12 }}>
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 16,
                        padding: 12,
                        borderRadius: 12,
                        background: "#111827"
                      }}
                    >
                      <div>
                        <strong>{item.name}</strong>
                        {item.description ? (
                          <div style={{ color: "#94a3b8", marginTop: 4 }}>
                            {item.description}
                          </div>
                        ) : null}
                      </div>
                      <div style={{ fontWeight: 700 }}>
                        ${Number(item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </section>

      <OrderClient
        restaurantSlug={restaurant.publicSlug}
        restaurantName={restaurant.name}
        categories={clientCategories}
      />

      <section style={{ padding: "32px 24px 64px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2>Quick facts</h2>
          <ul style={{ color: "#cbd5e1" }}>
            <li>Pickup enabled: {restaurant.pickupEnabled ? "yes" : "no"}</li>
            <li>Curbside enabled: {restaurant.curbsideEnabled ? "yes" : "no"}</li>
            <li>Ordering enabled: {restaurant.orderingEnabled ? "yes" : "no"}</li>
            <li>Phone: {restaurant.phone ?? "not set"}</li>
            <li>City: {profile?.city ?? "not set"}</li>
          </ul>
        </div>
      </section>
    </main>
  );
}