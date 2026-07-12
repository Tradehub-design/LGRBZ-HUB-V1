export function holdingsV2FormatCurrency(
  value:
    | number
    | null
    | undefined,
  currency = "AUD",
  decimals = 2
) {
  if (
    value ===
      null ||
    value ===
      undefined
  ) {
    return "—";
  }

  return new Intl.NumberFormat(
    "en-AU",
    {
      style: "currency",
      currency,
      minimumFractionDigits:
        decimals,
      maximumFractionDigits:
        decimals,
    }
  ).format(value);
}

export function holdingsV2FormatNumber(
  value:
    | number
    | null
    | undefined,
  decimals = 2
) {
  if (
    value ===
      null ||
    value ===
      undefined
  ) {
    return "—";
  }

  return new Intl.NumberFormat(
    "en-AU",
    {
      minimumFractionDigits:
        decimals,
      maximumFractionDigits:
        decimals,
    }
  ).format(value);
}

export function holdingsV2FormatPercentage(
  value:
    | number
    | null
    | undefined,
  decimals = 2,
  includeSign = false
) {
  if (
    value ===
      null ||
    value ===
      undefined
  ) {
    return "—";
  }

  const sign =
    includeSign &&
    value > 0
      ? "+"
      : "";

  return `${sign}${value.toFixed(
    decimals
  )}%`;
}

export function holdingsV2FormatDate(
  value:
    | string
    | null
    | undefined
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "en-AU",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

export function holdingsV2FormatDateTime(
  value:
    | string
    | null
    | undefined
) {
  if (!value) {
    return "Not available";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleString(
    "en-AU",
    {
      dateStyle:
        "medium",
      timeStyle:
        "short",
    }
  );
}

export function holdingsV2ToneClass(
  value:
    | number
    | null
    | undefined
) {
  if (
    value ===
      null ||
    value ===
      undefined ||
    value === 0
  ) {
    return "text-slate-600 dark:text-slate-300";
  }

  return value > 0
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-red-600 dark:text-red-400";
}

export function holdingsV2FormatCompactCurrency(
  value:
    | number
    | null
    | undefined,
  currency = "AUD"
) {
  if (
    value ===
      null ||
    value ===
      undefined
  ) {
    return "—";
  }

  return new Intl.NumberFormat(
    "en-AU",
    {
      style:
        "currency",
      currency,
      notation:
        "compact",
      maximumFractionDigits:
        1,
    }
  ).format(value);
}
