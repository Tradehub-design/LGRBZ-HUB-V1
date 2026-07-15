import {
  getSharedMarketDataRefreshCoordinator,
  recommendMarketDataRefreshInterval,
} from "@/lib/market-data/marketDataRefreshCoordinator";
import type {
  MarketDataRefreshPriority,
  MarketDataRefreshProfile,
} from "@/lib/market-data/marketDataRefreshTypes";
import {
  marketDataApiError,
  marketDataApiSuccess,
  parseExchange,
  parseProviderList,
  parseSymbols,
  safeJsonBody,
} from "@/lib/market-data/marketDataApiUtils";

export const dynamic =
  "force-dynamic";

export const revalidate =
  0;

function profile(
  value:
    unknown
): MarketDataRefreshProfile {
  const normalised =
    String(
      value ||
      "MANUAL"
    )
      .trim()
      .toUpperCase();

  const allowed:
    MarketDataRefreshProfile[] = [
    "HOLDINGS",
    "WATCHLIST",
    "DASHBOARD",
    "DIVIDENDS",
    "ALLOCATION",
    "ANALYTICS",
    "MANUAL",
  ];

  return allowed.includes(
    normalised as
      MarketDataRefreshProfile
  )
    ? normalised as
        MarketDataRefreshProfile
    : "MANUAL";
}

function priority(
  value:
    unknown
): MarketDataRefreshPriority {
  const normalised =
    String(
      value ||
      "NORMAL"
    )
      .trim()
      .toUpperCase();

  const allowed:
    MarketDataRefreshPriority[] = [
    "CRITICAL",
    "HIGH",
    "NORMAL",
    "LOW",
    "BACKGROUND",
  ];

  return allowed.includes(
    normalised as
      MarketDataRefreshPriority
  )
    ? normalised as
        MarketDataRefreshPriority
    : "NORMAL";
}

export async function GET() {
  const coordinator =
    getSharedMarketDataRefreshCoordinator();

  return marketDataApiSuccess(
    coordinator.snapshot()
  );
}

export async function POST(
  request:
    Request
) {
  const body =
    await safeJsonBody(
      request
    );

  const symbols =
    parseSymbols(
      body.symbols as
        string[] |
        string |
        undefined
    );

  if (
    symbols.length ===
    0
  ) {
    return marketDataApiError(
      "SYMBOLS_REQUIRED",
      "At least one symbol is required.",
      400
    );
  }

  if (
    symbols.length >
    250
  ) {
    return marketDataApiError(
      "TOO_MANY_SYMBOLS",
      "A maximum of 250 symbols is supported per refresh job.",
      400
    );
  }

  const exchange =
    parseExchange(
      String(
        body.exchange ||
        "UNKNOWN"
      )
    );

  const refreshProfile =
    profile(
      body.profile
    );

  const recommendation =
    recommendMarketDataRefreshInterval({
      exchange,
      profile:
        refreshProfile,
    });

  const coordinator =
    getSharedMarketDataRefreshCoordinator();

  const job =
    coordinator.enqueue({
      symbols,
      exchange,

      currency:
        typeof body.currency ===
        "string"
          ? body.currency
          : null,

      profile:
        refreshProfile,

      priority:
        priority(
          body.priority
        ),

      forceRefresh:
        Boolean(
          body.forceRefresh
        ),

      compareProviders:
        Boolean(
          body.compareProviders
        ),

      maximumProviderAttempts:
        Number(
          body.maximumProviderAttempts ||
          3
        ),

      minimumQualityScore:
        Number(
          body.minimumQualityScore ||
          45
        ),

      providerPreference:
        parseProviderList(
          body.providerPreference as
            string[] |
            string |
            undefined
        ),

      excludedProviders:
        parseProviderList(
          body.excludedProviders as
            string[] |
            string |
            undefined
        ),

      maximumAttempts:
        Number(
          body.maximumAttempts ||
          4
        ),

      timeoutMs:
        Number(
          body.timeoutMs ||
          8_000
        ),

      concurrency:
        Number(
          body.concurrency ||
          6
        ),
    });

  const runImmediately =
    body.runImmediately ===
    undefined
      ? true
      : Boolean(
          body.runImmediately
        );

  if (
    !runImmediately
  ) {
    return marketDataApiSuccess(
      {
        job,
        recommendation,
      },
      {
        status:
          202,
      }
    );
  }

  const result =
    await coordinator.runNext();

  return marketDataApiSuccess({
    job,
    result,
    recommendation,
    coordinator:
      coordinator.snapshot(),
  });
}
