import {
  WatchlistSecurity,
  WatchlistState,
} from "@/lib/watchlist/watchlistTypes";

export type WatchlistCsvImportResult = {
  securities: WatchlistSecurity[];
  errors: string[];
  warnings: string[];
  totalRows: number;
  validRows: number;
};

const headers = [
  "symbol",
  "name",
  "exchange",
  "currency",
  "sector",
  "industry",
  "price",
  "previousClose",
  "targetPrice",
  "analystRating",
  "fiftyTwoWeekHigh",
  "fiftyTwoWeekLow",
  "notes",
  "tags",
];

function escapeCsv(
  value: unknown
) {
  const text =
    String(
      value ?? ""
    );

  if (
    text.includes(",") ||
    text.includes('"') ||
    text.includes("\n")
  ) {
    return `"${text.replace(
      /"/g,
      '""'
    )}"`;
  }

  return text;
}

export function watchlistSecuritiesToCsv(
  securities: WatchlistSecurity[]
) {
  const rows = [
    headers.join(","),
    ...securities.map(
      (security) =>
        [
          security.symbol,
          security.name,
          security.exchange,
          security.currency,
          security.sector,
          security.industry,
          security.price,
          security.previousClose,
          security.targetPrice ??
            "",
          security.analystRating,
          security.fiftyTwoWeekHigh,
          security.fiftyTwoWeekLow,
          security.note,
          (
            security.tags ??
            []
          ).join("|"),
        ]
          .map(
            escapeCsv
          )
          .join(",")
    ),
  ];

  return rows.join(
    "\n"
  );
}

function parseCsvLine(
  line: string
) {
  const values:
    string[] = [];

  let value = "";
  let quoted = false;

  for (
    let index = 0;
    index < line.length;
    index += 1
  ) {
    const character =
      line[index];

    if (
      character === '"'
    ) {
      if (
        quoted &&
        line[
          index + 1
        ] === '"'
      ) {
        value += '"';
        index += 1;
      } else {
        quoted =
          !quoted;
      }

      continue;
    }

    if (
      character === "," &&
      !quoted
    ) {
      values.push(
        value
      );

      value = "";

      continue;
    }

    value += character;
  }

  values.push(value);

  return values;
}

function createSecurityId(
  symbol: string
) {
  if (
    typeof crypto !==
      "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return `watch-security-${crypto.randomUUID()}`;
  }

  return `watch-security-${symbol.toLowerCase()}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

function numberOrZero(
  value: unknown
) {
  const number =
    Number(value);

  return Number.isFinite(
    number
  )
    ? number
    : 0;
}

export function parseWatchlistCsv(
  csv: string
): WatchlistCsvImportResult {
  const lines =
    csv
      .replace(
        /\r\n/g,
        "\n"
      )
      .replace(
        /\r/g,
        "\n"
      )
      .split("\n")
      .filter(
        (line) =>
          line.trim()
      );

  if (
    lines.length ===
    0
  ) {
    return {
      securities: [],
      errors: [
        "The CSV file is empty.",
      ],
      warnings: [],
      totalRows: 0,
      validRows: 0,
    };
  }

  const headerValues =
    parseCsvLine(
      lines[0]
    ).map(
      (value) =>
        value
          .trim()
          .toLowerCase()
    );

  const headerMap =
    new Map<
      string,
      number
    >();

  headerValues.forEach(
    (
      header,
      index
    ) =>
      headerMap.set(
        header,
        index
      )
  );

  const symbolIndex =
    headerMap.get(
      "symbol"
    );

  if (
    symbolIndex ===
    undefined
  ) {
    return {
      securities: [],
      errors: [
        'The CSV must contain a "symbol" column.',
      ],
      warnings: [],
      totalRows:
        Math.max(
          0,
          lines.length - 1
        ),
      validRows: 0,
    };
  }

  const errors:
    string[] = [];

  const warnings:
    string[] = [];

  const securities:
    WatchlistSecurity[] = [];

  const valueFor = (
    values: string[],
    name: string
  ) => {
    const index =
      headerMap.get(
        name.toLowerCase()
      );

    return index ===
      undefined
      ? ""
      : values[index] ??
          "";
  };

  lines
    .slice(1)
    .forEach(
      (
        line,
        rowIndex
      ) => {
        const values =
          parseCsvLine(
            line
          );

        const symbol =
          valueFor(
            values,
            "symbol"
          )
            .trim()
            .toUpperCase();

        if (!symbol) {
          errors.push(
            `Row ${rowIndex + 2}: symbol is required.`
          );

          return;
        }

        const price =
          numberOrZero(
            valueFor(
              values,
              "price"
            )
          );

        const previousClose =
          numberOrZero(
            valueFor(
              values,
              "previousclose"
            )
          );

        const change =
          price -
          previousClose;

        const changePercent =
          previousClose > 0
            ? (
                change /
                previousClose
              ) *
              100
            : 0;

        const now =
          new Date().toISOString();

        securities.push({
          id:
            createSecurityId(
              symbol
            ),
          symbol,
          name:
            valueFor(
              values,
              "name"
            ).trim() ||
            symbol,
          exchange:
            valueFor(
              values,
              "exchange"
            )
              .trim()
              .toUpperCase() ||
            "ASX",
          currency:
            valueFor(
              values,
              "currency"
            )
              .trim()
              .toUpperCase() ||
            "AUD",
          sector:
            valueFor(
              values,
              "sector"
            ).trim() ||
            "Unclassified",
          industry:
            valueFor(
              values,
              "industry"
            ).trim() ||
            "Unclassified",
          price,
          previousClose,
          change,
          changePercent,
          dayHigh: price,
          dayLow: price,
          volume: 0,
          targetPrice:
            valueFor(
              values,
              "targetprice"
            ).trim()
              ? numberOrZero(
                  valueFor(
                    values,
                    "targetprice"
                  )
                )
              : null,
          analystRating:
            valueFor(
              values,
              "analystrating"
            ).trim() ||
            "Not rated",
          fiftyTwoWeekHigh:
            numberOrZero(
              valueFor(
                values,
                "fiftytwoweekhigh"
              )
            ),
          fiftyTwoWeekLow:
            numberOrZero(
              valueFor(
                values,
                "fiftytwoweeklow"
              )
            ),
          alertCount: 0,
          note:
            valueFor(
              values,
              "notes"
            ).trim(),
          tags:
            valueFor(
              values,
              "tags"
            )
              .split("|")
              .map(
                (tag) =>
                  tag.trim()
              )
              .filter(Boolean),
          createdAt: now,
          updatedAt: now,
        });
      }
    );

  const duplicates =
    securities
      .map(
        (security) =>
          security.symbol
      )
      .filter(
        (
          symbol,
          index,
          all
        ) =>
          all.indexOf(
            symbol
          ) !== index
      );

  if (
    duplicates.length >
    0
  ) {
    warnings.push(
      `Duplicate symbols detected: ${Array.from(
        new Set(
          duplicates
        )
      ).join(", ")}.`
    );
  }

  return {
    securities,
    errors,
    warnings,
    totalRows:
      Math.max(
        0,
        lines.length - 1
      ),
    validRows:
      securities.length,
  };
}

export function mergeImportedWatchlistSecurities(
  state: WatchlistState,
  securities: WatchlistSecurity[],
  groupId: string
): WatchlistState {
  const existingByKey =
    new Map(
      state.securities.map(
        (security) => [
          `${security.symbol.toUpperCase()}::${security.exchange.toUpperCase()}`,
          security,
        ]
      )
    );

  const importedIds:
    string[] = [];

  const merged = [
    ...state.securities,
  ];

  securities.forEach(
    (security) => {
      const key =
        `${security.symbol.toUpperCase()}::${security.exchange.toUpperCase()}`;

      const existing =
        existingByKey.get(
          key
        );

      if (existing) {
        importedIds.push(
          existing.id
        );

        return;
      }

      merged.push(
        security
      );

      importedIds.push(
        security.id
      );
    }
  );

  return {
    ...state,
    securities:
      merged,
    groups:
      state.groups.map(
        (group) =>
          group.id ===
          groupId
            ? {
                ...group,
                securityIds:
                  Array.from(
                    new Set([
                      ...group.securityIds,
                      ...importedIds,
                    ])
                  ),
                updatedAt:
                  new Date().toISOString(),
              }
            : group
      ),
    updatedAt:
      new Date().toISOString(),
  };
}
