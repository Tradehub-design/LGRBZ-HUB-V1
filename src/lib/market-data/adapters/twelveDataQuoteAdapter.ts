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

type TwelveDataQuoteResponse = {
  symbol?: string;
  name?: string;
  exchange?: string;
  mic_code?: string;
  currency?: string;

  datetime?: string;
  timestamp?: number;

  open?: string;
  high?: string;
  low?: string;
  close?: string;
  previous_close?: string;

  change?: string;
  percent_change?: string;

  volume?: string;

  status?: string;
  code?: number;
  message?: string;
};

function numberValue(
  value:
    string |
    number |
    null |
    undefined
): number | null {
  const number =
    Number(
      value
    );

  return Number.isFinite(
    number
  )
    ? number
    : null;
}

export class TwelveDataQuoteAdapter
extends BaseMarketDataQuoteAdapter {
  readonly providerId =
    "TWELVE_DATA" as const;

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
        "Twelve Data provider definition is missing."
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
        .TWELVE_DATA_API_KEY;

    if (
      !apiKey
    ) {
      throw createAdapterError(
        this.providerId,
        "NOT_CONFIGURED",
        "TWELVE_DATA_API_KEY is not configured.",
        {
          retryable:
            false,
        }
      );
    }

    const url =
      new URL(
        "https://api.twelvedata.com/quote"
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
      await marketDataHttpJson<TwelveDataQuoteResponse>(
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

    if (
      response.data.status ===
        "error"
    ) {
      const rateLimited =
        response.data.code ===
          429 ||
        String(
          response.data.message ||
          ""
        )
          .toLowerCase()
          .includes(
            "limit"
          );

      throw createAdapterError(
        this.providerId,
        rateLimited
          ? "RATE_LIMITED"
          : "INVALID_RESPONSE",
        response.data.message ||
          `Twelve Data failed for ${symbol.providerSymbol}.`,
        {
          statusCode:
            response.data.code ||
            response.status,

          rateLimited,
        }
      );
    }

    const close =
      numberValue(
        response.data.close
      );

    if (
      close ===
        null ||
      close <=
        0
    ) {
      throw createAdapterError(
        this.providerId,
        "SYMBOL_NOT_FOUND",
        `Twelve Data did not return a usable quote for ${symbol.providerSymbol}.`,
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
          response.data.symbol ||
          symbol.providerSymbol,

        price:
          close,

        previousClose:
          numberValue(
            response.data
              .previous_close
          ),

        open:
          numberValue(
            response.data.open
          ),

        high:
          numberValue(
            response.data.high
          ),

        low:
          numberValue(
            response.data.low
          ),

        change:
          numberValue(
            response.data.change
          ),

        changePercent:
          numberValue(
            response.data
              .percent_change
          ),

        volume:
          numberValue(
            response.data.volume
          ),

        currency:
          response.data.currency ||
          symbol.currency,

        exchange:
          response.data.exchange ||
          response.data.mic_code ||
          symbol.exchange,

        timestamp:
          response.data.timestamp ||
          response.data.datetime ||
          null,

        receivedAt:
          new Date()
            .toISOString(),

        latencyClass:
          "REAL_TIME",

        tradingStatus:
          "UNKNOWN",

        provider:
          this.providerId,

        source:
          "Twelve Data",

        isDelayed:
          false,

        isIndicative:
          false,
      },
    };
  }
}
