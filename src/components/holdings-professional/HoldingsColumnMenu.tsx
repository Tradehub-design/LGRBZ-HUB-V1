"use client";

import {
  Check,
  Columns3,
} from "lucide-react";
import type {
  HoldingsColumnKey,
} from "@/lib/holdings-professional/holdingsTableModels";

type HoldingsColumnMenuProps = {
  visibleColumns:
    HoldingsColumnKey[];

  onChange:
    (
      columns:
        HoldingsColumnKey[]
    ) => void;
};

const labels:
  Record<
    HoldingsColumnKey,
    string
  > = {
    RANK:
      "Rank",

    HOLDING:
      "Holding",

    QUANTITY:
      "Quantity",

    MARKET_VALUE:
      "Market value",

    WEIGHT:
      "Weight",

    DAILY_CHANGE:
      "Today",

    TOTAL_RETURN:
      "Total return",

    GAIN_LOSS:
      "Gain/loss",

    DIVIDEND_YIELD:
      "Dividend yield",

    ANNUAL_INCOME:
      "Annual income",

    SECTOR:
      "Sector",

    COUNTRY:
      "Country",

    QUOTE_STATUS:
      "Quote status",
  };

export function HoldingsColumnMenu({
  visibleColumns,
  onChange,
}: HoldingsColumnMenuProps) {
  return (
    <details className="relative">
      <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/60 px-3 text-xs font-semibold text-slate-300 transition hover:border-slate-600">
        <Columns3 className="h-4 w-4 text-cyan-300" />

        Columns
      </summary>

      <div className="absolute right-0 top-full z-40 mt-2 w-60 rounded-xl border border-slate-700 bg-[#071522] p-2 shadow-2xl">
        <p className="px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
          Visible columns
        </p>

        <div className="max-h-80 overflow-y-auto">
          {(
            Object.keys(
              labels
            ) as HoldingsColumnKey[]
          ).map(
            column => {
              const selected =
                visibleColumns.includes(
                  column
                );

              const locked =
                column ===
                "HOLDING";

              return (
                <button
                  key={column}
                  type="button"
                  disabled={locked}
                  onClick={() => {
                    if (locked) {
                      return;
                    }

                    onChange(
                      selected
                        ? visibleColumns.filter(
                            item =>
                              item !==
                              column
                          )
                        : [
                            ...visibleColumns,
                            column,
                          ]
                    );
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-xs text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>
                    {labels[
                      column
                    ]}
                  </span>

                  {selected ? (
                    <Check className="h-3.5 w-3.5 text-cyan-300" />
                  ) : null}
                </button>
              );
            }
          )}
        </div>
      </div>
    </details>
  );
}
