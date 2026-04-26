interface TipSelectorProps {
  value: number;
  options: number[];
  onChange: (value: number) => void;
}

export function TipSelector({
  value,
  options,
  onChange,
}: TipSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option === value;
        const label = option === 0 ? "No tip" : `${option}%`;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={
              active
                ? "rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white"
                : "rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
