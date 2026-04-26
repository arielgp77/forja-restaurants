# W2-B04 — Provider Connection Adapters

## Goal
Make provider connection feel easy for restaurant clients:
- Stripe -> Connect button
- Square -> Connect button
- Adyen -> hidden advanced config

## Storage
Current MVP stores provider connection state in:
- state/provider-connections.json

## Routes
- GET /api/provider-connections/stripe/start
- GET /api/provider-connections/stripe/callback
- GET /api/provider-connections/square/start
- GET /api/provider-connections/square/callback
- POST /api/provider-connections/adyen/save
- POST /api/provider-connections/disconnect
- GET /api/provider-connections/list

## Internal page
- /ops/payments/connections

## Production hardening later
- encrypt tokens at rest
- move storage to DB
- add auth gate to ops route
- add revoke/refresh flows
- migrate Stripe connection to final Connect onboarding strategy if needed
