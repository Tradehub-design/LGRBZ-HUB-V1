"use client";

import {
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";

type PositionIntelligenceErrorProps = {
  onRetry: () => void;
};

export function PositionIntelligenceError({
  onRetry,
}: PositionIntelligenceErrorProps) {
  return (
    <div className="flex min-h-[420px] items-center justify-center p-6">
      <section className="w-full max-w-lg rounded-2xl border border-rose-400/20 bg-rose-400/5 p-6 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/10 text-rose-300">
          <AlertTriangle className="h-6 w-6" />
        </span>

        <h2 className="mt-4 text-lg font-semibold text-white">
          Position intelligence could not be prepared
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          The underlying holding has not been changed. Retry the position
          calculation or close the drawer and reopen the holding.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-cyan-300"
        >
          <RefreshCcw className="h-4 w-4" />

          Retry position
        </button>
      </section>
    </div>
  );
}
