"use client";

import {
  PositionDividendIntelligence,
} from "./PositionDividendIntelligence";

import {
  createHoldingsVisualSnapshot,
} from "@/lib/holdings-professional/holdingsVisualEngine";

import {
  PositionFifoLots,
} from "./PositionFifoLots";

import {
  PositionActivityTimeline,
} from "./PositionActivityTimeline";

import {
  BarChart3,
  BookOpenText,
  CircleDollarSign,
  Layers3,
  ListTree,
  ReceiptText,
} from "lucide-react";
import type {
  PositionIntelligenceSummary,
  PositionIntelligenceTab,
} from "@/lib/holdings-professional/positionIntelligenceModels";
import {
  PositionHealthOverview,
} from "./PositionHealthOverview";
import {
  PositionQuickActions,
} from "./PositionQuickActions";

type PositionIntelligenceTabsProps = {
  summary:
    PositionIntelligenceSummary;

  activeTab:
    PositionIntelligenceTab;

  onTabChange:
    (
      tab:
        PositionIntelligenceTab
    ) => void;
};

const tabs:
  Array<{
    key:
      PositionIntelligenceTab;

    label: string;

    icon:
      typeof Layers3;
  }> = [
    {
      key:
        "OVERVIEW",

      label:
        "Overview",

      icon:
        Layers3,
    },
    {
      key:
        "LOTS",

      label:
        "FIFO Lots",

      icon:
        ListTree,
    },
    {
      key:
        "ACTIVITY",

      label:
        "Activity",

      icon:
        ReceiptText,
    },
    {
      key:
        "DIVIDENDS",

      label:
        "Dividends",

      icon:
        CircleDollarSign,
    },
    {
      key:
        "ANALYTICS",

      label:
        "Analytics",

      icon:
        BarChart3,
    },
    {
      key:
        "NOTES",

      label:
        "Notes",

      icon:
        BookOpenText,
    },
  ];

function FoundationPanel({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon:
    typeof Layers3;
}) {
  return (
    <section className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/25 p-6 text-center">
      <div className="max-w-md">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
          <Icon className="h-6 w-6" />
        </span>

        <h2 className="mt-4 text-lg font-semibold text-white">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </section>
  );
}

export function PositionIntelligenceTabs({
  summary,
  activeTab,
  onTabChange,
}: PositionIntelligenceTabsProps) {
  const portfolioSnapshot =
    createHoldingsVisualSnapshot([
      summary.position,
    ]);

  return (
    <div>
      <nav
        aria-label="Position intelligence sections"
        className="flex max-w-full gap-1 overflow-x-auto border-b border-slate-800 bg-[#071522] px-4 py-3 sm:px-6"
      >
        {tabs.map(
          tab => {
            const Icon =
              tab.icon;

            const active =
              tab.key ===
              activeTab;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  onTabChange(
                    tab.key
                  );
                }}
                aria-pressed={active}
                className={[
                  "inline-flex",
                  "shrink-0",
                  "items-center",
                  "gap-2",
                  "rounded-xl",
                  "px-3",
                  "py-2",
                  "text-xs",
                  "font-semibold",
                  "transition",
                  active
                    ? "bg-cyan-400 text-slate-950"
                    : "text-slate-500 hover:bg-slate-800 hover:text-slate-200",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />

                {tab.label}
              </button>
            );
          }
        )}
      </nav>

      <div className="p-4 sm:p-6">
        {activeTab ===
        "OVERVIEW" ? (
          <div className="space-y-5">
            <section className="rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300/80">
                Generated Position Summary
              </p>

              <div className="mt-4 space-y-3">
                {summary.generatedSummary.map(
                  statement => (
                    <p
                      key={statement}
                      className="flex gap-3 text-sm leading-6 text-slate-400"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />

                      <span>
                        {statement}
                      </span>
                    </p>
                  )
                )}
              </div>
            </section>

            <PositionHealthOverview
              summary={
                summary
              }
            />

            <PositionQuickActions
              summary={
                summary
              }
            />
          </div>
        ) : null}

        {activeTab ===
        "LOTS" ? (
          <PositionFifoLots
            summary={
              summary
            }
          />
        ) : null}

        {activeTab ===
        "ACTIVITY" ? (
          <PositionActivityTimeline
            summary={
              summary
            }
          />
        ) : null}

        {activeTab ===
        "DIVIDENDS" ? (
          <PositionDividendIntelligence
            summary={
              summary
            }
            portfolioSnapshot={
              portfolioSnapshot
            }
          />
        ) : null}

        {activeTab ===
        "ANALYTICS" ? (
          <FoundationPanel
            title="Position analytics foundation"
            description="Price history, cost-basis overlays, position-weight history and return charts are added in Bash 11.3C.4."
            icon={
              BarChart3
            }
          />
        ) : null}

        {activeTab ===
        "NOTES" ? (
          <FoundationPanel
            title="Position notes foundation"
            description="Investment thesis, bull case, bear case, exit strategy and review reminders are added in Bash 11.3C.4."
            icon={
              BookOpenText
            }
          />
        ) : null}
      </div>
    </div>
  );
}
