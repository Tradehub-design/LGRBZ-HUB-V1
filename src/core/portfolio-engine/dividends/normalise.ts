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

import {
  quantityOwnedBeforeExDate,
} from "./eligibility";

import {
  calculateDividendTax,
} from "./tax";

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

function canonicalSymbol(
  value: string,
): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/\.AX$/, "");
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
  const canonical =
    canonicalSymbol(
      event.symbol,
    );

  const eventDate =
    Date.parse(
      event.exDate ||
      event.paymentDate ||
      "",
    );

  const candidates =
    eligibility.filter(
      (candidate) =>
        canonicalSymbol(
          candidate.symbol,
        ) === canonical,
    );

  return (
    candidates.find(
      (candidate) => {
        const candidateDate =
          Date.parse(
            candidate.exDate ||
            candidate.paymentDate ||
            "",
          );

        return (
          Number.isFinite(
            eventDate,
          ) &&
          Number.isFinite(
            candidateDate,
          ) &&
          Math.abs(
            eventDate -
            candidateDate,
          ) <=
            2 *
            86_400_000
        );
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
    return roundMoney(amount);
  }

  const fxRate =
    holding?.valuation
      .fxRateToAud;

  if (
    !fxRate ||
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

function eventTimestamp(
  event:
    DividendEvent,
): number {
  const timestamp =
    Date.parse(
      event.paymentDate ||
      event.exDate ||
      event.recordDate ||
      event.declarationDate ||
      "",
    );

  return Number.isFinite(timestamp)
    ? timestamp
    : Number.MAX_SAFE_INTEGER;
}

function providerEligibleQuantity(input: {
  event:
    DividendEvent;

  eligibility:
    readonly DividendEligibility[];
}): number | null {
  const match =
    matchingEligibility(
      input.event,
      input.eligibility,
    );

  if (
    !match ||
    !Number.isFinite(
      match.eligibleQuantity,
    ) ||
    match.eligibleQuantity < 0
  ) {
    return null;
  }

  return match.eligibleQuantity;
}

function ownershipEligibleQuantity(input: {
  portfolio:
    PortfolioSnapshot;

  holding:
    PortfolioHolding | null;

  event:
    DividendEvent;
}): number | null {
  if (
    !input.holding ||
    !input.event.exDate ||
    !validDate(
      input.event.exDate,
    )
  ) {
    return null;
  }

  return quantityOwnedBeforeExDate({
    portfolio:
      input.portfolio,

    securityId:
      input.holding.security
        .securityId,

    symbol:
      input.event.symbol,

    exDate:
      input.event.exDate,
  }).eligibleQuantity;
}

function resolveEligibleQuantity(input: {
  portfolio:
    PortfolioSnapshot;

  holding:
    PortfolioHolding | null;

  event:
    DividendEvent;

  eligibility:
    readonly DividendEligibility[];
}): number {
  const transactionOwned =
    ownershipEligibleQuantity(
      input,
    );

  if (
    transactionOwned !== null
  ) {
    return Math.max(
      0,
      transactionOwned,
    );
  }

  const providerOwned =
    providerEligibleQuantity({
      event:
        input.event,

      eligibility:
        input.eligibility,
    });

  if (
    providerOwned !== null
  ) {
    return Math.max(
      0,
      providerOwned,
    );
  }

  return Math.max(
    0,
    input.holding?.quantity ??
    0,
  );
}

function resolveWithholdingRate(
  event:
    DividendEvent,
  holding:
    PortfolioHolding | null,
): number {
  if (
    event.taxRate !== null &&
    Number.isFinite(
      event.taxRate,
    )
  ) {
    return Math.max(
      0,
      event.taxRate,
    );
  }

  if (
    holding?.security.market ===
    "US"
  ) {
    return 15;
  }

  return 0;
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

  const eligibleQuantity =
    resolveEligibleQuantity({
      portfolio:
        input.portfolio,

      holding,

      event:
        input.event,

      eligibility:
        input.eligibility,
    });

  const dividendPerShare =
    input.event
      .adjustedDividendPerShare ??
    input.event
      .dividendPerShare;

  const expectedCashLocal =
    dividendPerShare !== null &&
    Number.isFinite(
      dividendPerShare,
    )
      ? roundMoney(
          dividendPerShare *
          eligibleQuantity,
        )
      : matchingEligibility(
          input.event,
          input.eligibility,
        )?.expectedCash ??
        null;

  const expectedCashAud =
    localToAud(
      expectedCashLocal,
      holding,
      input.event.currency,
    );

  const nowTimestamp =
    Date.parse(input.now);

  const datedEventTimestamp =
    eventTimestamp(
      input.event,
    );

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
    Number.isFinite(
      datedEventTimestamp,
    ) &&
    Number.isFinite(
      nowTimestamp,
    ) &&
    datedEventTimestamp >=
      nowTimestamp;

  const frankingPercentage =
    Math.min(
      100,
      Math.max(
        0,
        input.event
          .frankingPercentage ??
        0,
      ),
    );

  const tax =
    calculateDividendTax({
      cashDividendAud:
        expectedCashAud ??
        0,

      frankingPercentage,

      companyTaxRate:
        30,

      withholdingRate:
        resolveWithholdingRate(
          input.event,
          holding,
        ),

      /**
       * Personal tax estimates remain zero until the user supplies their tax
       * rate through settings or Tax Centre.
       */
      personalMarginalTaxRate:
        0,
    });

  return {
    id:
      input.event.id,

    securityId:
      holding?.security
        .securityId ??
      null,

    holdingId:
      holding?.holdingId ??
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
        input.event
          .declarationDate,
      )
        ? input.event
            .declarationDate
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

    dividendPerShare,

    eligibleQuantity,

    expectedCashLocal,

    expectedCashAud,

    frankingPercentage,

    frankingCreditAud:
      tax.frankingCreditAud,

    grossedUpIncomeAud:
      tax.grossedUpIncomeAud,

    withholdingTaxAud:
      tax.withholdingTaxAud,

    estimatedTaxAud:
      tax.estimatedNetTaxPayableAud,

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

    estimatedTaxAud:
      0,

    eventCount:
      month.eventCount,
  };
}
