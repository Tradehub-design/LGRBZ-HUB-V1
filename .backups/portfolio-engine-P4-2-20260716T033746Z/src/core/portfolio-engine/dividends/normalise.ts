import type {
  DividendEligibility,
  DividendEvent,
  DividendHoldingSummary,
  MonthlyDividendForecast,
} from "@/lib/dividend-data";

import type {
  PortfolioHolding,
  PortfolioSnapshot,
} from "../contracts";

import type {
  PortfolioDividendEvent,
  PortfolioDividendHoldingSummary,
  PortfolioDividendMonth,
} from "./contracts";

import {
  percentage,
  roundMoney,
} from "../money";

function validDate(
  value: string | null,
): boolean {
  if (!value) {
    return false;
  }

  return Number.isFinite(
    Date.parse(value),
  );
}

function eventDate(
  event: DividendEvent,
): string | null {
  return (
    event.paymentDate ||
    event.exDate ||
    event.recordDate ||
    event.declarationDate
  );
}

function canonicalSymbol(
  value: string,
): string {
  return value
    .trim()
    .toUpperCase()
    .replace(
      /\.AX$/,
      "",
    );
}

function matchingHolding(
  portfolio:
    PortfolioSnapshot,
  symbol:
    string,
): PortfolioHolding | null {
  const canonical =
    canonicalSymbol(symbol);

  return (
    portfolio.holdings.find(
      (holding) =>
        canonicalSymbol(
          holding.security.ticker,
        ) === canonical ||
        canonicalSymbol(
          holding.security.quoteTicker,
        ) === canonical,
    ) ??
    null
  );
}

function matchingEligibility(
  event:
    DividendEvent,
  eligibility:
    readonly DividendEligibility[],
): DividendEligibility | null {
  const symbol =
    canonicalSymbol(
      event.symbol,
    );

  const eventExDate =
    event.exDate
      ? Date.parse(event.exDate)
      : Number.NaN;

  const eventPaymentDate =
    event.paymentDate
      ? Date.parse(
          event.paymentDate,
        )
      : Number.NaN;

  const candidates =
    eligibility.filter(
      (candidate) =>
        canonicalSymbol(
          candidate.symbol,
        ) === symbol,
    );

  if (candidates.length === 0) {
    return null;
  }

  return (
    candidates.find(
      (candidate) => {
        const candidateExDate =
          candidate.exDate
            ? Date.parse(
                candidate.exDate,
              )
            : Number.NaN;

        if (
          Number.isFinite(
            eventExDate,
          ) &&
          Number.isFinite(
            candidateExDate,
          )
        ) {
          return (
            Math.abs(
              eventExDate -
              candidateExDate,
            ) <
            2 *
            86_400_000
          );
        }

        const candidatePaymentDate =
          candidate.paymentDate
            ? Date.parse(
                candidate.paymentDate,
              )
            : Number.NaN;

        if (
          Number.isFinite(
            eventPaymentDate,
          ) &&
          Number.isFinite(
            candidatePaymentDate,
          )
        ) {
          return (
            Math.abs(
              eventPaymentDate -
              candidatePaymentDate,
            ) <
            2 *
            86_400_000
          );
        }

        return false;
      },
    ) ??
    candidates[0] ??
    null
  );
}

function localToAud(
  amount:
    number | null,
  holding:
    PortfolioHolding | null,
  eventCurrency:
    string,
): number | null {
  if (
    amount === null ||
    !Number.isFinite(amount)
  ) {
    return null;
  }

  if (
    eventCurrency
      .trim()
      .toUpperCase() ===
    "AUD"
  ) {
    return roundMoney(
      amount,
    );
  }

  const fxRate =
    holding?.valuation
      .fxRateToAud;

  if (
    typeof fxRate !==
      "number" ||
    !Number.isFinite(fxRate) ||
    fxRate <= 0
  ) {
    return null;
  }

  return roundMoney(
    amount *
    fxRate,
  );
}

export function normalisePortfolioDividendEvent(input: {
  portfolio:
    PortfolioSnapshot;

  event:
    DividendEvent;

  eligibility:
    readonly DividendEligibility[];

  now:
    string;
}): PortfolioDividendEvent {
  const holding =
    matchingHolding(
      input.portfolio,
      input.event.symbol,
    );

  const eligible =
    matchingEligibility(
      input.event,
      input.eligibility,
    );

  const eligibleQuantity =
    Math.max(
      0,
      eligible?.eligibleQuantity ??
      holding?.quantity ??
      0,
    );

  const expectedCashLocal =
    eligible?.expectedCash ??
    (
      input.event
        .dividendPerShare !==
        null
        ? roundMoney(
            input.event
              .dividendPerShare *
            eligibleQuantity,
          )
        : null
    );

  const expectedCashAud =
    localToAud(
      expectedCashLocal,
      holding,
      input.event.currency,
    );

  const eventTimestamp =
    eventDate(
      input.event,
    );

  const nowTimestamp =
    Date.parse(input.now);

  const datedEventTimestamp =
    eventTimestamp
      ? Date.parse(
          eventTimestamp,
        )
      : Number.NaN;

  const isReceived =
    input.event.status ===
    "RECEIVED";

  const isForecast =
    input.event.status ===
    "FORECAST";

  const isAnnounced =
    input.event.status ===
    "ANNOUNCED";

  const isHistorical =
    isReceived ||
    (
      Number.isFinite(
        datedEventTimestamp,
      ) &&
      Number.isFinite(
        nowTimestamp,
      ) &&
      datedEventTimestamp <
      nowTimestamp
    );

  const isUpcoming =
    !isReceived &&
    (
      Number.isFinite(
        datedEventTimestamp,
      ) &&
      Number.isFinite(
        nowTimestamp,
      ) &&
      datedEventTimestamp >=
      nowTimestamp
    );

  const frankingCreditAud =
    roundMoney(
      eligible?.frankingCredit ??
      0,
    );

  const grossedUpIncomeAud =
    roundMoney(
      eligible?.grossedUpIncome ??
      (
        expectedCashAud ??
        0
      ) +
      frankingCreditAud,
    );

  const taxRate =
    input.event.taxRate;

  const withholdingTaxAud =
    taxRate !== null &&
    expectedCashAud !== null
      ? roundMoney(
          expectedCashAud *
          (
            Math.max(
              0,
              taxRate,
            ) /
            100
          ),
        )
      : 0;

  const estimatedTaxAud =
    roundMoney(
      Math.max(
        0,
        withholdingTaxAud -
        frankingCreditAud,
      ),
    );

  return {
    id:
      input.event.id,

    securityId:
      holding?.security
        .securityId ??
      null,

    holdingId:
      holding?.holdingId ??
      eligible?.holdingId ??
      null,

    symbol:
      input.event.symbol,

    displaySymbol:
      input.event.displaySymbol,

    providerSymbol:
      input.event.providerSymbol,

    market:
      input.event.exchange,

    currency:
      input.event.currency,

    exDate:
      validDate(
        input.event.exDate,
      )
        ? input.event.exDate
        : null,

    declarationDate:
      validDate(
        input.event.declarationDate,
      )
        ? input.event.declarationDate
        : null,

    recordDate:
      validDate(
        input.event.recordDate,
      )
        ? input.event.recordDate
        : null,

    paymentDate:
      validDate(
        input.event.paymentDate,
      )
        ? input.event.paymentDate
        : null,

    dividendPerShare:
      input.event
        .adjustedDividendPerShare ??
      input.event
        .dividendPerShare,

    eligibleQuantity,

    expectedCashLocal,

    expectedCashAud,

    frankingPercentage:
      input.event
        .frankingPercentage,

    frankingCreditAud,

    grossedUpIncomeAud,

    withholdingTaxAud,

    estimatedTaxAud,

    status:
      input.event.status,

    confidence:
      input.event.confidence,

    frequency:
      input.event.frequency,

    provider:
      input.event.provider,

    isHistorical,
    isUpcoming,
    isForecast,
    isAnnounced,
    isReceived,

    isSpecial:
      input.event.isSpecial,

    sourceUpdatedAt:
      input.event.sourceUpdatedAt,

    receivedAt:
      input.event.receivedAt,

    note:
      input.event.note,
  };
}

export function normaliseDividendHoldingSummary(input: {
  portfolio:
    PortfolioSnapshot;

  summary:
    DividendHoldingSummary;
}): PortfolioDividendHoldingSummary | null {
  const holding =
    matchingHolding(
      input.portfolio,
      input.summary.symbol,
    );

  if (!holding) {
    return null;
  }

  const marketValueAud =
    holding.valuation
      .marketValueAud;

  const costBaseAud =
    holding.costBaseAud;

  return {
    holdingId:
      holding.holdingId,

    securityId:
      holding.security
        .securityId,

    symbol:
      holding.security.ticker,

    displaySymbol:
      input.summary.displaySymbol,

    quantity:
      holding.quantity,

    marketValueAud,

    costBaseAud,

    trailingTwelveMonthIncomeAud:
      roundMoney(
        input.summary
          .trailingTwelveMonthIncome,
      ),

    forwardTwelveMonthIncomeAud:
      roundMoney(
        input.summary
          .forwardTwelveMonthIncome,
      ),

    announcedIncomeAud:
      roundMoney(
        input.summary
          .announcedIncome,
      ),

    forecastIncomeAud:
      roundMoney(
        input.summary
          .forecastIncome,
      ),

    receivedIncomeAud:
      roundMoney(
        input.summary
          .receivedIncome,
      ),

    annualisedDividendPerShare:
      roundMoney(
        input.summary
          .annualisedDividendPerShare,
      ),

    dividendYieldPercent:
      marketValueAud > 0
        ? percentage(
            input.summary
              .forwardTwelveMonthIncome,
            marketValueAud,
            0,
          )
        : null,

    yieldOnCostPercent:
      costBaseAud > 0
        ? percentage(
            input.summary
              .forwardTwelveMonthIncome,
            costBaseAud,
            0,
          )
        : null,

    nextExDate:
      input.summary.nextExDate,

    nextPaymentDate:
      input.summary
        .nextPaymentDate,

    projectedFrankingCreditsAud:
      roundMoney(
        input.summary
          .frankingCredits,
      ),

    estimatedWithholdingTaxAud:
      0,

    eventCount:
      input.summary.eventCount,

    quoteSource:
      holding.valuation
        .quoteSource,
  };
}

export function normaliseDividendMonth(
  month:
    MonthlyDividendForecast,
): PortfolioDividendMonth {
  return {
    month:
      month.month,

    label:
      month.label,

    announcedIncomeAud:
      roundMoney(
        month.announcedIncome,
      ),

    forecastIncomeAud:
      roundMoney(
        month.forecastIncome,
      ),

    receivedIncomeAud:
      roundMoney(
        month.receivedIncome,
      ),

    totalIncomeAud:
      roundMoney(
        month.totalIncome,
      ),

    frankingCreditsAud:
      roundMoney(
        month.frankingCredits,
      ),

    estimatedTaxAud: 0,

    eventCount:
      month.eventCount,
  };
}
