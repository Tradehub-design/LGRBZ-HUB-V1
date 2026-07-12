import type {
  DividendEvent,
  DividendEventStatus,
  DividendFrequency,
  DividendProviderId,
} from "./dividendTypes";

export function dividendNumber(
  value: unknown
): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const parsed =
    typeof value === "number"
      ? value
      : Number(
          String(value)
            .replace(/[$,%\s,]/g, "")
            .trim()
        );

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

export function dividendDate(
  value: unknown
): string | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    const milliseconds =
      value < 10_000_000_000
        ? value * 1000
        : value;

    const date =
      new Date(milliseconds);

    return Number.isNaN(
      date.getTime()
    )
      ? null
      : date.toISOString();
  }

  const text =
    String(value).trim();

  if (!text) {
    return null;
  }

  const date =
    new Date(text);

  return Number.isNaN(
    date.getTime()
  )
    ? null
    : date.toISOString();
}

export function dividendText(
  value: unknown,
  fallback = ""
) {
  if (
    value === null ||
    value === undefined
  ) {
    return fallback;
  }

  return (
    String(value).trim() ||
    fallback
  );
}

export function dividendCurrency(
  value: unknown,
  fallback = "AUD"
) {
  return dividendText(
    value,
    fallback
  )
    .toUpperCase()
    .slice(0, 3);
}

export function createDividendId(
  provider: DividendProviderId,
  symbol: string,
  date: string | null,
  amount: number | null,
  index = 0
) {
  return [
    provider,
    symbol,
    date || "undated",
    amount ?? "unknown",
    index,
  ]
    .join("-")
    .replace(
      /[^A-Za-z0-9._-]/g,
      "-"
    );
}

export function dividendStatusFromDates(
  paymentDate: string | null,
  declarationDate: string | null,
  provider: DividendProviderId
): DividendEventStatus {
  if (
    provider === "forecast"
  ) {
    return "FORECAST";
  }

  const today =
    new Date();

  const payment =
    paymentDate
      ? new Date(paymentDate)
      : null;

  if (
    payment &&
    !Number.isNaN(
      payment.getTime()
    ) &&
    payment.getTime() <
      today.getTime()
  ) {
    return "UNKNOWN";
  }

  if (
    declarationDate ||
    paymentDate
  ) {
    return "ANNOUNCED";
  }

  return "UNKNOWN";
}

export function inferDividendFrequency(
  events: DividendEvent[]
): DividendFrequency {
  const dated =
    events
      .map(
        (event) =>
          event.exDate ||
          event.paymentDate
      )
      .filter(
        (
          value
        ): value is string =>
          Boolean(value)
      )
      .map(
        (value) =>
          new Date(value)
      )
      .filter(
        (value) =>
          !Number.isNaN(
            value.getTime()
          )
      )
      .sort(
        (left, right) =>
          left.getTime() -
          right.getTime()
      );

  if (dated.length < 2) {
    return "UNKNOWN";
  }

  const intervals: number[] = [];

  for (
    let index = 1;
    index < dated.length;
    index += 1
  ) {
    intervals.push(
      (
        dated[index].getTime() -
        dated[index - 1].getTime()
      ) /
        86_400_000
    );
  }

  const average =
    intervals.reduce(
      (total, value) =>
        total + value,
      0
    ) /
    intervals.length;

  if (average <= 45) {
    return "MONTHLY";
  }

  if (average <= 120) {
    return "QUARTERLY";
  }

  if (average <= 220) {
    return "SEMI_ANNUAL";
  }

  if (average <= 430) {
    return "ANNUAL";
  }

  return "IRREGULAR";
}

export function sortDividendEvents(
  events: DividendEvent[]
) {
  return [...events].sort(
    (left, right) => {
      const leftDate =
        left.paymentDate ||
        left.exDate ||
        left.declarationDate ||
        "";

      const rightDate =
        right.paymentDate ||
        right.exDate ||
        right.declarationDate ||
        "";

      return (
        new Date(leftDate).getTime() -
        new Date(rightDate).getTime()
      );
    }
  );
}

export function deduplicateDividendEvents(
  events: DividendEvent[]
) {
  const map =
    new Map<
      string,
      DividendEvent
    >();

  for (
    const event of events
  ) {
    const key = [
      event.symbol,
      event.exDate || "",
      event.paymentDate || "",
      event.dividendPerShare ?? "",
      event.currency,
    ].join("|");

    const existing =
      map.get(key);

    if (!existing) {
      map.set(
        key,
        event
      );

      continue;
    }

    const existingRank =
      existing.status ===
      "ANNOUNCED"
        ? 3
        : existing.status ===
            "RECEIVED"
          ? 4
          : existing.status ===
              "FORECAST"
            ? 2
            : 1;

    const nextRank =
      event.status ===
      "ANNOUNCED"
        ? 3
        : event.status ===
            "RECEIVED"
          ? 4
          : event.status ===
              "FORECAST"
            ? 2
            : 1;

    if (
      nextRank >
      existingRank
    ) {
      map.set(
        key,
        event
      );
    }
  }

  return sortDividendEvents(
    Array.from(
      map.values()
    )
  );
}

export function isDateWithin(
  value: string | null,
  startDate: Date,
  endDate: Date
) {
  if (!value) {
    return false;
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return false;
  }

  return (
    date >= startDate &&
    date <= endDate
  );
}
