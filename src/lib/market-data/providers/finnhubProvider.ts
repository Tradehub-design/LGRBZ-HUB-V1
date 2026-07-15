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
  safeDate,
  safeNumber,
} from "./providerUtils";

const PROVIDER_ID =
  "FINNHUB" as const;

function apiKey() {
  return (
    process.env.FINNHUB_API_KEY ||
    ""
  ).trim();
}

function configured() {
  return Boolean(
    apiKey()
  );
}

function finnhubSymbol(
  symbol:
    NormalisedMarketSymbol
) {
  if (
    symbol.exchange ===
    "ASX"
  ) {
    return `AU:${symbol.displaySymbol}`;
  }

  return symbol.providerSymbol;
}

async function fetchOne(
  symbol:
    NormalisedMarketSymbol
): Promise<MarketQuote | null> {
  const query =
    new URLSearchParams({
      symbol:
        finnhubSymbol(
          symbol
        ),
      token:
        apiKey(),
    });

  const response =
    await fetch(
      `https://finnhub.io/api/v1/quote?${query.toString()}`,
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
            10_000
          ),
      }
    );

  if (!response.ok) {
    throw new Error(
      `Finnhub returned HTTP ${response.status}.`
    );
  }

  const raw =
    await response.json() as
      Record<
        string,
        unknown
      >;

  const price =
    safeNumber(
      raw.c
    );

  if (
    price === null ||
    price <= 0
  ) {
    return null;
  }

  return createProviderQuote({
    symbol,
    provider:
      PROVIDER_ID,
    price,
    previousClose:
      safeNumber(
        raw.pc
      ),
    open:
      safeNumber(
        raw.o
      ),
    dayHigh:
      safeNumber(
        raw.h
      ),
    dayLow:
      safeNumber(
        raw.l
      ),
    change:
      safeNumber(
        raw.d
      ),
    changePercent:
      safeNumber(
        raw.dp
      ),
    quotedAt:
      safeDate(
        raw.t
      ),
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
    ok: false,
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

    const chunkSize =
      4;

    for (
      let index = 0;
      index < symbols.length;
      index += chunkSize
    ) {
      const chunk =
        symbols.slice(
          index,
          index +
            chunkSize
        );

      const results =
        await Promise.allSettled(
          chunk.map(
            fetchOne
          )
        );

      for (
        const result of
        results
      ) {
        if (
          result.status ===
            "fulfilled" &&
          result.value
        ) {
          quotes.push(
            result.value
          );
        }
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
        "Finnhub returned no valid prices."
      );
    }

    return {
      provider:
        PROVIDER_ID,
    ok: true,
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
    ok: false,
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

export const finnhubProvider:
  MarketDataProvider = {
    id:
      PROVIDER_ID,
    name:
      "Finnhub",
    isConfigured:
      configured,
    getQuotes,
  };
