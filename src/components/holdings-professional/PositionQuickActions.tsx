"use client";

import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CircleDollarSign,
  Download,
  ExternalLink,
  Plus,
  ReceiptText,
} from "lucide-react";
import type {
  PositionIntelligenceSummary,
} from "@/lib/holdings-professional/positionIntelligenceModels";

type PositionQuickActionsProps = {
  summary:
    PositionIntelligenceSummary;
};

export function PositionQuickActions({
  summary,
}: PositionQuickActionsProps) {
  const symbol =
    encodeURIComponent(
      summary.position.symbol
    );

  const actions = [
    {
      label:
        "Add transaction",

      href:
        `/transactions?symbol=${symbol}&action=buy`,

      icon:
        Plus,
    },
    {
      label:
        "Sell shares",

      href:
        `/transactions?symbol=${symbol}&action=sell`,

      icon:
        ArrowUpRight,
    },
    {
      label:
        "View transactions",

      href:
        `/transactions?symbol=${symbol}`,

      icon:
        ReceiptText,
    },
    {
      label:
        "View dividends",

      href:
        `/dividends?symbol=${symbol}`,

      icon:
        CircleDollarSign,
    },
    {
      label:
        "Open analytics",

      href:
        `/analytics?symbol=${symbol}`,

      icon:
        BarChart3,
    },
    {
      label:
        "Export foundation",

      href:
        `/reports?symbol=${symbol}`,

      icon:
        Download,
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/35 p-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300/80">
          Position Actions
        </p>

        <h2 className="mt-1 text-lg font-semibold text-white">
          Quick actions
        </h2>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {actions.map(
          action => {
            const Icon =
              action.icon;

            return (
              <Link
                key={action.label}
                href={action.href}
                className="group flex items-center gap-3 rounded-xl border border-slate-800 bg-[#071522] p-3 transition hover:border-cyan-400/25 hover:bg-slate-900/70"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-300">
                  <Icon className="h-4 w-4" />
                </span>

                <span className="min-w-0 flex-1 text-xs font-semibold text-slate-300">
                  {action.label}
                </span>

                <ExternalLink className="h-3.5 w-3.5 text-slate-700 transition group-hover:text-cyan-300" />
              </Link>
            );
          }
        )}
      </div>

      <div className="mt-3 rounded-xl border border-dashed border-slate-700 p-3">
        <p className="inline-flex items-center gap-2 text-[11px] text-slate-600">
          <ArrowDownRight className="h-3.5 w-3.5 text-violet-300" />

          FIFO lot editing, detailed exports and external company links arrive
          in the remaining 11.3C bashes.
        </p>
      </div>
    </section>
  );
}
