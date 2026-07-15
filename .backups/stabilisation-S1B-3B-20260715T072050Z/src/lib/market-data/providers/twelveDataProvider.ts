import type {
  MarketDataProvider,
  MarketDataProviderResult,
  NormalisedMarketSymbol,
} from "../marketDataTypes";
import {
  recordProviderAttempt,
  recordProviderFailure,
  recordProviderSuccess,
  registerProviderConfiguration,
} from "../providerHealth";
import {
  createProviderQuote,
  safeDate,
  safeNumber,
} from "./providerUtils";

const PROVIDER_ID =
  "TWELVE_DATA" as const;

function apiKey() {
  return (
    process.env.TWELVE_DATA_API_KEY ||
    process.env.TWELVEDATA_API_KEY ||
    ""
  ).trim();
}

function configured() {
  return Boolean(
    apiKey()
  );
}

type TwelveDataQuote =
  Record<
    string,
    unknown
  >;

function isRecord(
  value: unknown
): value is TwelveDataQuote {
  return (
    Boolean(value) &&
    typeof value ===
      "object" &&
    !Array.isArray(value)
  );
}

function resolveResponseQuote(
  payload: unknown,
  symbol:
    NormalisedMarketSymbol
) {
  if (!isRecord(payload)) {
    return null;
  }

  const direct =
    payload[
      symbol.providerSymbol
    ];

  if (isRecord(direct)) {
    return direct;
  }

  const canonical =
    payload[
      symbol.canonicalSymbol
    ];

  if (
    isRecord(canonical)
  ) {
    return canonical;
  }

  if (
    "symbol" in payload &&
    (
      "close" in payload ||
      "price" in payload
    )
  ) {
    return payload;
  }

  return null;
}

async function getQuotes(
  symbols:
    NormalisedMarketSymbol[]
): Promise<MarketDataProviderResult> {
  const requestedAt =
    new Date().toISOString();

  const start =
    Date.now();

  recordProviderAttempt(
    PROVIDER_ID
  );

  if (!configured()) {
    const completedAt =
      new Date().toISOString();

    return {
      provider:
        PROVIDER_ID,
      quotes: [],
      unresolvedSymbols:
        symbols,
      requestedAt,
      completedAt,
      durationMs:
        Date.now() -
        start,
    };
  }

  try {
    const query =
      new URLSearchParams({
        symbol:
          symbols
            .map(
              (symbol) =>
                symbol.providerSymbol
            )
            .join(","),
        apikey:
          apiKey(),
      });

    const response =
      await fetch(
        `https://api.twelvedata.com/quote?${query.toString()}`,
        {
          method:
            "GET",
          headers: {
            Accept:
              "application/json",
          },
          cache:
            "no-store",
          signal:
            AbortSignal.timeout(
              12_000
            ),
        }
      );

    if (!response.ok) {
      throw new Error(
        `Twelve Data returned HTTP ${response.status}.`
      );
    }

    const payload:
      unknown =
      await response.json();

    if (
      isRecord(payload) &&
      (
        payload.status ===
          "error" ||
        payload.code
      ) &&
      payload.message
    ) {
      throw new Error(
        String(
          payload.message
        )
      );
    }

    const quotes =
      symbols
        .map(
          (symbol) => {
            const raw =
              resolveResponseQuote(
                payload,
                symbol
              );

            if (!raw) {
              return null;
            }

            const price =
              safeNumber(
                raw.close ??
                raw.price
              );

            const previousClose =
              safeNumber(
                raw.previous_close ??
                raw.previousClose
              );

            return createProviderQuote({
              symbol,
              provider:
                PROVIDER_ID,
              price,
              previousClose,
              open:
                safeNumber(
                  raw.open
                ),
              dayHigh:
                safeNumber(
                  raw.high
                ),
              dayLow:
                safeNumber(
                  raw.low
                ),
              volume:
                safeNumber(
                  raw.volume
                ),
              change:
                safeNumber(
                  raw.change
                ),
              changePercent:
                safeNumber(
                  raw.percent_change ??
                  raw.change_percent
                ),
              quotedAt:
                safeDate(
                  raw.timestamp ??
                  raw.datetime
                ),
              currency:
                typeof raw.currency ===
                "string"
                  ? raw.currency
                  : symbol.currency,
            });
          }
        )
        .filter(
          (
            quote
          ): quote is NonNullable<
            typeof quote
          > =>
            Boolean(
              quote?.isValid
            )
        );

    const resolved =
      new Set(
        quotes.map(
          (quote) =>
            quote.symbol
        )
      );

    const unresolvedSymbols =
      symbols.filter(
        (symbol) =>
          !resolved.has(
            symbol.canonicalSymbol
          )
      );

    const durationMs =
      Date.now() -
      start;

    recordProviderSuccess(
      PROVIDER_ID,
      durationMs
    );

    return {
      provider:
        PROVIDER_ID,
      quotes,
      unresolvedSymbols,
      requestedAt,
      completedAt:
        new Date().toISOString(),
      durationMs,
    };
  } catch (error) {
    const durationMs =
      Date.now() -
      start;

    recordProviderFailure(
      PROVIDER_ID,
      durationMs,
      error
    );

    return {
      provider:
        PROVIDER_ID,
      quotes: [],
      unresolvedSymbols:
        symbols,
      requestedAt,
      completedAt:
        new Date().toISOString(),
      durationMs,
    };
  }
}

registerProviderConfiguration(
  PROVIDER_ID,
  configured()
);

export const twelveDataProvider:
  MarketDataProvider = {
    id:
      PROVIDER_ID,
    name:
      "Twelve Data",
    isConfigured:
      configured,
    getQuotes,
  };
