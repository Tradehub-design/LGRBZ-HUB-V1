"use client";

import {
  Activity,
  CircleDollarSign,
  Database,
  Gauge,
  ShieldCheck,
} from "lucide-react";
import type {
  PositionHealthIndicator,
  PositionIntelligenceSummary,
} from "@/lib/holdings-professional/positionIntelligenceModels";

type PositionHealthOverviewProps = {
  summary:
    PositionIntelligenceSummary;
};

function colourClass(
  level:
    PositionHealthIndicator["level"]
): string {
  if (level === "STRONG") {
    return "text-emerald-300";
  }

  if (level === "HEALTHY") {
    return "text-sky-300";
  }

  if (level === "WATCH") {
    return "text-amber-300";
  }

  return "text-rose-300";
}

function barClass(
  level:
    PositionHealthIndicator["level"]
): string {
  if (level === "STRONG") {
    return "from-emerald-400 to-teal-300";
  }

  if (level === "HEALTHY") {
    return "from-sky-400 to-cyan-300";
  }

  if (level === "WATCH") {
    return "from-amber-400 to-orange-300";
  }

  return "from-rose-400 to-red-300";
}

function indicatorIcon(
  key: string
) {
  if (key === "CONCENTRATION") {
    return Gauge;
  }

  if (key === "PERFORMANCE") {
    return Activity;
  }

  if (key === "INCOME") {
    return CircleDollarSign;
  }

  if (key === "DATA") {
    return Database;
  }

  return ShieldCheck;
}

export function PositionHealthOverview({
  summary,
}: PositionHealthOverviewProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/35 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300/80">
            Position Health
          </p>

          <h2 className="mt-1 text-lg font-semibold text-white">
            Risk and quality overview
          </h2>
        </div>

        <div className="text-right">
          <p
            className={[
              "text-3xl",
              "font-semibold",
              colourClass(
                summary.healthLevel
              ),
            ].join(" ")}
          >
            {summary.healthScore.toFixed(
              0
            )}
          </p>

          <p className="text-[10px] text-slate-600">
            out of 100
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {summary.healthIndicators.map(
          indicator => {
            const Icon =
              indicatorIcon(
                indicator.key
              );

            return (
              <article
                key={indicator.key}
                className="rounded-xl border border-slate-800 bg-[#071522] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-400">
                      <Icon className="h-4 w-4" />
                    </span>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        {indicator.label}
                      </p>

                      <p
                        className={[
                          "mt-1",
                          "text-xs",
                          "font-semibold",
                          colourClass(
                            indicator.level
                          ),
                        ].join(" ")}
                      >
                        {indicator.value}
                      </p>
                    </div>
                  </div>

                  <span
                    className={[
                      "text-xs",
                      "font-semibold",
                      colourClass(
                        indicator.level
                      ),
                    ].join(" ")}
                  >
                    {indicator.score.toFixed(
                      0
                    )}
                  </span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={[
                      "h-full",
                      "rounded-full",
                      "bg-gradient-to-r",
                      barClass(
                        indicator.level
                      ),
                    ].join(" ")}
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(
                          100,
                          indicator.score
                        )
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-[11px] leading-5 text-slate-600">
                  {indicator.description}
                </p>
              </article>
            );
          }
        )}
      </div>
    </section>
  );
}
