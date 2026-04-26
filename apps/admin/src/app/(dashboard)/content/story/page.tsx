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

export default async function StoryPage() {
  const session = await requirePermission("settings:read");
  const bundle = await getAdminRestaurantBundle(session.tenantSlug);

  if (!bundle?.restaurant) {
    return <main><h1>Restaurant not found for tenant {session.tenantSlug}</h1></main>;
  }

  const { restaurant } = bundle;
  const profile = restaurant.profile;

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <section style={cardStyle()}>
        <h1 style={{ marginTop: 0 }}>Story editor</h1>
        <p style={{ color: "#94a3b8" }}>
          Edita headline, story body y owner story.
        </p>

        <form action="/api/internal/cms/story" method="POST" style={{ display: "grid", gap: 12 }}>
          <label>
            <div>Story headline</div>
            <input name="storyHeadline" defaultValue={profile?.storyHeadline ?? ""} style={inputStyle()} />
          </label>

          <label>
            <div>Story body</div>
            <textarea name="storyBody" defaultValue={profile?.storyBody ?? ""} rows={5} style={inputStyle()} />
          </label>

          <label>
            <div>Owner story</div>
            <textarea name="ownerStory" defaultValue={profile?.ownerStory ?? ""} rows={4} style={inputStyle()} />
          </label>

          <button type="submit" style={{ padding: 12, borderRadius: 10, border: 0, background: "#22c55e", color: "#052e16", fontWeight: 700 }}>
            Save story
          </button>
        </form>
      </section>

      <section style={cardStyle()}>
        <h2 style={{ marginTop: 0 }}>Published story sections</h2>

        <div style={{ display: "grid", gap: 12 }}>
          {restaurant.storySections.map((section) => (
            <div key={section.id} style={{ padding: 14, borderRadius: 12, background: "#111827" }}>
              <strong>{section.title ?? section.type}</strong>
              {section.subtitle ? <div style={{ color: "#93c5fd", marginTop: 4 }}>{section.subtitle}</div> : null}
              {section.body ? <div style={{ color: "#cbd5e1", marginTop: 8 }}>{section.body}</div> : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}