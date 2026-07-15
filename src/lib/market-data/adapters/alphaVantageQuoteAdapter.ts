import {
  providerById,
} from "../providerRegistry";
import {
  marketDataHttpJson,
  createAdapterError,
} from "../marketDataHttpClient";
import type {
  ProviderQuoteRequest,
} from "../marketDataAdapterTypes";
import type {
  MarketDataProviderDefinition,
  MarketDataSymbol,
  RawMarketQuote,
} from "../marketDataTypes";
import {
  BaseMarketDataQuoteAdapter,
} from "./baseQuoteAdapter";

type AlphaGlobalQuote = {
  "01. symbol"?: string;
  "02. open"?: string;
  "03. high"?: string;
  "04. low"?: string;
  "05. price"?: string;
  "06. volume"?: string;
  "07. latest trading day"?: string;
  "08. previous close"?: string;
  "09. change"?: string;
  "10. change percent"?: string;
};

type AlphaVantageResponse = {
  "Global Quote"?: AlphaGlobalQuote;
  "Error Message"?: string;
  Note?: string;
  Information?: string;
};

function numberValue(
  value:
    string |
    null |
    undefined
): number | null {
  if (
    !value
  ) {
    return null;
  }

  const cleaned =
    value.replace(
      "%",
      ""
    );

  const number =
    Number(
      cleaned
    );

  return Number.isFinite(
    number
  )
    ? number
    : null;
}

export class AlphaVantageQuoteAdapter
extends BaseMarketDataQuoteAdapter {
  readonly providerId =
    "ALPHA_VANTAGE" as const;

  getDefinition():
    MarketDataProviderDefinition {
    const provider =
      providerById(
        this.providerId
      );

    if (
      !provider
    ) {
      throw new Error(
        "Alpha Vantage provider definition is missing."
      );
    }

    return provider;
  }

  async fetchRawQuote(
    request:
      ProviderQuoteRequest,
    symbol:
      MarketDataSymbol
  ): Promise<{
    quote:
      RawMarketQuote;
    statusCode:
      number;
  }> {
    const provider =
      this.getDefinition();

    const environment =
      request.environment ||
      process.env;

    const apiKey =
      environment
        .ALPHA_VANTAGE_API_KEY;

    if (
      !apiKey
    ) {
      throw createAdapterError(
        this.providerId,
        "NOT_CONFIGURED",
        "ALPHA_VANTAGE_API_KEY is not configured.",
        {
          retryable:
            false,
        }
      );
    }

    const url =
      new URL(
        "https://www.alphavantage.co/query"
      );

    url.searchParams.set(
      "function",
      "GLOBAL_QUOTE"
    );

    url.searchParams.set(
      "symbol",
      symbol.providerSymbol
    );

    url.searchParams.set(
      "apikey",
      apiKey
    );

    const response =
      await marketDataHttpJson<AlphaVantageResponse>(
        url.toString(),
        {
          provider:
            this.providerId,

          timeoutMs:
            request.timeoutMs ||
            provider.defaultTimeoutMs,

          signal:
            request.signal,
        }
      );

    const providerMessage =
      response.data.Note ||
      response.data.Information ||
      response.data[
        "Error Message"
      ];

    if (
      providerMessage
    ) {
      const rateLimited =
        providerMessage
          .toLowerCase()
          .includes(
            "frequency"
          ) ||
        providerMessage
          .toLowerCase()
          .includes(
            "rate limit"
          );

      throw createAdapterError(
        this.providerId,
        rateLimited
          ? "RATE_LIMITED"
          : "INVALID_RESPONSE",
        providerMessage,
        {
          statusCode:
            response.status,

          rateLimited,
        }
      );
    }

    const quote =
      response.data[
        "Global Quote"
      ];

    const price =
      numberValue(
        quote?.[
          "05. price"
        ]
      );

    if (
      !quote ||
      price ===
        null ||
      price <=
        0
    ) {
      throw createAdapterError(
        this.providerId,
        "SYMBOL_NOT_FOUND",
        `Alpha Vantage did not return a usable quote for ${symbol.providerSymbol}.`,
        {
          statusCode:
            response.status,

          retryable:
            false,
        }
      );
    }

    return {
      statusCode:
        response.status,

      quote: {
        symbol:
          quote[
            "01. symbol"
          ] ||
          symbol.providerSymbol,

        price,

        previousClose:
          numberValue(
            quote[
              "08. previous close"
            ]
          ),

        open:
          numberValue(
            quote[
              "02. open"
            ]
          ),

        high:
          numberValue(
            quote[
              "03. high"
            ]
          ),

        low:
          numberValue(
            quote[
              "04. low"
            ]
          ),

        change:
          numberValue(
            quote[
              "09. change"
            ]
          ),

        changePercent:
          numberValue(
            quote[
              "10. change percent"
            ]
          ),

        volume:
          numberValue(
            quote[
              "06. volume"
            ]
          ),

        currency:
          symbol.currency,

        exchange:
          symbol.exchange,

        timestamp:
          quote[
            "07. latest trading day"
          ] ||
          null,

        receivedAt:
          new Date()
            .toISOString(),

        latencyClass:
          "DELAYED",

        tradingStatus:
          "UNKNOWN",

        provider:
          this.providerId,

        source:
          "Alpha Vantage",

        isDelayed:
          true,

        isIndicative:
          false,
      },
    };
  }
}
