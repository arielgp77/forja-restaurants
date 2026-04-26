# MIGRATION NOTES — EXECUTABLE

## Orden
1. configurar DATABASE_URL
2. format schema
3. validate schema
4. generate client
5. create initial migration
6. run seed demo
7. smoke query

## Comandos sugeridos
```powershell
cd C:\Users\ariel\LaForja\forja-restaurants
npx prisma format --schema .\infra\db\schema.prisma
npx prisma validate --schema .\infra\db\schema.prisma
npx prisma generate --schema .\infra\db\schema.prisma
npx prisma migrate dev --schema .\infra\db\schema.prisma --name init_forja_restaurants
Seed

Necesitarás registrar el seed en package.json o ejecutarlo con tsx/ts-node según tu setup.
