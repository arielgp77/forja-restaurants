import type { AppPermission, AppRole } from "@/lib/auth/types";

const rolePermissions: Record<AppRole, AppPermission[]> = {
  platform_admin: [
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
  ],
  restaurant_owner: [
    "settings:read",
    "settings:manage",
    "team:read",
    "team:manage",
    "menu:read",
    "menu:manage",
    "orders:read",
    "orders:manage",
  ],
  restaurant_manager: [
    "settings:read",
    "team:read",
    "menu:read",
    "menu:manage",
    "orders:read",
    "orders:manage",
  ],
  kitchen_staff: [
    "orders:read",
    "orders:manage",
  ],
  support_staff: [
    "orders:read",
    "team:read",
    "settings:read",
  ],
  driver: [
    "delivery:read",
  ],
  customer: [],
};

export function getPermissionsForRole(role: AppRole): AppPermission[] {
  return rolePermissions[role] ?? [];
}

export function hasPermission(role: AppRole, permission: AppPermission): boolean {
  return getPermissionsForRole(role).includes(permission);
}

export function hasAnyPermission(role: AppRole, permissions: AppPermission[]): boolean {
  const granted = getPermissionsForRole(role);
  return permissions.some((permission) => granted.includes(permission));
}