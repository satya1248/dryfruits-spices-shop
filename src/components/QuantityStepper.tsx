"use client";

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
  disabled = false,
}: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center rounded-lg border border-amber-200 bg-white">
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="px-3 py-2 text-stone-600 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="min-w-[2.5rem] px-2 text-center text-sm font-medium text-stone-800">
        {value}
      </span>
      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="px-3 py-2 text-stone-600 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
