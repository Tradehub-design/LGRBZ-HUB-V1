"use client";

import {
  Database,
  LayoutList,
  Plus,
  RotateCcw,
  ShieldCheck,
  TableProperties,
} from "lucide-react";
import {
  lazy,
  Suspense,
  useEffect,
  useState,
} from "react";
import { ProfessionalTransactionsSection } from "@/components/transactions/ProfessionalTransactionsSection";

const LegacyTransactionsPage = lazy(
  () =>
    import(
      "./legacy-transactions-page"
    )
);

type TransactionView =
  | "professional"
  | "legacy";

const VIEW_STORAGE_KEY =
  "lgrbz.transactions.route-view.v1";

function loadInitialView(): TransactionView {
  if (
    typeof window ===
    "undefined"
  ) {
    return "professional";
  }

  try {
    const stored =
      window.localStorage.getItem(
        VIEW_STORAGE_KEY
      );

    return stored === "legacy"
      ? "legacy"
      : "professional";
  } catch {
    return "professional";
  }
}

function LegacyLoadingState() {
  return (
    <section
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
      aria-busy="true"
      aria-label="Loading existing transaction tools"
    >
      <div className="flex animate-pulse items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800" />

        <div className="space-y-2">
          <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-72 max-w-full rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900"
          />
        ))}
      </div>

      <div className="mt-4 h-96 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
    </section>
  );
}

function ViewButton({
  active,
  icon: Icon,
  title,
  description,
  onClick,
}: {
  active: boolean;
  icon: typeof TableProperties;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex min-w-0 flex-1 items-start gap-3 rounded-2xl border p-4 text-left transition ${
        active
          ? "border-slate-950 bg-slate-950 text-white shadow-lg dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900"
      }`}
    >
      <span
        className={`rounded-xl p-2 ${
          active
            ? "bg-white/10 dark:bg-slate-950/10"
            : "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300"
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>

      <span className="min-w-0">
        <span className="block text-sm font-semibold">
          {title}
        </span>

        <span
          className={`mt-1 block text-xs leading-5 ${
            active
              ? "text-slate-300 dark:text-slate-600"
              : "text-slate-500"
          }`}
        >
          {description}
        </span>
      </span>
    </button>
  );
}

export default function ProfessionalTransactionsRoute() {
  const [view, setView] =
    useState<TransactionView>(
      "professional"
    );

  const [
    hydrated,
    setHydrated,
  ] = useState(false);

  useEffect(() => {
    setView(
      loadInitialView()
    );

    setHydrated(true);
  }, []);

  const changeView = (
    nextView: TransactionView
  ) => {
    setView(nextView);

    try {
      window.localStorage.setItem(
        VIEW_STORAGE_KEY,
        nextView
      );
    } catch {
      // View persistence should never block the Transactions page.
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openLegacyEntryTools =
    () => {
      changeView("legacy");

      window.requestAnimationFrame(
        () => {
          window.setTimeout(
            () => {
              const interactive =
                document.querySelector<HTMLElement>(
                  [
                    'button[data-action="add-transaction"]',
                    'button[aria-label*="Add transaction" i]',
                    'button[aria-label*="New transaction" i]',
                    'button[title*="Add transaction" i]',
                    'button[title*="New transaction" i]',
                  ].join(",")
                );

              if (interactive) {
                interactive.focus();

                interactive.scrollIntoView(
                  {
                    behavior:
                      "smooth",
                    block:
                      "center",
                  }
                );
              }
            },
            250
          );
        }
      );
    };

  if (!hydrated) {
    return (
      <div className="space-y-5">
        <section className="h-36 animate-pulse rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950" />

        <LegacyLoadingState />
      </div>
    );
  }

  return (
    <main className="space-y-5">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  <Database className="h-3.5 w-3.5" />
                  Transaction Ledger
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Ledger connected
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50 sm:text-3xl">
                Transactions
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Use the professional workspace for daily transaction management. The existing ledger tools remain available and have not been removed or rewritten.
              </p>
            </div>

            <button
              type="button"
              onClick={
                openLegacyEntryTools
              }
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
            >
              <Plus className="h-4 w-4" />
              Add Transaction
            </button>
          </div>
        </div>

        <div className="grid gap-3 p-4 lg:grid-cols-2">
          <ViewButton
            active={
              view ===
              "professional"
            }
            icon={
              TableProperties
            }
            title="Professional Workspace"
            description="Search, filters, pagination, editing, deletion, CSV exports, quality review, shortcuts and responsive transaction management."
            onClick={() =>
              changeView(
                "professional"
              )
            }
          />

          <ViewButton
            active={
              view ===
              "legacy"
            }
            icon={
              LayoutList
            }
            title="Existing Ledger Tools"
            description="Preserved transaction entry, ledger application, seed controls and any existing workflows from the working Transactions page."
            onClick={() =>
              changeView(
                "legacy"
              )
            }
          />
        </div>
      </section>

      {view ===
      "professional" ? (
        <ProfessionalTransactionsSection
          onAddTransaction={
            openLegacyEntryTools
          }
        />
      ) : (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900 dark:bg-blue-950/30 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-950 dark:text-blue-100">
                Existing ledger tools
              </p>

              <p className="mt-1 text-xs leading-5 text-blue-700 dark:text-blue-300">
                This is the original working Transactions page, preserved without rewriting its ledger workflow.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                changeView(
                  "professional"
                )
              }
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-300 bg-white px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-slate-950 dark:text-blue-300 dark:hover:bg-blue-950"
            >
              <RotateCcw className="h-4 w-4" />
              Return to Professional
            </button>
          </div>

          <Suspense
            fallback={
              <LegacyLoadingState />
            }
          >
            <LegacyTransactionsPage />
          </Suspense>
        </section>
      )}
    </main>
  );
}
