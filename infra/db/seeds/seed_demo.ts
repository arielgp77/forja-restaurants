import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  TenantPlan,
  TenantStatus,
  RestaurantStatus,
  StorySectionType,
  ServiceType,
  SelectionType,
  OrderStatus,
  FulfillmentType,
  SourceChannel,
  ActorType,
  PaymentProvider,
  PaymentStatus,
  LedgerEntryType,
  PromoType,
  RuleType
} from "../generated/client/client.ts";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const tenantSlug = "demo-pizzeria";
  const restaurantSlug = "demo-pizzeria";

  const existingTenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    select: { id: true },
  });

  if (existingTenant) {
    console.log(`Seed ya existe para tenant ${tenantSlug}. No se duplico.`);
    return;
  }

  // 1) tenant
  const tenant = await prisma.tenant.create({
    data: {
      slug: tenantSlug,
      name: "Demo Pizzeria",
      status: TenantStatus.ACTIVE,
      plan: TenantPlan.INTERNAL_DEMO,
      defaultLocale: "en",
      defaultCurrency: "USD",
      timezone: "America/Chicago",
    }
  });

  // 2) restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      tenantId: tenant.id,
      name: "Demo Pizzeria",
      publicSlug: restaurantSlug,
      phone: "6305550101",
      email: "demo@pizzeria.local",
      descriptionShort: "Neighborhood pizza with curbside pickup.",
      descriptionLong: "Demo restaurant for Forja Restaurants MVP.",
      status: RestaurantStatus.ACTIVE,
      orderingEnabled: true,
      pickupEnabled: true,
      curbsideEnabled: true,
      deliveryEnabled: false,
      dineInInfoEnabled: true
    }
  });

  // 3) profile + theme + story + hours
  await prisma.restaurantProfile.create({
    data: {
      tenantId: tenant.id,
      restaurantId: restaurant.id,
      storyHeadline: "Pizza del barrio, rapida y bien hecha.",
      storyBody: "Somos una pizzeria demo pensada para validar el MVP tecnico y operativo.",
      ownerStory: "Negocio familiar enfocado en pickup y curbside.",
      addressLine1: "123 Demo Ave",
      city: "Bloomingdale",
      state: "IL",
      postalCode: "60108",
      country: "US",
      parkingNotes: "Estacionamiento al frente.",
      curbsideNotes: "Manda YA LLEGUE cuando estes afuera."
    }
  });

  await prisma.brandTheme.create({
    data: {
      tenantId: tenant.id,
      restaurantId: restaurant.id,
      primaryColor: "#B91C1C",
      secondaryColor: "#111827",
      accentColor: "#F59E0B",
      fontHeading: "Inter",
      fontBody: "Inter",
      heroLayout: "classic",
      themePreset: "pizza-dark"
    }
  });

  await prisma.storySection.createMany({
    data: [
      {
        tenantId: tenant.id,
        restaurantId: restaurant.id,
        type: StorySectionType.HERO,
        title: "Demo Pizzeria",
        subtitle: "Pickup y curbside simples",
        body: "Ordena rapido, paga facil y recoge sin friccion.",
        sortOrder: 1,
        isPublished: true
      },
      {
        tenantId: tenant.id,
        restaurantId: restaurant.id,
        type: StorySectionType.OUR_STORY,
        title: "Nuestra historia",
        body: "Este restaurante existe para probar el motor de ordering, branding y operacion.",
        sortOrder: 2,
        isPublished: true
      },
      {
        tenantId: tenant.id,
        restaurantId: restaurant.id,
        type: StorySectionType.CTA,
        title: "Ordena ahora",
        body: "Prueba el flujo de menu, checkout y curbside.",
        sortOrder: 3,
        isPublished: true
      }
    ]
  });

  await prisma.businessHour.createMany({
    data: [
      { tenantId: tenant.id, restaurantId: restaurant.id, dayOfWeek: 1, openTime: "11:00", closeTime: "21:00", isClosed: false, serviceType: ServiceType.GENERAL },
      { tenantId: tenant.id, restaurantId: restaurant.id, dayOfWeek: 2, openTime: "11:00", closeTime: "21:00", isClosed: false, serviceType: ServiceType.GENERAL },
      { tenantId: tenant.id, restaurantId: restaurant.id, dayOfWeek: 3, openTime: "11:00", closeTime: "21:00", isClosed: false, serviceType: ServiceType.GENERAL },
      { tenantId: tenant.id, restaurantId: restaurant.id, dayOfWeek: 4, openTime: "11:00", closeTime: "21:00", isClosed: false, serviceType: ServiceType.GENERAL },
      { tenantId: tenant.id, restaurantId: restaurant.id, dayOfWeek: 5, openTime: "11:00", closeTime: "22:00", isClosed: false, serviceType: ServiceType.GENERAL },
      { tenantId: tenant.id, restaurantId: restaurant.id, dayOfWeek: 6, openTime: "11:00", closeTime: "22:00", isClosed: false, serviceType: ServiceType.GENERAL },
      { tenantId: tenant.id, restaurantId: restaurant.id, dayOfWeek: 0, openTime: "12:00", closeTime: "20:00", isClosed: false, serviceType: ServiceType.GENERAL }
    ]
  });

  // 4) menu + categories
  const menu = await prisma.menu.create({
    data: {
      tenantId: tenant.id,
      restaurantId: restaurant.id,
      name: "Main Menu",
      description: "Demo menu",
      isActive: true,
      currency: "USD"
    }
  });

  const pizzasCategory = await prisma.menuCategory.create({
    data: {
      tenantId: tenant.id,
      menuId: menu.id,
      name: "Pizzas",
      description: "Signature pies",
      sortOrder: 1,
      isActive: true
    }
  });

  const wingsCategory = await prisma.menuCategory.create({
    data: {
      tenantId: tenant.id,
      menuId: menu.id,
      name: "Wings",
      description: "Classic wings",
      sortOrder: 2,
      isActive: true
    }
  });

  const drinksCategory = await prisma.menuCategory.create({
    data: {
      tenantId: tenant.id,
      menuId: menu.id,
      name: "Drinks",
      description: "Cold drinks",
      sortOrder: 3,
      isActive: true
    }
  });

  // 5) items
  const pepperoni = await prisma.menuItem.create({
    data: {
      tenantId: tenant.id,
      menuId: menu.id,
      categoryId: pizzasCategory.id,
      name: "Pepperoni Pizza",
      slug: "pepperoni-pizza",
      description: "Classic pepperoni and mozzarella.",
      price: "16.99",
      isActive: true,
      isFeatured: true,
      sortOrder: 1
    }
  });

  const hawaiian = await prisma.menuItem.create({
    data: {
      tenantId: tenant.id,
      menuId: menu.id,
      categoryId: pizzasCategory.id,
      name: "Hawaiian Pizza",
      slug: "hawaiian-pizza",
      description: "Ham, pineapple and mozzarella.",
      price: "17.99",
      isActive: true,
      isFeatured: false,
      sortOrder: 2
    }
  });

  const wings = await prisma.menuItem.create({
    data: {
      tenantId: tenant.id,
      menuId: menu.id,
      categoryId: wingsCategory.id,
      name: "10 Piece Wings",
      slug: "10-piece-wings",
      description: "Crispy wings with your favorite sauce.",
      price: "12.99",
      isActive: true,
      sortOrder: 1
    }
  });

  const soda = await prisma.menuItem.create({
    data: {
      tenantId: tenant.id,
      menuId: menu.id,
      categoryId: drinksCategory.id,
      name: "2L Soda",
      slug: "2l-soda",
      description: "Assorted flavors",
      price: "3.49",
      isActive: true,
      sortOrder: 1
    }
  });

  // 6) modifiers
  const sizeGroup = await prisma.modifierGroup.create({
    data: {
      tenantId: tenant.id,
      menuItemId: pepperoni.id,
      name: "Size",
      selectionType: SelectionType.SINGLE,
      minSelections: 1,
      maxSelections: 1,
      isRequired: true,
      sortOrder: 1
    }
  });

  await prisma.modifierOption.createMany({
    data: [
      {
        tenantId: tenant.id,
        modifierGroupId: sizeGroup.id,
        name: "Medium",
        priceDelta: "0.00",
        isDefault: true,
        isActive: true,
        sortOrder: 1
      },
      {
        tenantId: tenant.id,
        modifierGroupId: sizeGroup.id,
        name: "Large",
        priceDelta: "3.00",
        isDefault: false,
        isActive: true,
        sortOrder: 2
      }
    ]
  });

  const extrasGroup = await prisma.modifierGroup.create({
    data: {
      tenantId: tenant.id,
      menuItemId: pepperoni.id,
      name: "Extras",
      selectionType: SelectionType.MULTIPLE,
      minSelections: 0,
      maxSelections: 4,
      isRequired: false,
      sortOrder: 2
    }
  });

  await prisma.modifierOption.createMany({
    data: [
      {
        tenantId: tenant.id,
        modifierGroupId: extrasGroup.id,
        name: "Extra Cheese",
        priceDelta: "1.50",
        isDefault: false,
        isActive: true,
        sortOrder: 1
      },
      {
        tenantId: tenant.id,
        modifierGroupId: extrasGroup.id,
        name: "Jalapenos",
        priceDelta: "1.00",
        isDefault: false,
        isActive: true,
        sortOrder: 2
      }
    ]
  });

  // 7) promo + playbook + rule
  await prisma.promo.create({
    data: {
      tenantId: tenant.id,
      restaurantId: restaurant.id,
      name: "Welcome 10",
      code: "WELCOME10",
      type: PromoType.FIXED_AMOUNT,
      value: "10.00",
      minimumOrderAmount: "30.00",
      isActive: true
    }
  });

  await prisma.playbookInstall.create({
    data: {
      tenantId: tenant.id,
      restaurantId: restaurant.id,
      playbookKey: "pizza_curbside_v1",
      version: "1.0.0",
      isActive: true,
      configJson: {
        keyword: "PIZZA",
        requiresSpot: true,
        requiresVehicle: true
      }
    }
  });

  await prisma.rule.create({
    data: {
      tenantId: tenant.id,
      restaurantId: restaurant.id,
      name: "Curbside requires arrival details",
      ruleType: RuleType.FULFILLMENT,
      conditionJson: { fulfillmentType: "CURBSIDE" },
      actionJson: { require: ["curbsideSpot", "carColor", "carModel"] },
      isActive: true
    }
  });

  // 8) customer
  const customer = await prisma.customer.create({
    data: {
      tenantId: tenant.id,
      firstName: "Ariel",
      lastName: "Demo",
      email: "ariel.demo@example.com",
      phone: "6305550199",
      preferredLocale: "es",
      smsOptIn: true,
      emailOptIn: true
    }
  });

  const address = await prisma.customerAddress.create({
    data: {
      tenantId: tenant.id,
      customerId: customer.id,
      label: "Casa",
      addressLine1: "456 Sample St",
      city: "Bloomingdale",
      state: "IL",
      postalCode: "60108",
      country: "US",
      deliveryInstructions: "Tocar la puerta principal",
      isDefault: true
    }
  });

  // 9) pickup order
  const pickupOrder = await prisma.order.create({
    data: {
      tenantId: tenant.id,
      restaurantId: restaurant.id,
      customerId: customer.id,
      orderNumber: "D1001",
      status: OrderStatus.COMPLETED,
      fulfillmentType: FulfillmentType.PICKUP,
      sourceChannel: SourceChannel.WEB,
      currency: "USD",
      subtotalAmount: "29.98",
      taxAmount: "2.40",
      serviceFeeAmount: "0.00",
      deliveryFeeAmount: "0.00",
      tipAmount: "4.00",
      discountAmount: "0.00",
      totalAmount: "36.38",
      customerNotes: "Extra napkins please",
      placedAt: new Date(),
      confirmedAt: new Date(),
      completedAt: new Date()
    }
  });

  await prisma.orderItem.createMany({
    data: [
      {
        tenantId: tenant.id,
        orderId: pickupOrder.id,
        menuItemId: pepperoni.id,
        nameSnapshot: "Pepperoni Pizza",
        unitPriceSnapshot: "16.99",
        quantity: 1,
        lineSubtotal: "16.99",
        sortOrder: 1
      },
      {
        tenantId: tenant.id,
        orderId: pickupOrder.id,
        menuItemId: wings.id,
        nameSnapshot: "10 Piece Wings",
        unitPriceSnapshot: "12.99",
        quantity: 1,
        lineSubtotal: "12.99",
        sortOrder: 2
      }
    ]
  });

  await prisma.orderStatusEvent.createMany({
    data: [
      { tenantId: tenant.id, orderId: pickupOrder.id, toStatus: OrderStatus.PLACED, actorType: ActorType.CUSTOMER },
      { tenantId: tenant.id, orderId: pickupOrder.id, fromStatus: OrderStatus.PLACED, toStatus: OrderStatus.CONFIRMED, actorType: ActorType.STAFF },
      { tenantId: tenant.id, orderId: pickupOrder.id, fromStatus: OrderStatus.CONFIRMED, toStatus: OrderStatus.COMPLETED, actorType: ActorType.STAFF }
    ]
  });

  await prisma.fulfillment.create({
    data: {
      tenantId: tenant.id,
      orderId: pickupOrder.id,
      type: FulfillmentType.PICKUP,
      pickupName: "Ariel Demo",
      pickupPhone: "6305550199",
      handoffAt: new Date()
    }
  });

  await prisma.payment.create({
    data: {
      tenantId: tenant.id,
      orderId: pickupOrder.id,
      provider: PaymentProvider.STRIPE,
      status: PaymentStatus.CAPTURED,
      currency: "USD",
      amountAuthorized: "36.38",
      amountCaptured: "36.38",
      amountRefunded: "0.00",
      capturedAt: new Date()
    }
  });

  await prisma.ledgerEntry.createMany({
    data: [
      { tenantId: tenant.id, orderId: pickupOrder.id, type: LedgerEntryType.SUBTOTAL, amount: "29.98", currency: "USD", description: "Food subtotal" },
      { tenantId: tenant.id, orderId: pickupOrder.id, type: LedgerEntryType.TAX, amount: "2.40", currency: "USD", description: "Sales tax" },
      { tenantId: tenant.id, orderId: pickupOrder.id, type: LedgerEntryType.TIP, amount: "4.00", currency: "USD", description: "Customer tip" }
    ]
  });

  // 10) curbside order
  const curbsideOrder = await prisma.order.create({
    data: {
      tenantId: tenant.id,
      restaurantId: restaurant.id,
      customerId: customer.id,
      orderNumber: "D1002",
      status: OrderStatus.READY,
      fulfillmentType: FulfillmentType.CURBSIDE,
      sourceChannel: SourceChannel.SMS,
      currency: "USD",
      subtotalAmount: "16.99",
      taxAmount: "1.36",
      serviceFeeAmount: "0.00",
      deliveryFeeAmount: "0.00",
      tipAmount: "3.00",
      discountAmount: "0.00",
      totalAmount: "21.35",
      customerNotes: "Text when ready",
      placedAt: new Date(),
      confirmedAt: new Date()
    }
  });

  await prisma.orderItem.create({
    data: {
      tenantId: tenant.id,
      orderId: curbsideOrder.id,
      menuItemId: hawaiian.id,
      nameSnapshot: "Hawaiian Pizza",
      unitPriceSnapshot: "17.99",
      quantity: 1,
      lineSubtotal: "17.99",
      sortOrder: 1
    }
  });

  await prisma.orderStatusEvent.createMany({
    data: [
      { tenantId: tenant.id, orderId: curbsideOrder.id, toStatus: OrderStatus.PLACED, actorType: ActorType.CUSTOMER },
      { tenantId: tenant.id, orderId: curbsideOrder.id, fromStatus: OrderStatus.PLACED, toStatus: OrderStatus.CONFIRMED, actorType: ActorType.STAFF },
      { tenantId: tenant.id, orderId: curbsideOrder.id, fromStatus: OrderStatus.CONFIRMED, toStatus: OrderStatus.READY, actorType: ActorType.STAFF }
    ]
  });

  await prisma.fulfillment.create({
    data: {
      tenantId: tenant.id,
      orderId: curbsideOrder.id,
      type: FulfillmentType.CURBSIDE,
      pickupName: "Ariel Demo",
      pickupPhone: "6305550199",
      curbsideSpot: "3",
      carColor: "Blue",
      carModel: "Honda Civic",
      arrivalNotifiedAt: new Date()
    }
  });

  await prisma.payment.create({
    data: {
      tenantId: tenant.id,
      orderId: curbsideOrder.id,
      provider: PaymentProvider.STRIPE,
      status: PaymentStatus.CAPTURED,
      currency: "USD",
      amountAuthorized: "21.35",
      amountCaptured: "21.35",
      amountRefunded: "0.00",
      capturedAt: new Date()
    }
  });

  await prisma.ledgerEntry.createMany({
    data: [
      { tenantId: tenant.id, orderId: curbsideOrder.id, type: LedgerEntryType.SUBTOTAL, amount: "17.99", currency: "USD", description: "Food subtotal" },
      { tenantId: tenant.id, orderId: curbsideOrder.id, type: LedgerEntryType.TAX, amount: "1.36", currency: "USD", description: "Sales tax" },
      { tenantId: tenant.id, orderId: curbsideOrder.id, type: LedgerEntryType.TIP, amount: "3.00", currency: "USD", description: "Customer tip" }
    ]
  });

  // 11) conversation
  await prisma.conversation.create({
    data: {
      tenantId: tenant.id,
      restaurantId: restaurant.id,
      customerId: customer.id,
      channel: "SMS",
      status: "OPEN",
      messages: {
        create: [
          {
            tenantId: tenant.id,
            direction: "INBOUND",
            senderType: "CUSTOMER",
            body: "PIZZA",
            messageType: "TEXT",
            deliveryStatus: "DELIVERED"
          },
          {
            tenantId: tenant.id,
            direction: "OUTBOUND",
            senderType: "SYSTEM",
            body: "Reply with your order or open the order link.",
            messageType: "TEXT",
            deliveryStatus: "SENT"
          }
        ]
      }
    }
  });

  console.log("Seed completado.");
  console.log({
    tenantId: tenant.id,
    restaurantId: restaurant.id,
    menuId: menu.id,
    pizzasCategoryId: pizzasCategory.id,
    customerId: customer.id,
    addressId: address.id,
    pickupOrderId: pickupOrder.id,
    curbsideOrderId: curbsideOrder.id,
    pepperoniId: pepperoni.id,
    wingsId: wings.id,
    sodaId: soda.id
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });