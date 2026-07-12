import type {
  DividendEventStatus,
} from "@/lib/dividend-data";

export function formatDividendMoney(
  value: number | null | undefined,
  currency = "AUD",
  maximumFractionDigits = 2
) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  try {
    return new Intl.NumberFormat(
      "en-AU",
      {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits,
      }
    ).format(value);
  } catch {
    return `${currency} ${value.toFixed(
      maximumFractionDigits
    )}`;
  }
}

export function formatDividendNumber(
  value: number | null | undefined,
  digits = 2
) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return value.toLocaleString(
    "en-AU",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: digits,
    }
  );
}

export function formatDividendPercent(
  value: number | null | undefined
) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return `${value.toFixed(2)}%`;
}

export function formatDividendDate(
  value: string | null | undefined,
  includeYear = true
) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-AU",
    {
      day: "2-digit",
      month: "short",
      year: includeYear
        ? "numeric"
        : undefined,
    }
  );
}

export function formatDividendMonth(
  value: Date
) {
  return value.toLocaleDateString(
    "en-AU",
    {
      month: "long",
      year: "numeric",
    }
  );
}

export function daysUntilDividend(
  value: string | null | undefined
) {
  if (!value) {
    return null;
  }

  const target =
    new Date(value);

  if (
    Number.isNaN(
      target.getTime()
    )
  ) {
    return null;
  }

  const today =
    new Date();

  const startToday =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

  const startTarget =
    new Date(
      target.getFullYear(),
      target.getMonth(),
      target.getDate()
    );

  return Math.ceil(
    (
      startTarget.getTime() -
      startToday.getTime()
    ) /
      86_400_000
  );
}

export function dividendStatusClasses(
  status: DividendEventStatus
) {
  if (
    status === "ANNOUNCED"
  ) {
    return "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300";
  }

  if (
    status === "FORECAST"
  ) {
    return "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300";
  }

  if (
    status === "RECEIVED"
  ) {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300";
  }

  if (
    status === "CANCELLED"
  ) {
    return "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300";
  }

  return "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300";
}
