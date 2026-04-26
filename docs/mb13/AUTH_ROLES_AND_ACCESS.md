# MB13 — AUTH ROLES AND ACCESS

## Roles
### owner
- acceso total tenant
- gestión de usuarios
- acceso a órdenes, ops y configuración

### manager
- acceso a órdenes, ops y configuración operativa
- sin control total de cuentas raíz

### staff
- acceso básico a panel operativo

### kitchen
- acceso solo a vistas de cocina / preparación

### pickup
- acceso solo a pickup / curbside / frontdesk

## Matriz inicial
| Área | owner | manager | staff | kitchen | pickup |
|---|---|---|---|---|---|
| Orders board | yes | yes | yes | yes | yes |
| Ops board | yes | yes | yes | limited | yes |
| Config tenant | yes | yes | no | no | no |
| Users / roles | yes | limited | no | no | no |
| Internal APIs | scoped | scoped | scoped | scoped | scoped |

## Política inicial
- deny by default
- allow by role
- tenant scoped always