# Provider Notes

## Stripe
- first real embedded implementation
- server creates PaymentIntent
- client later mounts Payment Element using publishableKey + clientSecret

## Square
- first fast path is hosted checkout link
- easiest for early demo customers
- server returns checkoutUrl for redirect

## Adyen
- sessions-based component flow
- server returns session + clientKey
- client later mounts AdyenCheckout components
