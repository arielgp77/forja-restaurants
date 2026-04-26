import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, OrderStatus } from "../../../../infra/db/generated/client/client.ts";

type GlobalPrisma = typeof globalThis & {
  __forjaRestaurantsAdminPrisma?: PrismaClient;
};

const globalForPrisma = globalThis as GlobalPrisma;

export type PricingPolicy = {
  taxRatePercent: number;
  serviceFeeType: "fixed" | "percent";
  serviceFeeValue: number;
  suggestedTipPercents: number[];
  driverBasePay: number;
  tipsPassThrough: boolean;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL no esta definida para apps/admin.");
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma =
  globalForPrisma.__forjaRestaurantsAdminPrisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__forjaRestaurantsAdminPrisma = prisma;
}

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  PLACED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "CANCELLED"],
  READY: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

function isAllowedTransition(from: OrderStatus, to: OrderStatus): boolean {
  return allowedTransitions[from]?.includes(to) ?? false;
}

function normalizePercentList(input: unknown): number[] {
  if (!Array.isArray(input)) return [15, 18, 20];
  const values = input
    .map((x) => Number(x))
    .filter((x) => Number.isFinite(x) && x >= 0 && x <= 100);
  return values.length > 0 ? values : [15, 18, 20];
}

function normalizePricingPolicy(raw: unknown): PricingPolicy {
  const obj = (raw && typeof raw === "object") ? (raw as Record<string, unknown>) : {};

  const taxRatePercent = Number(obj.taxRatePercent);
  const serviceFeeType = obj.serviceFeeType === "percent" ? "percent" : "fixed";
  const serviceFeeValue = Number(obj.serviceFeeValue);
  const driverBasePay = Number(obj.driverBasePay);

  return {
    taxRatePercent: Number.isFinite(taxRatePercent) ? taxRatePercent : 8,
    serviceFeeType,
    serviceFeeValue: Number.isFinite(serviceFeeValue) ? serviceFeeValue : 3,
    suggestedTipPercents: normalizePercentList(obj.suggestedTipPercents),
    driverBasePay: Number.isFinite(driverBasePay) ? driverBasePay : 3,
    tipsPassThrough: obj.tipsPassThrough === false ? false : true
  };
}

export async function getTenantBySlug(slug: string) {
  return prisma.tenant.findUnique({
    where: { slug },
    select: { id: true, slug: true, name: true }
  });
}

export async function getRestaurantByTenantSlug(tenantSlug: string) {
  const tenant = await getTenantBySlug(tenantSlug);
  if (!tenant) return null;

  const restaurant = await prisma.restaurant.findFirst({
    where: { tenantId: tenant.id },
    select: {
      id: true,
      tenantId: true,
      name: true,
      publicSlug: true
    }
  });

  if (!restaurant) return null;

  return { tenant, restaurant };
}

export async function getAdminRestaurantBundle(tenantSlug: string) {
  const tenant = await getTenantBySlug(tenantSlug);
  if (!tenant) return null;

  const restaurant = await prisma.restaurant.findFirst({
    where: { tenantId: tenant.id },
    include: {
      profile: true,
      theme: true,
      storySections: {
        orderBy: { sortOrder: "asc" }
      },
      menus: {
        where: { isActive: true },
        include: {
          categories: {
            orderBy: { sortOrder: "asc" },
            include: {
              items: {
                orderBy: { sortOrder: "asc" }
              }
            }
          }
        }
      },
      promos: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  return {
    tenant,
    restaurant
  };
}

export async function getOrdersBoard(input: {
  tenantSlug: string;
  status?: string | null;
}) {
  const scope = await getRestaurantByTenantSlug(input.tenantSlug);
  if (!scope) return null;

  const statusFilter =
    input.status && input.status !== "ALL"
      ? { status: input.status as OrderStatus }
      : {};

  const orders = await prisma.order.findMany({
    where: {
      restaurantId: scope.restaurant.id,
      ...statusFilter
    },
    include: {
      customer: true,
      fulfillment: true,
      items: {
        orderBy: { sortOrder: "asc" }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return {
    tenant: scope.tenant,
    restaurant: scope.restaurant,
    orders
  };
}

export async function getAdminOrderDetail(input: {
  tenantSlug: string;
  orderId: string;
}) {
  const scope = await getRestaurantByTenantSlug(input.tenantSlug);
  if (!scope) return null;

  return prisma.order.findFirst({
    where: {
      id: input.orderId,
      restaurantId: scope.restaurant.id
    },
    include: {
      restaurant: true,
      customer: true,
      fulfillment: true,
      items: {
        orderBy: { sortOrder: "asc" }
      },
      statusEvents: {
        orderBy: { createdAt: "asc" }
      }
    }
  });
}

export async function updateAdminOrderStatus(input: {
  tenantSlug: string;
  orderId: string;
  nextStatus: OrderStatus;
}) {
  const scope = await getRestaurantByTenantSlug(input.tenantSlug);
  if (!scope) throw new Error("scope_not_found");

  const existing = await prisma.order.findFirst({
    where: {
      id: input.orderId,
      restaurantId: scope.restaurant.id
    },
    select: {
      id: true,
      tenantId: true,
      status: true
    }
  });

  if (!existing) {
    throw new Error("order_not_found");
  }

  if (existing.status === input.nextStatus) {
    return prisma.order.findUnique({
      where: { id: existing.id }
    });
  }

  if (!isAllowedTransition(existing.status, input.nextStatus)) {
    throw new Error(`invalid_transition:${existing.status}->${input.nextStatus}`);
  }

  const updated = await prisma.order.update({
    where: { id: existing.id },
    data: {
      status: input.nextStatus,
      confirmedAt: input.nextStatus === "CONFIRMED" ? new Date() : undefined,
      completedAt: input.nextStatus === "COMPLETED" ? new Date() : undefined,
      cancelledAt: input.nextStatus === "CANCELLED" ? new Date() : undefined
    }
  });

  await prisma.orderStatusEvent.create({
    data: {
      tenantId: existing.tenantId,
      orderId: existing.id,
      fromStatus: existing.status,
      toStatus: input.nextStatus,
      actorType: "STAFF"
    }
  });

  return updated;
}

export async function getOpsBoard(tenantSlug: string) {
  const scope = await getRestaurantByTenantSlug(tenantSlug);
  if (!scope) return null;

  const orders = await prisma.order.findMany({
    where: {
      restaurantId: scope.restaurant.id,
      status: {
        in: ["PLACED", "CONFIRMED", "PREPARING", "READY"]
      }
    },
    include: {
      customer: true,
      fulfillment: true,
      items: {
        orderBy: { sortOrder: "asc" }
      }
    },
    orderBy: { placedAt: "asc" },
    take: 200
  });

  return {
    tenant: scope.tenant,
    restaurant: scope.restaurant,
    orders
  };
}

export async function getCurbsideBoard(tenantSlug: string) {
  const scope = await getRestaurantByTenantSlug(tenantSlug);
  if (!scope) return null;

  const orders = await prisma.order.findMany({
    where: {
      restaurantId: scope.restaurant.id,
      fulfillmentType: "CURBSIDE",
      status: {
        in: ["READY", "COMPLETED"]
      }
    },
    include: {
      customer: true,
      fulfillment: true,
      items: {
        orderBy: { sortOrder: "asc" }
      }
    },
    orderBy: [{ status: "asc" }, { placedAt: "asc" }],
    take: 100
  });

  return {
    tenant: scope.tenant,
    restaurant: scope.restaurant,
    orders
  };
}

export async function processMockSmsArrival(input: {
  tenantSlug: string;
  orderNumber: string;
  fromPhone: string;
  curbsideSpot?: string | null;
  carColor?: string | null;
  carModel?: string | null;
  body?: string | null;
}) {
  const scope = await getRestaurantByTenantSlug(input.tenantSlug);
  if (!scope) {
    throw new Error("scope_not_found");
  }

  const order = await prisma.order.findFirst({
    where: {
      restaurantId: scope.restaurant.id,
      orderNumber: input.orderNumber,
      fulfillmentType: "CURBSIDE"
    },
    include: {
      customer: true,
      fulfillment: true
    }
  });

  if (!order) {
    throw new Error("order_not_found");
  }

  if (order.status !== "READY") {
    throw new Error(`order_not_ready:${order.status}`);
  }

  const now = new Date();

  await prisma.fulfillment.upsert({
    where: { orderId: order.id },
    create: {
      tenantId: scope.tenant.id,
      orderId: order.id,
      type: "CURBSIDE",
      pickupName: `${order.customer.firstName} ${order.customer.lastName ?? ""}`.trim(),
      pickupPhone: input.fromPhone || order.customer.phone || null,
      curbsideSpot: input.curbsideSpot ?? null,
      carColor: input.carColor ?? null,
      carModel: input.carModel ?? null,
      arrivalNotifiedAt: now
    },
    update: {
      pickupPhone: input.fromPhone || order.fulfillment?.pickupPhone || order.customer.phone || null,
      curbsideSpot: input.curbsideSpot ?? order.fulfillment?.curbsideSpot ?? null,
      carColor: input.carColor ?? order.fulfillment?.carColor ?? null,
      carModel: input.carModel ?? order.fulfillment?.carModel ?? null,
      arrivalNotifiedAt: now
    }
  });

  if (input.fromPhone && input.fromPhone.trim().length > 0) {
    await prisma.customer.update({
      where: { id: order.customerId },
      data: {
        phone: input.fromPhone.trim()
      }
    });
  }

  return {
    ok: true,
    orderId: order.id,
    orderNumber: order.orderNumber,
    arrivalAt: now.toISOString()
  };
}

export async function getPricingPolicy(tenantSlug: string) {
  const scope = await getRestaurantByTenantSlug(tenantSlug);
  if (!scope) return null;

  const existing = await prisma.playbookInstall.findFirst({
    where: {
      tenantId: scope.tenant.id,
      restaurantId: scope.restaurant.id,
      playbookKey: "pricing_policy_v1",
      isActive: true
    }
  });

  return {
    tenant: scope.tenant,
    restaurant: scope.restaurant,
    policy: normalizePricingPolicy(existing?.configJson)
  };
}

export async function savePricingPolicy(input: {
  tenantSlug: string;
  policy: PricingPolicy;
}) {
  const scope = await getRestaurantByTenantSlug(input.tenantSlug);
  if (!scope) throw new Error("scope_not_found");

  const existing = await prisma.playbookInstall.findFirst({
    where: {
      tenantId: scope.tenant.id,
      restaurantId: scope.restaurant.id,
      playbookKey: "pricing_policy_v1"
    }
  });

  if (existing) {
    return prisma.playbookInstall.update({
      where: { id: existing.id },
      data: {
        version: "1.0.0",
        isActive: true,
        configJson: input.policy as any
      }
    });
  }

  return prisma.playbookInstall.create({
    data: {
      tenantId: scope.tenant.id,
      restaurantId: scope.restaurant.id,
      playbookKey: "pricing_policy_v1",
      version: "1.0.0",
      isActive: true,
      configJson: input.policy as any
    }
  });
}

export async function getPayoutLedgerBase(tenantSlug: string) {
  const scope = await getRestaurantByTenantSlug(tenantSlug);
  if (!scope) return null;

  const pricing = await getPricingPolicy(tenantSlug);
  const policy = pricing?.policy ?? normalizePricingPolicy(null);

  const orders = await prisma.order.findMany({
    where: {
      restaurantId: scope.restaurant.id
    },
    include: {
      customer: true,
      fulfillment: true
    },
    orderBy: { createdAt: "desc" },
    take: 100
  });

  const rows = orders.map((order) => {
    const subtotal = Number(order.subtotalAmount);
    const tax = Number(order.taxAmount);
    const serviceFee = Number(order.serviceFeeAmount);
    const tip = Number(order.tipAmount);
    const total = Number(order.totalAmount);

    const driverBaseEstimate = Number(policy.driverBasePay.toFixed(2));
    const tipToDriverEstimate = policy.tipsPassThrough ? tip : 0;
    const platformNetEstimate = Number((serviceFee - driverBaseEstimate).toFixed(2));

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      fulfillmentType: order.fulfillmentType,
      customerName: `${order.customer.firstName} ${order.customer.lastName ?? ""}`.trim(),
      subtotal,
      tax,
      serviceFee,
      tip,
      total,
      driverBaseEstimate,
      tipToDriverEstimate,
      platformNetEstimate
    };
  });

  return {
    tenant: scope.tenant,
    restaurant: scope.restaurant,
    policy,
    rows
  };
}