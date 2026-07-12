import {
  DashboardExecutiveMetric,
} from "./dashboardV2Types";

export function dashboardFormatCurrency(
  value: number,
  currency = "AUD",
  decimals = 0
) {
  return new Intl.NumberFormat(
    "en-AU",
    {
      style: "currency",
      currency:
        currency || "AUD",
      minimumFractionDigits:
        decimals,
      maximumFractionDigits:
        decimals,
    }
  ).format(value);
}

export function dashboardFormatPercentage(
  value: number,
  decimals = 2,
  includeSign = false
) {
  const sign =
    includeSign &&
    value > 0
      ? "+"
      : "";

  return `${sign}${value.toFixed(
    decimals
  )}%`;
}

export function dashboardFormatNumber(
  value: number,
  decimals = 0
) {
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

export function dashboardFormatMetric(
  metric: DashboardExecutiveMetric
) {
  if (
    metric.loading
  ) {
    return "";
  }

  if (
    metric.value ===
      null ||
    metric.value ===
      undefined ||
    metric.value ===
      ""
  ) {
    return (
      metric.unavailableLabel ??
      "—"
    );
  }

  if (
    typeof metric.value ===
    "string"
  ) {
    return metric.value;
  }

  if (
    metric.format ===
    "currency"
  ) {
    return dashboardFormatCurrency(
      metric.value,
      metric.currency ??
        "AUD",
      metric.decimals ??
        0
    );
  }

  if (
    metric.format ===
    "percentage"
  ) {
    return dashboardFormatPercentage(
      metric.value,
      metric.decimals ??
        2,
      true
    );
  }

  if (
    metric.format ===
    "number"
  ) {
    return dashboardFormatNumber(
      metric.value,
      metric.decimals ??
        0
    );
  }

  return String(
    metric.value
  );
}

export function dashboardFormatDateTime(
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

export function dashboardFormatCompactDate(
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

export function dashboardToneFromValue(
  value:
    | number
    | null
    | undefined
) {
  if (
    value === null ||
    value === undefined ||
    value === 0
  ) {
    return "neutral" as const;
  }

  return value > 0
    ? "positive" as const
    : "negative" as const;
}
