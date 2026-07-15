"use client";

import type {
  LiveQuoteStatusDescriptor,
  LiveQuoteStoreEntry,
} from "@/lib/market-data/client/liveQuoteClientTypes";
import {
  describeLiveQuoteEntry,
} from "@/lib/market-data/client/liveQuoteStatus";

type LiveQuoteStatusBadgeProps = {
  entry:
    LiveQuoteStoreEntry |
    null;

  compact?: boolean;

  showProvider?: boolean;
};

function statusClasses(
  status:
    LiveQuoteStatusDescriptor
): string {
  if (
    status.live
  ) {
    return [
      "border-emerald-400/30",
      "bg-emerald-400/10",
      "text-emerald-200",
    ].join(
      " "
    );
  }

  if (
    status.delayed
  ) {
    return [
      "border-amber-400/30",
      "bg-amber-400/10",
      "text-amber-200",
    ].join(
      " "
    );
  }

  if (
    status.stale ||
    status.expired
  ) {
    return [
      "border-rose-400/30",
      "bg-rose-400/10",
      "text-rose-200",
    ].join(
      " "
    );
  }

  if (
    status.indicative
  ) {
    return [
      "border-violet-400/30",
      "bg-violet-400/10",
      "text-violet-200",
    ].join(
      " "
    );
  }

  if (
    status.usable
  ) {
    return [
      "border-sky-400/30",
      "bg-sky-400/10",
      "text-sky-200",
    ].join(
      " "
    );
  }

  return [
    "border-slate-600",
    "bg-slate-800/70",
    "text-slate-300",
  ].join(
    " "
  );
}

function indicatorClasses(
  status:
    LiveQuoteStatusDescriptor
): string {
  if (
    status.live
  ) {
    return "bg-emerald-400";
  }

  if (
    status.delayed
  ) {
    return "bg-amber-400";
  }

  if (
    status.stale ||
    status.expired
  ) {
    return "bg-rose-400";
  }

  if (
    status.indicative
  ) {
    return "bg-violet-400";
  }

  if (
    status.usable
  ) {
    return "bg-sky-400";
  }

  return "bg-slate-500";
}

export function LiveQuoteStatusBadge({
  entry,
  compact =
    false,
  showProvider =
    true,
}: LiveQuoteStatusBadgeProps) {
  const status =
    describeLiveQuoteEntry(
      entry
    );

  const loading =
    entry?.state ===
      "LOADING" ||
    entry?.state ===
      "REFRESHING";

  const label =
    loading
      ? entry?.state ===
          "REFRESHING"
        ? "Refreshing"
        : "Loading"
      : compact
        ? status.shortLabel
        : status.label;

  return (
    <span
      title={status.message}
      className={[
        "inline-flex",
        "items-center",
        "gap-1.5",
        "rounded-full",
        "border",
        "px-2.5",
        "py-1",
        "text-[11px]",
        "font-semibold",
        "tracking-wide",
        statusClasses(
          status
        ),
      ].join(
        " "
      )}
    >
      <span
        aria-hidden="true"
        className={[
          "h-1.5",
          "w-1.5",
          "rounded-full",
          loading
            ? "animate-pulse bg-current"
            : indicatorClasses(
                status
              ),
        ].join(
          " "
        )}
      />

      <span>
        {label}
      </span>

      {showProvider &&
      status.provider ? (
        <span className="text-current/60">
          · {status.provider.replaceAll(
            "_",
            " "
          )}
        </span>
      ) : null}
    </span>
  );
}
