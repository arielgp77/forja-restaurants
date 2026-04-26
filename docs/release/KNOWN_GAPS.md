# KNOWN GAPS — MVP V1

1. Auth sigue en modo dev-cookie; no hay proveedor real.
2. No hay Stripe real.
3. No hay Twilio real; SMS inbound es mock.
4. No hay realtime websocket/pusher.
5. Payout ledger es estimado, no settlement real.
6. El smoke web final de pricing/tips debe confirmarse manualmente.
7. No hay transition guard semantico por fulfillment beyond V1.
8. No hay audit actor nominal; solo actorType.