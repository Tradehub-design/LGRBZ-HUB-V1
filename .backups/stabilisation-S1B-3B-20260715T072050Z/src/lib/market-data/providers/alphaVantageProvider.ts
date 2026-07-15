import type {
  MarketDataProvider,
  MarketDataProviderResult,
  MarketQuote,
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
  safeNumber,
} from "./providerUtils";

const PROVIDER_ID =
  "ALPHA_VANTAGE" as const;

function apiKey() {
  return (
    process.env.ALPHA_VANTAGE_API_KEY ||
    process.env.ALPHAVANTAGE_API_KEY ||
    ""
  ).trim();
}

function configured() {
  return Boolean(
    apiKey()
  );
}

function alphaSymbol(
  symbol:
    NormalisedMarketSymbol
) {
  return symbol.providerSymbol;
}

async function fetchOne(
  symbol:
    NormalisedMarketSymbol
): Promise<MarketQuote | null> {
  const query =
    new URLSearchParams({
      function:
        "GLOBAL_QUOTE",
      symbol:
        alphaSymbol(
          symbol
        ),
      apikey:
        apiKey(),
    });

  const response =
    await fetch(
      `https://www.alphavantage.co/query?${query.toString()}`,
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
      `Alpha Vantage returned HTTP ${response.status}.`
    );
  }

  const payload =
    await response.json() as
      Record<
        string,
        unknown
      >;

  if (
    payload.Note ||
    payload.Information ||
    payload["Error Message"]
  ) {
    throw new Error(
      String(
        payload.Note ||
        payload.Information ||
        payload["Error Message"]
      )
    );
  }

  const raw =
    payload[
      "Global Quote"
    ];

  if (
    !raw ||
    typeof raw !==
      "object" ||
    Array.isArray(raw)
  ) {
    return null;
  }

  const quote =
    raw as Record<
      string,
      unknown
    >;

  const price =
    safeNumber(
      quote["05. price"]
    );

  if (
    price === null ||
    price <= 0
  ) {
    return null;
  }

  const latestDay =
    quote[
      "07. latest trading day"
    ];

  const quotedAt =
    latestDay
      ? new Date(
          `${String(
            latestDay
          )}T16:00:00Z`
        ).toISOString()
      : null;

  return createProviderQuote({
    symbol,
    provider:
      PROVIDER_ID,
    price,
    previousClose:
      safeNumber(
        quote[
          "08. previous close"
        ]
      ),
    open:
      safeNumber(
        quote["02. open"]
      ),
    dayHigh:
      safeNumber(
        quote["03. high"]
      ),
    dayLow:
      safeNumber(
        quote["04. low"]
      ),
    volume:
      safeNumber(
        quote["06. volume"]
      ),
    change:
      safeNumber(
        quote["09. change"]
      ),
    changePercent:
      safeNumber(
        String(
          quote[
            "10. change percent"
          ] ??
          ""
        ).replace(
          "%",
          ""
        )
      ),
    quotedAt,
  });
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
    return {
      provider:
        PROVIDER_ID,
      quotes: [],
      unresolvedSymbols:
        symbols,
      requestedAt,
      completedAt:
        new Date().toISOString(),
      durationMs:
        Date.now() -
        start,
    };
  }

  try {
    const quotes:
      MarketQuote[] = [];

    for (
      const symbol of
      symbols
    ) {
      try {
        const quote =
          await fetchOne(
            symbol
          );

        if (quote) {
          quotes.push(
            quote
          );
        }
      } catch {
        // Continue to the next symbol so a single provider error
        // does not discard previously resolved quotes.
      }
    }

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

    if (
      quotes.length >
      0
    ) {
      recordProviderSuccess(
        PROVIDER_ID,
        durationMs
      );
    } else {
      recordProviderFailure(
        PROVIDER_ID,
        durationMs,
        "Alpha Vantage returned no valid prices."
      );
    }

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

export const alphaVantageProvider:
  MarketDataProvider = {
    id:
      PROVIDER_ID,
    name:
      "Alpha Vantage",
    isConfigured:
      configured,
    getQuotes,
  };
