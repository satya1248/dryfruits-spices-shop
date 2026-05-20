import { SHIPPING_STEPS, getShippingProgress } from "@/lib/orderLabels";
import type { OrderDTO, ShippingStatus } from "@/types";

interface ShippingTimelineProps {
  currentStatus: ShippingStatus;
  updates?: OrderDTO["shippingUpdates"];
  trackingNumber?: string;
  carrier?: string;
}

export function ShippingTimeline({
  currentStatus,
  updates,
  trackingNumber,
  carrier,
}: ShippingTimelineProps) {
  const progress = getShippingProgress(currentStatus);
  const currentIndex = SHIPPING_STEPS.findIndex((s) => s.status === currentStatus);

  return (
    <div>
      {trackingNumber && (
        <div className="mb-4 rounded-lg bg-amber-50 px-4 py-3">
          <p className="text-sm text-stone-600">Tracking number</p>
          <p className="font-mono text-lg font-semibold text-stone-900">{trackingNumber}</p>
          {carrier && <p className="mt-1 text-sm text-stone-500">Carrier: {carrier}</p>}
        </div>
      )}

      <div className="h-2 w-full overflow-hidden rounded-full bg-amber-100">
        <div
          className="h-full rounded-full bg-amber-700 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol className="mt-6 space-y-4">
        {SHIPPING_STEPS.map((step, index) => {
          const done = index <= currentIndex;
          return (
            <li key={step.status} className="flex gap-3">
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  done
                    ? "bg-amber-800 text-amber-50"
                    : "border border-amber-200 bg-white text-stone-400"
                }`}
              >
                {index + 1}
              </span>
              <div>
                <p className={`font-medium ${done ? "text-stone-900" : "text-stone-400"}`}>
                  {step.label}
                </p>
                <p className="text-sm text-stone-500">{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {updates && updates.length > 0 && (
        <div className="mt-6 border-t border-amber-100 pt-4">
          <p className="text-sm font-medium text-stone-700">Activity</p>
          <ul className="mt-2 space-y-2">
            {[...updates].reverse().map((u, i) => (
              <li key={`${u.at}-${i}`} className="text-sm text-stone-600">
                <span className="font-medium text-stone-800">{u.message}</span>
                <span className="text-stone-400">
                  {" "}
                  · {new Date(u.at).toLocaleString("en-IN")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
