import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../infra/db/generated/client/client.ts";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: "demo-pizzeria" },
    include: {
      restaurants: {
        include: {
          profile: true,
          theme: true,
          storySections: true,
          menus: {
            include: {
              categories: {
                include: {
                  items: {
                    include: {
                      modifierGroups: {
                        include: {
                          options: true
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          orders: {
            include: {
              items: true,
              fulfillment: true,
              payment: true,
              ledgerEntries: true
            }
          }
        }
      }
    }
  });

  if (!tenant) {
    throw new Error("No existe tenant demo-pizzeria");
  }

  const restaurant = tenant.restaurants[0];
  const categories = restaurant?.menus?.[0]?.categories?.length ?? 0;
  const orders = restaurant?.orders?.length ?? 0;

  console.log(JSON.stringify({
    tenantSlug: tenant.slug,
    restaurantSlug: restaurant?.publicSlug,
    categories,
    orders
  }, null, 2));
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });