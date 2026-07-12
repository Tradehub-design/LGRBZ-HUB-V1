export function isHoldingsV2Record(
  value: unknown
): value is Record<
  string,
  unknown
> {
  return (
    Boolean(value) &&
    typeof value ===
      "object" &&
    !Array.isArray(value)
  );
}

export function holdingsV2ReadPath(
  source: unknown,
  path: string
) {
  if (!path) {
    return source;
  }

  const parts =
    path.split(".");

  let current:
    unknown = source;

  for (
    const part of parts
  ) {
    if (
      !isHoldingsV2Record(
        current
      )
    ) {
      return undefined;
    }

    current =
      current[part];
  }

  return current;
}

export function holdingsV2FirstDefined(
  source: unknown,
  paths: string[]
) {
  for (
    const path of paths
  ) {
    const value =
      holdingsV2ReadPath(
        source,
        path
      );

    if (
      value !==
        undefined &&
      value !==
        null &&
      value !==
        ""
    ) {
      return {
        path,
        value,
      };
    }
  }

  return {
    path: null,
    value: undefined,
  };
}

export function holdingsV2Number(
  value: unknown
): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  if (
    typeof value ===
    "number"
  ) {
    return Number.isFinite(
      value
    )
      ? value
      : null;
  }

  const text =
    String(value)
      .trim()
      .replace(
        /[$,%\s]/g,
        ""
      )
      .replace(
        /\(([^)]+)\)/,
        "-$1"
      );

  if (!text) {
    return null;
  }

  const parsed =
    Number(text);

  return Number.isFinite(
    parsed
  )
    ? parsed
    : null;
}

export function holdingsV2String(
  value: unknown,
  fallback = ""
) {
  if (
    value === null ||
    value === undefined
  ) {
    return fallback;
  }

  const result =
    String(value).trim();

  return result ||
    fallback;
}

export function holdingsV2Date(
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
    value instanceof Date
  ) {
    return Number.isNaN(
      value.getTime()
    )
      ? null
      : value.toISOString();
  }

  if (
    typeof value ===
      "number" &&
    Number.isFinite(value)
  ) {
    const date =
      new Date(value);

    return Number.isNaN(
      date.getTime()
    )
      ? null
      : date.toISOString();
  }

  const text =
    String(value).trim();

  const date =
    new Date(text);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return text ||
      null;
  }

  return date.toISOString();
}

export function holdingsV2Array(
  value: unknown
): unknown[] {
  return Array.isArray(
    value
  )
    ? value
    : [];
}

export function holdingsV2Boolean(
  value: unknown,
  fallback = false
) {
  if (
    typeof value ===
    "boolean"
  ) {
    return value;
  }

  if (
    value === true ||
    value === "true" ||
    value === 1 ||
    value === "1"
  ) {
    return true;
  }

  if (
    value === false ||
    value === "false" ||
    value === 0 ||
    value === "0"
  ) {
    return false;
  }

  return fallback;
}

export function holdingsV2Currency(
  value: unknown,
  fallback = "AUD"
) {
  const result =
    holdingsV2String(
      value,
      fallback
    )
      .toUpperCase()
      .slice(0, 3);

  return result ||
    fallback;
}

export function holdingsV2StringArray(
  value: unknown
) {
  if (
    Array.isArray(value)
  ) {
    return Array.from(
      new Set(
        value
          .map(
            (entry) =>
              holdingsV2String(
                entry
              )
          )
          .filter(Boolean)
      )
    );
  }

  if (
    typeof value ===
    "string"
  ) {
    return Array.from(
      new Set(
        value
          .split(
            /[,|;]/
          )
          .map(
            (entry) =>
              entry.trim()
          )
          .filter(Boolean)
      )
    );
  }

  return [];
}

export function holdingsV2CreateId(
  prefix: string,
  index: number,
  preferred?: unknown
) {
  const value =
    holdingsV2String(
      preferred
    );

  return (
    value ||
    `${prefix}-${index + 1}`
  );
}
