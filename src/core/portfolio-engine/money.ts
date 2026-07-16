const DEFAULT_MONEY_PRECISION = 8;
const DEFAULT_QUANTITY_PRECISION = 10;
const EPSILON = 1e-9;

export function finiteNumber(
  value: unknown,
  fallback = 0,
): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value === "bigint") {
    const converted = Number(value);
    return Number.isFinite(converted) ? converted : fallback;
  }

  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return fallback;
  }

  const isParenthesisedNegative =
    trimmed.startsWith("(") && trimmed.endsWith(")");

  const cleaned = trimmed
    .replace(/[,$£€¥\s]/g, "")
    .replace(/^\+/, "")
    .replace(/^\((.*)\)$/, "$1");

  const parsed = Number(cleaned);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return isParenthesisedNegative ? -Math.abs(parsed) : parsed;
}

export function positiveFiniteNumber(
  value: unknown,
  fallback = 0,
): number {
  const parsed = finiteNumber(value, fallback);
  return parsed > 0 ? parsed : fallback;
}

export function nonNegativeFiniteNumber(
  value: unknown,
  fallback = 0,
): number {
  const parsed = finiteNumber(value, fallback);
  return parsed >= 0 ? parsed : fallback;
}

export function decimalPlaces(value: unknown): number {
  const text = String(value ?? "").trim();

  if (!text) {
    return 0;
  }

  const scientificMatch = text.match(
    /^[-+]?(\d+)(?:\.(\d*))?[eE]([-+]?\d+)$/,
  );

  if (scientificMatch) {
    const decimals = scientificMatch[2]?.length ?? 0;
    const exponent = Number(scientificMatch[3] ?? 0);
    return Math.max(0, decimals - exponent);
  }

  const decimalIndex = text.indexOf(".");

  if (decimalIndex < 0) {
    return 0;
  }

  return text.length - decimalIndex - 1;
}

export function roundTo(
  value: number,
  precision = DEFAULT_MONEY_PRECISION,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const safePrecision = Math.min(
    12,
    Math.max(0, Math.trunc(precision)),
  );

  const factor = 10 ** safePrecision;

  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function roundMoney(
  value: number,
  precision = DEFAULT_MONEY_PRECISION,
): number {
  return roundTo(value, precision);
}

export function roundQuantity(
  value: number,
  precision = DEFAULT_QUANTITY_PRECISION,
): number {
  return roundTo(value, precision);
}

export function addMoney(
  left: number,
  right: number,
  precision = DEFAULT_MONEY_PRECISION,
): number {
  return roundMoney(
    finiteNumber(left) + finiteNumber(right),
    precision,
  );
}

export function subtractMoney(
  left: number,
  right: number,
  precision = DEFAULT_MONEY_PRECISION,
): number {
  return roundMoney(
    finiteNumber(left) - finiteNumber(right),
    precision,
  );
}

export function multiplyMoney(
  left: number,
  right: number,
  precision = DEFAULT_MONEY_PRECISION,
): number {
  return roundMoney(
    finiteNumber(left) * finiteNumber(right),
    precision,
  );
}

export function divideMoney(
  numerator: number,
  denominator: number,
  fallback = 0,
  precision = DEFAULT_MONEY_PRECISION,
): number {
  const safeNumerator = finiteNumber(numerator);
  const safeDenominator = finiteNumber(denominator);

  if (
    Math.abs(safeDenominator) <= EPSILON ||
    !Number.isFinite(safeNumerator / safeDenominator)
  ) {
    return fallback;
  }

  return roundMoney(
    safeNumerator / safeDenominator,
    precision,
  );
}

export function percentage(
  numerator: number,
  denominator: number,
  fallback = 0,
): number {
  return multiplyMoney(
    divideMoney(numerator, denominator, fallback),
    100,
  );
}

export function approximatelyEqual(
  left: number,
  right: number,
  tolerance = 0.000001,
): boolean {
  const safeLeft = finiteNumber(left);
  const safeRight = finiteNumber(right);
  const safeTolerance = Math.abs(finiteNumber(tolerance, 0.000001));

  return Math.abs(safeLeft - safeRight) <= safeTolerance;
}

export function clampNearZero(
  value: number,
  tolerance = EPSILON,
): number {
  const safeValue = finiteNumber(value);
  return Math.abs(safeValue) <= Math.abs(tolerance)
    ? 0
    : safeValue;
}

export function toAud(
  amount: number,
  fxRateToAud: number,
  precision = DEFAULT_MONEY_PRECISION,
): number {
  return multiplyMoney(amount, fxRateToAud, precision);
}

export function fromAud(
  amountAud: number,
  fxRateToAud: number,
  precision = DEFAULT_MONEY_PRECISION,
): number {
  return divideMoney(
    amountAud,
    fxRateToAud,
    0,
    precision,
  );
}

export function calculateGrossAmount(
  quantity: number,
  unitPrice: number,
  precision = DEFAULT_MONEY_PRECISION,
): number {
  return multiplyMoney(
    Math.abs(finiteNumber(quantity)),
    Math.abs(finiteNumber(unitPrice)),
    precision,
  );
}

export function calculateBuyNetAmount(
  grossAmount: number,
  fees: number,
  tax = 0,
  precision = DEFAULT_MONEY_PRECISION,
): number {
  return roundMoney(
    Math.abs(finiteNumber(grossAmount)) +
      Math.abs(finiteNumber(fees)) +
      Math.abs(finiteNumber(tax)),
    precision,
  );
}

export function calculateSellNetAmount(
  grossAmount: number,
  fees: number,
  tax = 0,
  precision = DEFAULT_MONEY_PRECISION,
): number {
  return roundMoney(
    Math.max(
      0,
      Math.abs(finiteNumber(grossAmount)) -
        Math.abs(finiteNumber(fees)) -
        Math.abs(finiteNumber(tax)),
    ),
    precision,
  );
}

export function weightedAverage(
  currentQuantity: number,
  currentAverage: number,
  addedQuantity: number,
  addedUnitValue: number,
  fallback = 0,
): number {
  const safeCurrentQuantity = Math.max(
    0,
    finiteNumber(currentQuantity),
  );

  const safeAddedQuantity = Math.max(
    0,
    finiteNumber(addedQuantity),
  );

  const totalQuantity = safeCurrentQuantity + safeAddedQuantity;

  if (totalQuantity <= EPSILON) {
    return fallback;
  }

  const currentValue =
    safeCurrentQuantity * finiteNumber(currentAverage);

  const addedValue =
    safeAddedQuantity * finiteNumber(addedUnitValue);

  return divideMoney(
    currentValue + addedValue,
    totalQuantity,
    fallback,
  );
}

export function sumFinite(
  values: readonly number[],
  precision = DEFAULT_MONEY_PRECISION,
): number {
  return roundMoney(
    values.reduce(
      (sum, value) => sum + finiteNumber(value),
      0,
    ),
    precision,
  );
}

export function safeMin(
  values: readonly number[],
  fallback = 0,
): number {
  const finiteValues = values.filter(Number.isFinite);

  return finiteValues.length
    ? Math.min(...finiteValues)
    : fallback;
}

export function safeMax(
  values: readonly number[],
  fallback = 0,
): number {
  const finiteValues = values.filter(Number.isFinite);

  return finiteValues.length
    ? Math.max(...finiteValues)
    : fallback;
}

export function assertFiniteFinancialValue(
  value: number,
  fieldName: string,
): number {
  if (!Number.isFinite(value)) {
    throw new Error(
      `Portfolio Engine produced a non-finite value for ${fieldName}.`,
    );
  }

  return value;
}
