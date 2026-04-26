import type { CheckoutFulfillment } from "../../lib/checkout/types";

interface FulfillmentSelectorProps {
  value: CheckoutFulfillment;
  onChange: (value: CheckoutFulfillment) => void;
}

const OPTIONS: Array<{ id: CheckoutFulfillment; label: string; hint: string }> = [
  { id: "pickup", label: "Pickup", hint: "Recoges en tienda." },
  { id: "curbside", label: "Curbside", hint: "Te lo llevan al carro." },
  { id: "delivery", label: "Delivery", hint: "Entrega a domicilio." },
];

export function FulfillmentSelector({
  value,
  onChange,
}: FulfillmentSelectorProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {OPTIONS.map((option) => {
        const active = option.id === value;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={
              active
                ? "rounded-[1.5rem] border border-neutral-950 bg-neutral-950 p-4 text-left text-white"
                : "rounded-[1.5rem] border border-neutral-300 bg-white p-4 text-left text-neutral-900 hover:bg-neutral-50"
            }
          >
            <p className="text-sm font-bold">{option.label}</p>
            <p className={active ? "mt-2 text-sm text-white/80" : "mt-2 text-sm text-neutral-500"}>
              {option.hint}
            </p>
          </button>
        );
      })}
    </div>
  );
}
