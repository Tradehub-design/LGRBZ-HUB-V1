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
  dividendStatusFromDates,
} from "../dividendUtils";

const PROVIDER_ID =
  "alpha-vantage" as const;

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
        "Alpha Vantage API key is not configured.",
    };
  }

  try {
    const query =
      new URLSearchParams({
        function:
          "DIVIDENDS",
        symbol:
          symbol.providerSymbol,
        apikey:
          apiKey(),
      });

    const response =
      await fetch(
        `https://www.alphavantage.co/query?${query.toString()}`,
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
        `Alpha Vantage returned HTTP ${response.status}.`
      );
    }

    const payload:
      unknown =
      await response.json();

    if (!isRecord(payload)) {
      throw new Error(
        "Alpha Vantage returned an invalid dividend response."
      );
    }

    const providerMessage =
      payload.Note ||
      payload.Information ||
      payload["Error Message"];

    if (providerMessage) {
      throw new Error(
        String(
          providerMessage
        )
      );
    }

    const rows =
      Array.isArray(
        payload.data
      )
        ? payload.data
        : [];

    const start =
      new Date(startDate);

    const end =
      new Date(endDate);

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

            const exDate =
              dividendDate(
                value.ex_dividend_date
              );

            const paymentDate =
              dividendDate(
                value.payment_date
              );

            const declarationDate =
              dividendDate(
                value.declaration_date
              );

            const recordDate =
              dividendDate(
                value.record_date
              );

            const effectiveDate =
              exDate ||
              paymentDate;

            if (effectiveDate) {
              const date =
                new Date(
                  effectiveDate
                );

              if (
                !Number.isNaN(
                  date.getTime()
                ) &&
                (
                  date < start ||
                  date > end
                )
              ) {
                return null;
              }
            }

            const amount =
              dividendNumber(
                value.amount
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
              declarationDate,
              recordDate,
              paymentDate,

              dividendPerShare:
                amount,
              adjustedDividendPerShare:
                amount,

              status:
                dividendStatusFromDates(
                  paymentDate,
                  declarationDate,
                  PROVIDER_ID
                ),
              confidence:
                declarationDate ||
                paymentDate
                  ? "CONFIRMED"
                  : "HIGH",
              provider:
                PROVIDER_ID,

              frequency:
                "UNKNOWN",
              isSpecial:
                false,

              frankingPercentage:
                null,
              taxRate:
                null,

              sourceUpdatedAt:
                null,
              receivedAt:
                new Date().toISOString(),

              note:
                null,
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

export const alphaVantageDividendProvider:
  DividendDataProvider = {
    id:
      PROVIDER_ID,
    name:
      "Alpha Vantage Dividends",
    isConfigured:
      configured,
    getDividends,
  };
