import type {
  MarketDataProviderId,
  MarketQuote,
  MarketQuoteBatch,
  QuoteRequestSecurity,
} from "./marketDataTypes";
import {
  configuredMarketDataProviders,
} from "./providers";
import {
  createUnavailableQuote,
} from "./providers/providerUtils";
import {
  cacheQuotes,
  getFallbackCachedQuote,
  getFreshCachedQuote,
} from "./quoteCache";
import {
  normaliseMarketSymbols,
} from "./symbolNormaliser";



type QuoteProviderCallable = (
  ...args: unknown[]
) => Promise<unknown>;

function quoteProviderCallable(
  value: unknown
): QuoteProviderCallable | null {
  return typeof value === "function"
    ? value as QuoteProviderCallable
    : null;
}

function quoteServiceProviderId(
  value: unknown
): MarketDataProviderId {
  return String(
    value ||
    "UNAVAILABLE"
  )
    .trim()
    .replace(
      /-/g,
      "_"
    )
    .toUpperCase() as
      MarketDataProviderId;
}

type GetQuotesOptions = {
  forceRefresh?: boolean;
};

export async function getMarketQuotes(
  securities:
    QuoteRequestSecurity[],
  options:
    GetQuotesOptions = {}
): Promise<MarketQuoteBatch> {
  const start =
    Date.now();

  const requestedAt =
    new Date().toISOString();

  const normalised =
    normaliseMarketSymbols(
      securities
    );

  const quoteMap =
    new Map<
      string,
      MarketQuote
    >();

  let cacheHits =
    0;

  if (
    !options.forceRefresh
  ) {
    for (
      const symbol of
      normalised
    ) {
      const cached =
        getFreshCachedQuote(
          symbol.canonicalSymbol
        );

      if (cached) {
        quoteMap.set(
          symbol.canonicalSymbol,
          cached
        );

        cacheHits +=
          1;
      }
    }
  }

  let unresolved =
    normalised.filter(
      (symbol) =>
        !quoteMap.has(
          symbol.canonicalSymbol
        )
    );

  const providers =
    configuredMarketDataProviders();

  const providersUsed =
    new Set<
      MarketDataProviderId
    >();

  let providerRequests =
    0;

  for (
    const provider of
    providers
  ) {
    if (
      unresolved.length ===
      0
    ) {
      break;
    }

    providerRequests +=
      1;

    const result =
      await (quoteProviderCallable(provider.getQuotes) ?? (async () => null))(
        unresolved
      );

    if (
      result.quotes.length >
      0
    ) {
      providersUsed.add(
        provider.id
      );
    }

    cacheQuotes(
      result.quotes
    );

    for (
      const quote of
      result.quotes
    ) {
      if (
        quote.isValid
      ) {
        quoteMap.set(
          quote.symbol,
          quote
        );
      }
    }

    unresolved =
      result.unresolvedSymbols.filter(
        (symbol) =>
          !quoteMap.has(
            symbol.canonicalSymbol
          )
      );
  }

  for (
    const symbol of
    unresolved
  ) {
    const fallback =
      getFallbackCachedQuote(
        symbol.canonicalSymbol
      );

    if (fallback) {
      quoteMap.set(
        symbol.canonicalSymbol,
        fallback
      );

      providersUsed.add(
        "CACHE"
      );

      continue;
    }

    quoteMap.set(
      symbol.canonicalSymbol,
      createUnavailableQuote(
        symbol,
        providers.length ===
          0
          ? "No market-data provider API key is configured."
          : "No configured provider returned a valid quote."
      )
    );
  }

  const quotes =
    normalised.map(
      (symbol) =>
        quoteMap.get(
          symbol.canonicalSymbol
        ) ??
        createUnavailableQuote(
          symbol,
          "Quote could not be resolved."
        )
    );

  const resolvedSymbols =
    quotes
      .filter(
        (quote) =>
          quote.isValid
      )
      .map(
        (quote) =>
          quote.symbol
      );

  const unresolvedSymbols =
    quotes
      .filter(
        (quote) =>
          !quote.isValid
      )
      .map(
        (quote) =>
          quote.symbol
      );

  const used =
    Array.from(
      providersUsed
    );

  const primaryProvider =
    used.find(
      (provider) =>
        provider !==
        "CACHE"
    ) ??
    used[0] ??
    "UNAVAILABLE";

  return {
    quotes,
    requestedSymbols:
      normalised.map(
        (symbol) =>
          symbol.canonicalSymbol
      ),
    resolvedSymbols,
    unresolvedSymbols,

    provider:
      quoteServiceProviderId(primaryProvider),
    providersUsed:
      used,

    requestedAt,
    completedAt:
      new Date().toISOString(),
    durationMs:
      Date.now() -
      start,

    cacheHits,
    providerRequests,
    successCount:
      resolvedSymbols.length,
    failureCount:
      unresolvedSymbols.length,
  };
}
