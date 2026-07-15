import type {
  DividendDataProvider,
  DividendEvent,
  DividendProviderResult,
} from "../dividendTypes";
import {
  createDividendId,
  dividendCurrency,
  dividendDate,
  dividendNumber,
} from "../dividendUtils";

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

function isRecord(
  value: unknown
): value is Record<
  string,
  unknown
> {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

async function getDividends(
  symbol: Parameters<
    DividendDataProvider["getDividends"]
  >[0],
  startDate: string,
  endDate: string
): Promise<DividendProviderResult> {
  const requestedAt =
    new Date().toISOString();

  const started =
    Date.now();

  if (!configured()) {
    return {
      provider:
        PROVIDER_ID,
      symbol,
      events: [],
      requestedAt,
      completedAt:
        new Date().toISOString(),
      durationMs:
        Date.now() - started,
      error:
        "Twelve Data API key is not configured.",
    };
  }

  try {
    const query =
      new URLSearchParams({
        symbol:
          symbol.providerSymbol,
        start_date:
          startDate.slice(
            0,
            10
          ),
        end_date:
          endDate.slice(
            0,
            10
          ),
        apikey:
          apiKey(),
      });

    const response =
      await fetch(
        `https://api.twelvedata.com/dividends?${query.toString()}`,
        {
          method:
            "GET",
          cache:
            "no-store",
          headers: {
            Accept:
              "application/json",
          },
          signal:
            AbortSignal.timeout(
              15_000
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

    if (!isRecord(payload)) {
      throw new Error(
        "Twelve Data returned an invalid dividend response."
      );
    }

    if (
      payload.status ===
        "error"
    ) {
      throw new Error(
        String(
          payload.message ||
          "Twelve Data dividend request failed."
        )
      );
    }

    const rows =
      Array.isArray(
        payload.dividends
      )
        ? payload.dividends
        : Array.isArray(
              payload.data
            )
          ? payload.data
          : [];

    const events =
      rows
        .map(
          (
            value,
            index
          ): DividendEvent | null => {
            if (!isRecord(value)) {
              return null;
            }

            // Twelve Data documents this field as the ex-dividend date.
            const exDate =
              dividendDate(
                value.ex_date ||
                value.ex_dividend_date ||
                value.date
              );

            const amount =
              dividendNumber(
                value.amount ||
                value.dividend
              );

            return {
              id:
                createDividendId(
                  PROVIDER_ID,
                  symbol.canonicalSymbol,
                  exDate,
                  amount,
                  index
                ),

              symbol:
                symbol.canonicalSymbol,
              providerSymbol:
                symbol.providerSymbol,
              displaySymbol:
                symbol.displaySymbol,
              exchange:
                symbol.exchange,
              currency:
                dividendCurrency(
                  value.currency,
                  symbol.currency
                ),

              exDate,
              declarationDate:
                dividendDate(
                  value.declaration_date
                ),
              recordDate:
                dividendDate(
                  value.record_date
                ),
              paymentDate:
                dividendDate(
                  value.payment_date
                ),

              dividendPerShare:
                amount,
              adjustedDividendPerShare:
                amount,

              status:
                value.payment_date ||
                value.declaration_date
                  ? "ANNOUNCED"
                  : "UNKNOWN",
              confidence:
                "HIGH",
              provider:
                PROVIDER_ID,

              frequency:
                "UNKNOWN",
              isSpecial:
                Boolean(
                  value.is_special
                ),

              frankingPercentage:
                dividendNumber(
                  value.franking_percentage
                ),
              taxRate:
                null,

              sourceUpdatedAt:
                null,
              receivedAt:
                new Date().toISOString(),

              note:
                "Twelve Data date interpreted as ex-dividend date.",
            };
          }
        )
        .filter(
          (
            event
          ): event is DividendEvent =>
            Boolean(event)
        );

    return {
      provider:
        PROVIDER_ID,
      symbol,
      events,
      requestedAt,
      completedAt:
        new Date().toISOString(),
      durationMs:
        Date.now() - started,
      error:
        null,
    };
  } catch (error) {
    return {
      provider:
        PROVIDER_ID,
      symbol,
      events: [],
      requestedAt,
      completedAt:
        new Date().toISOString(),
      durationMs:
        Date.now() - started,
      error:
        error instanceof Error
          ? error.message
          : String(error),
    };
  }
}

export const twelveDataDividendProvider:
  DividendDataProvider = {
    id:
      PROVIDER_ID,
    name:
      "Twelve Data Dividends",
    isConfigured:
      configured,
    getDividends,
  };
