import type { TeamMember } from "@/lib/auth/types";

export const demoTeamMembers: TeamMember[] = [
  {
    id: "tm_001",
    name: "Demo Owner",
    email: "owner@demo-pizzeria.local",
    role: "restaurant_owner",
    tenantSlug: "demo-pizzeria",
    status: "active",
  },
  {
    id: "tm_002",
    name: "Demo Manager",
    email: "manager@demo-pizzeria.local",
    role: "restaurant_manager",
    tenantSlug: "demo-pizzeria",
    status: "active",
  },
  {
    id: "tm_003",
    name: "Kitchen Lead",
    email: "kitchen@demo-pizzeria.local",
    role: "kitchen_staff",
    tenantSlug: "demo-pizzeria",
    status: "active",
  },
  {
    id: "tm_004",
    name: "Support Agent",
    email: "support@demo-pizzeria.local",
    role: "support_staff",
    tenantSlug: "demo-pizzeria",
    status: "inactive",
  }
];