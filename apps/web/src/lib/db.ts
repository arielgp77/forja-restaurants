import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, OrderStatus, FulfillmentType, SourceChannel, ActorType } from "../../../../infra/db/generated/client/client.ts";

type GlobalPrisma = typeof globalThis & {
  __forjaRestaurantsWebPrisma?: PrismaClient;
};

const globalForPrisma = globalThis as GlobalPrisma;

type PricingPolicy = {
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
    throw new Error("DATABASE_URL no esta definida para apps/web.");
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma =
  globalForPrisma.__forjaRestaurantsWebPrisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__forjaRestaurantsWebPrisma = prisma;
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

async function getPricingPolicyByRestaurant(tenantId: string, restaurantId: string): Promise<PricingPolicy> {
  const existing = await prisma.playbookInstall.findFirst({
    where: {
      tenantId,
      restaurantId,
      playbookKey: "pricing_policy_v1",
      isActive: true
    }
  });

  return normalizePricingPolicy(existing?.configJson);
}

function computeAmounts(input: {
  subtotal: number;
  tipPercent?: number;
  policy: PricingPolicy;
}) {
  const tax = Number((input.subtotal * (input.policy.taxRatePercent / 100)).toFixed(2));
  const serviceFee =
    input.policy.serviceFeeType === "percent"
      ? Number((input.subtotal * (input.policy.serviceFeeValue / 100)).toFixed(2))
      : Number(input.policy.serviceFeeValue.toFixed(2));

  const tipAmount = Number((input.subtotal * ((input.tipPercent ?? 0) / 100)).toFixed(2));
  const total = Number((input.subtotal + tax + serviceFee + tipAmount).toFixed(2));

  return {
    tax,
    serviceFee,
    tipAmount,
    total
  };
}

export async function getPublicRestaurantBySlug(slug: string) {
  return prisma.restaurant.findUnique({
    where: { publicSlug: slug },
    include: {
      profile: true,
      theme: true,
      storySections: {
        where: { isPublished: true },
        orderBy: { sortOrder: "asc" }
      },
      businessHours: {
        orderBy: [{ dayOfWeek: "asc" }, { serviceType: "asc" }]
      },
      menus: {
        where: { isActive: true },
        include: {
          categories: {
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
            include: {
              items: {
                where: { isActive: true },
                orderBy: { sortOrder: "asc" },
                take: 50
              }
            }
          }
        }
      }
    }
  });
}

export async function getRestaurantWithMenuItems(slug: string) {
  return prisma.restaurant.findUnique({
    where: { publicSlug: slug },
    include: {
      menus: {
        where: { isActive: true },
        include: {
          categories: {
            where: { isActive: true },
            include: {
              items: {
                where: { isActive: true }
              }
            }
          }
        }
      }
    }
  });
}

export async function getOrCreateCustomer(input: {
  tenantId: string;
  name: string;
  email: string;
  phone: string;
}) {
  const [firstName, ...rest] = input.name.trim().split(/\s+/);
  const lastName = rest.join(" ") || null;

  const byEmail = input.email
    ? await prisma.customer.findFirst({
        where: {
          tenantId: input.tenantId,
          email: input.email
        }
      })
    : null;

  if (byEmail) return byEmail;

  return prisma.customer.create({
    data: {
      tenantId: input.tenantId,
      firstName: firstName || "Guest",
      lastName,
      email: input.email || null,
      phone: input.phone || null,
      preferredLocale: "en"
    }
  });
}

export async function createPickupOrder(input: {
  restaurantSlug: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    menuItemId: string;
    quantity: number;
  }>;
  tipPercent?: number;
}) {
  const restaurant = await getRestaurantWithMenuItems(input.restaurantSlug);
  if (!restaurant) {
    throw new Error("restaurant_not_found");
  }

  const tenantId = restaurant.tenantId;
  const policy = await getPricingPolicyByRestaurant(tenantId, restaurant.id);

  const menuItems = restaurant.menus.flatMap((menu) =>
    menu.categories.flatMap((category) => category.items)
  );

  const selected = input.items
    .map((line) => {
      const item = menuItems.find((x) => x.id === line.menuItemId);
      if (!item) return null;
      return {
        item,
        quantity: line.quantity,
        lineSubtotal: Number(item.price) * line.quantity
      };
    })
    .filter(Boolean) as Array<{
      item: (typeof menuItems)[number];
      quantity: number;
      lineSubtotal: number;
    }>;

  if (selected.length === 0) {
    throw new Error("empty_order");
  }

  const subtotal = Number(selected.reduce((acc, line) => acc + line.lineSubtotal, 0).toFixed(2));
  const computed = computeAmounts({
    subtotal,
    tipPercent: input.tipPercent ?? 0,
    policy
  });

  const customer = await getOrCreateCustomer({
    tenantId,
    name: input.customer.name,
    email: input.customer.email,
    phone: input.customer.phone
  });

  const orderCount = await prisma.order.count({
    where: { restaurantId: restaurant.id }
  });

  const orderNumber = `W${String(orderCount + 1001)}`;

  const order = await prisma.order.create({
    data: {
      tenantId,
      restaurantId: restaurant.id,
      customerId: customer.id,
      orderNumber,
      status: OrderStatus.PLACED,
      fulfillmentType: FulfillmentType.PICKUP,
      sourceChannel: SourceChannel.WEB,
      currency: "USD",
      subtotalAmount: subtotal.toFixed(2),
      taxAmount: computed.tax.toFixed(2),
      serviceFeeAmount: computed.serviceFee.toFixed(2),
      deliveryFeeAmount: "0.00",
      tipAmount: computed.tipAmount.toFixed(2),
      discountAmount: "0.00",
      totalAmount: computed.total.toFixed(2),
      placedAt: new Date()
    }
  });

  await prisma.orderItem.createMany({
    data: selected.map((line, idx) => ({
      tenantId,
      orderId: order.id,
      menuItemId: line.item.id,
      nameSnapshot: line.item.name,
      unitPriceSnapshot: Number(line.item.price).toFixed(2),
      quantity: line.quantity,
      lineSubtotal: line.lineSubtotal.toFixed(2),
      sortOrder: idx + 1
    }))
  });

  await prisma.orderStatusEvent.create({
    data: {
      tenantId,
      orderId: order.id,
      toStatus: OrderStatus.PLACED,
      actorType: ActorType.CUSTOMER
    }
  });

  await prisma.fulfillment.create({
    data: {
      tenantId,
      orderId: order.id,
      type: FulfillmentType.PICKUP,
      pickupName: input.customer.name,
      pickupPhone: input.customer.phone
    }
  });

  if (computed.tipAmount > 0) {
    await prisma.ledgerEntry.create({
      data: {
        tenantId,
        orderId: order.id,
        type: "TIP",
        amount: computed.tipAmount.toFixed(2),
        currency: "USD",
        description: "Customer tip"
      }
    });
  }

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    subtotal,
    tax: computed.tax,
    serviceFee: computed.serviceFee,
    tipAmount: computed.tipAmount,
    total: computed.total,
    suggestedTipPercents: policy.suggestedTipPercents
  };
}

export async function quotePickupOrder(input: {
  restaurantSlug: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
  }>;
  tipPercent?: number;
}) {
  const restaurant = await getRestaurantWithMenuItems(input.restaurantSlug);
  if (!restaurant) {
    throw new Error("restaurant_not_found");
  }

  const policy = await getPricingPolicyByRestaurant(restaurant.tenantId, restaurant.id);

  const menuItems = restaurant.menus.flatMap((menu) =>
    menu.categories.flatMap((category) => category.items)
  );

  const selected = input.items
    .map((line) => {
      const item = menuItems.find((x) => x.id === line.menuItemId);
      if (!item) return null;
      return {
        menuItemId: item.id,
        name: item.name,
        unitPrice: Number(item.price),
        quantity: line.quantity,
        lineSubtotal: Number((Number(item.price) * line.quantity).toFixed(2))
      };
    })
    .filter(Boolean) as Array<{
      menuItemId: string;
      name: string;
      unitPrice: number;
      quantity: number;
      lineSubtotal: number;
    }>;

  if (selected.length === 0) {
    throw new Error("empty_order");
  }

  const subtotal = Number(selected.reduce((acc, line) => acc + line.lineSubtotal, 0).toFixed(2));
  const computed = computeAmounts({
    subtotal,
    tipPercent: input.tipPercent ?? 0,
    policy
  });

  return {
    currency: "USD",
    items: selected,
    subtotal,
    tax: computed.tax,
    serviceFee: computed.serviceFee,
    tipAmount: computed.tipAmount,
    total: computed.total,
    suggestedTipPercents: policy.suggestedTipPercents
  };
}

export async function getOrderConfirmation(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      restaurant: true,
      customer: true,
      items: {
        orderBy: { sortOrder: "asc" }
      },
      fulfillment: true
    }
  });
}