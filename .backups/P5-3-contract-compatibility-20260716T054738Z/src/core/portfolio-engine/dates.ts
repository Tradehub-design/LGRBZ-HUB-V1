const EXCEL_EPOCH_UTC = Date.UTC(1899, 11, 30);
const MILLISECONDS_PER_DAY = 86_400_000;

export type DateNormalisationResult =
  | {
      ok: true;
      isoDate: string;
      isoTimestamp: string;
      originalValue: unknown;
    }
  | {
      ok: false;
      isoDate: null;
      isoTimestamp: null;
      originalValue: unknown;
      reason: string;
    };

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function isValidDateParts(
  year: number,
  month: number,
  day: number,
): boolean {
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return false;
  }

  if (year < 1900 || year > 2200) {
    return false;
  }

  if (month < 1 || month > 12) {
    return false;
  }

  if (day < 1 || day > 31) {
    return false;
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function buildDateResult(
  year: number,
  month: number,
  day: number,
  originalValue: unknown,
): DateNormalisationResult {
  if (!isValidDateParts(year, month, day)) {
    return {
      ok: false,
      isoDate: null,
      isoTimestamp: null,
      originalValue,
      reason: `Invalid calendar date: ${String(originalValue ?? "")}`,
    };
  }

  const isoDate = `${year}-${pad(month)}-${pad(day)}`;

  return {
    ok: true,
    isoDate,
    isoTimestamp: `${isoDate}T00:00:00.000Z`,
    originalValue,
  };
}

function parseNumericDate(
  value: number,
): DateNormalisationResult {
  if (!Number.isFinite(value)) {
    return {
      ok: false,
      isoDate: null,
      isoTimestamp: null,
      originalValue: value,
      reason: "Date is not a finite number.",
    };
  }

  if (value > 20_000 && value < 100_000) {
    const timestamp =
      EXCEL_EPOCH_UTC + Math.floor(value) * MILLISECONDS_PER_DAY;

    const date = new Date(timestamp);

    return buildDateResult(
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
      value,
    );
  }

  if (value > 1_000_000_000_000) {
    return parseDateValue(new Date(value));
  }

  if (value > 1_000_000_000) {
    return parseDateValue(new Date(value * 1000));
  }

  return {
    ok: false,
    isoDate: null,
    isoTimestamp: null,
    originalValue: value,
    reason: `Unsupported numeric date value: ${value}`,
  };
}

function parseSlashDate(
  text: string,
): DateNormalisationResult | null {
  const match = text.match(
    /^(\d{1,2})[/.](\d{1,2})[/.](\d{2}|\d{4})$/,
  );

  if (!match) {
    return null;
  }

  const first = Number(match[1]);
  const second = Number(match[2]);

  let year = Number(match[3]);

  if (year < 100) {
    year += year >= 70 ? 1900 : 2000;
  }

  /**
   * Master workbook and application locale are Australian.
   *
   * Therefore ambiguous slash dates are interpreted as DD/MM/YYYY.
   */
  return buildDateResult(
    year,
    second,
    first,
    text,
  );
}

function parseIsoLikeDate(
  text: string,
): DateNormalisationResult | null {
  const match = text.match(
    /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s].*)?$/,
  );

  if (!match) {
    return null;
  }

  return buildDateResult(
    Number(match[1]),
    Number(match[2]),
    Number(match[3]),
    text,
  );
}

function parseCompactDate(
  text: string,
): DateNormalisationResult | null {
  const match = text.match(
    /^(\d{4})(\d{2})(\d{2})$/,
  );

  if (!match) {
    return null;
  }

  return buildDateResult(
    Number(match[1]),
    Number(match[2]),
    Number(match[3]),
    text,
  );
}

export function parseDateValue(
  value: unknown,
): DateNormalisationResult {
  if (value instanceof Date) {
    if (!Number.isFinite(value.getTime())) {
      return {
        ok: false,
        isoDate: null,
        isoTimestamp: null,
        originalValue: value,
        reason: "Date object is invalid.",
      };
    }

    return buildDateResult(
      value.getUTCFullYear(),
      value.getUTCMonth() + 1,
      value.getUTCDate(),
      value,
    );
  }

  if (typeof value === "number") {
    return parseNumericDate(value);
  }

  const text = String(value ?? "").trim();

  if (!text) {
    return {
      ok: false,
      isoDate: null,
      isoTimestamp: null,
      originalValue: value,
      reason: "Date is empty.",
    };
  }

  const isoLike = parseIsoLikeDate(text);

  if (isoLike) {
    return isoLike;
  }

  const slashDate = parseSlashDate(text);

  if (slashDate) {
    return slashDate;
  }

  const compactDate = parseCompactDate(text);

  if (compactDate) {
    return compactDate;
  }

  const timestamp = Date.parse(text);

  if (!Number.isFinite(timestamp)) {
    return {
      ok: false,
      isoDate: null,
      isoTimestamp: null,
      originalValue: value,
      reason: `Unsupported date format: ${text}`,
    };
  }

  const parsed = new Date(timestamp);

  return buildDateResult(
    parsed.getUTCFullYear(),
    parsed.getUTCMonth() + 1,
    parsed.getUTCDate(),
    value,
  );
}

export function requireIsoDate(value: unknown): string {
  const result = parseDateValue(value);

  if (!result.ok) {
    throw new Error(result.reason);
  }

  return result.isoDate;
}

export function optionalIsoDate(
  value: unknown,
): string | undefined {
  if (
    value === undefined ||
    value === null ||
    String(value).trim() === ""
  ) {
    return undefined;
  }

  const result = parseDateValue(value);

  return result.ok ? result.isoDate : undefined;
}

export function normaliseTimestamp(
  value: unknown,
  fallback: string,
): string {
  if (value instanceof Date && Number.isFinite(value.getTime())) {
    return value.toISOString();
  }

  const text = String(value ?? "").trim();

  if (!text) {
    return fallback;
  }

  const timestamp = Date.parse(text);

  if (!Number.isFinite(timestamp)) {
    return fallback;
  }

  return new Date(timestamp).toISOString();
}
