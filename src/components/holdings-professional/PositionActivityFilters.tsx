"use client";

import type {
  PositionActivityFilter,
} from "@/lib/holdings-professional/positionActivityModels";

type PositionActivityFiltersProps = {
  value:
    PositionActivityFilter;

  counts:
    Partial<
      Record<
        PositionActivityFilter,
        number
      >
    >;

  onChange:
    (
      value:
        PositionActivityFilter
    ) => void;
};

const filters:
  Array<{
    value:
      PositionActivityFilter;

    label: string;
  }> = [
    {
      value: "ALL",
      label: "All",
    },
    {
      value: "BUY",
      label: "Buys",
    },
    {
      value: "SELL",
      label: "Sells",
    },
    {
      value: "DIVIDEND",
      label: "Dividends",
    },
    {
      value: "DRP",
      label: "DRP",
    },
    {
      value: "SPLIT",
      label: "Splits",
    },
    {
      value: "TRANSFER",
      label: "Transfers",
    },
    {
      value: "CORPORATE_ACTION",
      label: "Corporate actions",
    },
  ];

export function PositionActivityFilters({
  value,
  counts,
  onChange,
}: PositionActivityFiltersProps) {
  return (
    <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/50 p-1">
      {filters.map(
        filter => {
          const active =
            filter.value ===
            value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => {
                onChange(
                  filter.value
                );
              }}
              className={[
                "inline-flex",
                "shrink-0",
                "items-center",
                "gap-1.5",
                "rounded-lg",
                "px-3",
                "py-2",
                "text-[10px]",
                "font-semibold",
                "transition",
                active
                  ? "bg-cyan-400 text-slate-950"
                  : "text-slate-500 hover:bg-slate-800 hover:text-slate-200",
              ].join(" ")}
            >
              {filter.label}

              <span
                className={[
                  "rounded-full",
                  "px-1.5",
                  "py-0.5",
                  "text-[9px]",
                  active
                    ? "bg-slate-950/15"
                    : "bg-slate-800",
                ].join(" ")}
              >
                {counts[
                  filter.value
                ] || 0}
              </span>
            </button>
          );
        }
      )}
    </div>
  );
}
