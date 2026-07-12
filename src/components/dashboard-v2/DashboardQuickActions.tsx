"use client";

import Link from "next/link";
import {
  ArrowRight,
  Zap,
} from "lucide-react";
import {
  DashboardQuickAction,
} from "./dashboardV2Types";

type Props = {
  actions: DashboardQuickAction[];
  title?: string;
  description?: string;
};

function actionClasses(
  tone:
    DashboardQuickAction["tone"]
) {
  if (
    tone === "primary"
  ) {
    return "border-slate-950 bg-slate-950 text-white hover:bg-slate-800 dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white";
  }

  if (
    tone === "danger"
  ) {
    return "border-red-200 bg-white text-red-700 hover:bg-red-50 dark:border-red-900 dark:bg-slate-950 dark:text-red-300 dark:hover:bg-red-950/30";
  }

  return "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900";
}

function DashboardQuickActionButton({
  action,
}: {
  action: DashboardQuickAction;
}) {
  const Icon =
    action.icon;

  const content = (
    <>
      <span className="flex min-w-0 items-start gap-3">
        {Icon && (
          <span className="rounded-xl bg-slate-100/80 p-2 text-slate-600 group-[.primary]:bg-white/15 group-[.primary]:text-white dark:bg-slate-900 dark:text-slate-300">
            <Icon className="h-4 w-4" />
          </span>
        )}

        <span className="min-w-0">
          <span className="block text-sm font-semibold">
            {action.label}
          </span>

          {action.description && (
            <span className="mt-1 block text-xs leading-5 opacity-70">
              {action.description}
            </span>
          )}
        </span>
      </span>

      <ArrowRight className="h-4 w-4 shrink-0 opacity-50 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
    </>
  );

  const className =
    `group flex min-h-[72px] w-full items-center justify-between gap-3 rounded-2xl border p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 ${actionClasses(
      action.tone
    )} ${
      action.tone ===
      "primary"
        ? "primary"
        : ""
    }`;

  if (
    action.href &&
    !action.disabled
  ) {
    return (
      <Link
        href={
          action.href
        }
        className={
          className
        }
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={
        action.disabled
      }
      onClick={
        action.onClick
      }
      className={
        className
      }
    >
      {content}
    </button>
  );
}

export function DashboardQuickActions({
  actions,
  title =
    "Quick Actions",
  description =
    "Move directly to the most common portfolio tasks.",
}: Props) {
  if (
    actions.length ===
    0
  ) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-amber-100 p-2 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
          <Zap className="h-4 w-4" />
        </span>

        <div>
          <h2 className="text-base font-semibold text-slate-950 dark:text-slate-50">
            {title}
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {actions.map(
          (action) => (
            <DashboardQuickActionButton
              key={
                action.id
              }
              action={
                action
              }
            />
          )
        )}
      </div>
    </section>
  );
}
