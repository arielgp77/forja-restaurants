export const APP_ROLES = [
  "platform_admin",
  "restaurant_owner",
  "restaurant_manager",
  "kitchen_staff",
  "support_staff",
  "driver",
  "customer",
] as const;

export type AppRole = typeof APP_ROLES[number];

export const APP_PERMISSIONS = [
  "settings:read",
  "settings:manage",
  "team:read",
  "team:manage",
  "menu:read",
  "menu:manage",
  "orders:read",
  "orders:manage",
  "delivery:read",
  "delivery:manage",
] as const;

export type AppPermission = typeof APP_PERMISSIONS[number];

export type AppSession = {
  name: string;
  email: string;
  role: AppRole;
  tenantSlug: string;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  tenantSlug: string;
  status: "active" | "inactive";
};