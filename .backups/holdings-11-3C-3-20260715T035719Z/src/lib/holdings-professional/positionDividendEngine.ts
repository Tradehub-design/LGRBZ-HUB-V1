import type {
  HoldingsVisualPosition,
  HoldingsVisualSnapshot,
} from "./holdingsVisualModels";
import type {
  PositionDividendEvent,
  PositionDividendMonth,
  PositionDividendSnapshot,
  PositionDividendStatus,
  PositionDividendYear,
} from "./positionDividendModels";

type UnknownRecord =
  Record<string, unknown>;

function record(
  value: unknown
): UnknownRecord {
  return (
    value &&
    typeof value === "object"
      ? value
      : {}
  ) as UnknownRecord;
}

function text(
  source: UnknownRecord,
  keys: string[]
): string {
  for (const key of keys) {
    const value =
      source[key];

    if (
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  return "";
}

function numeric(
  source: UnknownRecord,
  keys: string[]
): number | null {
  for (const key of keys) {
    const raw =
      source[key];

    if (
      raw === undefined ||
      raw === null ||
      raw === ""
    ) {
      continue;
    }

    const parsed =
      Number(raw);

    if (
      Number.isFinite(parsed)
    ) {
      return parsed;
    }
  }

  return null;
}

function arrayValue(
  source: UnknownRecord,
  keys: string[]
): unknown[] {
  for (const key of keys) {
    const value =
      source[key];

    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
}

function dateValue(
  source: UnknownRecord,
  keys: string[]
): string | null {
  for (const key of keys) {
    const raw =
      source[key];

    if (
      typeof raw !== "string" &&
      typeof raw !== "number"
    ) {
      continue;
    }

    const date =
      new Date(raw);

    if (
      !Number.isNaN(
        date.getTime()
      )
    ) {
      return date.toISOString();
    }
  }

  return null;
}

function safePercent(
  numerator: number,
  denominator: number
): number | null {
  if (
    denominator === 0 ||
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator)
  ) {
    return null;
  }

  return (
    numerator /
    denominator
  ) * 100;
}

function clamp(
  value: number,
  minimum = 0,
  maximum = 100
): number {
  return Math.max(
    minimum,
    Math.min(
      maximum,
      value
    )
  );
}

function inferStatus(
  source: UnknownRecord,
  paymentDate: string | null
): PositionDividendStatus {
  const raw =
    text(
      source,
      [
        "status",
        "eventStatus",
        "paymentStatus",
        "classification",
      ]
    ).toUpperCase();

  if (
    raw.includes("CANCEL")
  ) {
    return "CANCELLED";
  }

  if (
    raw.includes("PAID") ||
    raw.includes("RECEIVED")
  ) {
    return "PAID";
  }

  if (
    raw.includes("ANNOUN") ||
    raw.includes("DECLAR")
  ) {
    return "ANNOUNCED";
  }

  if (
    raw.includes("EXPECT")
  ) {
    return "EXPECTED";
  }

  if (paymentDate) {
    const timestamp =
      new Date(
        paymentDate
      ).getTime();

    if (
      !Number.isNaN(timestamp) &&
      timestamp <
      Date.now()
    ) {
      return "PAID";
    }
  }

  return "FORECAST";
}

function defaultConfidence(
  status: PositionDividendStatus
): number {
  if (status === "PAID") {
    return 100;
  }

  if (status === "ANNOUNCED") {
    return 95;
  }

  if (status === "EXPECTED") {
    return 75;
  }

  if (status === "CANCELLED") {
    return 100;
  }

  return 55;
}

function daysUntil(
  date: string | null
): number | null {
  if (!date) {
    return null;
  }

  const timestamp =
    new Date(
      date
    ).getTime();

  if (
    Number.isNaN(timestamp)
  ) {
    return null;
  }

  return Math.ceil(
    (
      timestamp -
      Date.now()
    ) /
    86_400_000
  );
}

function normaliseDividend({
  value,
  position,
  index,
}: {
  value: unknown;
  position: HoldingsVisualPosition;
  index: number;
}): PositionDividendEvent | null {
  const source =
    record(value);

  const symbol =
    text(
      source,
      [
        "symbol",
        "ticker",
        "code",
      ]
    ).toUpperCase() ||
    position.symbol;

  if (
    symbol !==
    position.symbol
  ) {
    return null;
  }

  const paymentDate =
    dateValue(
      source,
      [
        "paymentDate",
        "payDate",
        "date",
        "receivedDate",
      ]
    );

  const exDividendDate =
    dateValue(
      source,
      [
        "exDividendDate",
        "exDate",
      ]
    );

  const recordDate =
    dateValue(
      source,
      [
        "recordDate",
      ]
    );

  const quantity =
    numeric(
      source,
      [
        "quantity",
        "units",
        "shares",
        "eligibleQuantity",
      ]
    ) ??
    position.quantity;

  const amountPerShare =
    numeric(
      source,
      [
        "amountPerShare",
        "dividendPerShare",
        "distributionPerUnit",
        "rate",
      ]
    ) || 0;

  const grossAmount =
    numeric(
      source,
      [
        "grossAmount",
        "grossIncome",
        "amount",
        "dividendAmount",
        "projectedPayment",
      ]
    ) ??
    (
      amountPerShare *
      quantity
    );

  const withholdingTax =
    numeric(
      source,
      [
        "withholdingTax",
        "taxWithheld",
        "withholding",
      ]
    ) || 0;

  const frankingCredit =
    numeric(
      source,
      [
        "frankingCredit",
        "frankingCredits",
        "imputationCredit",
      ]
    ) || 0;

  const netAmount =
    numeric(
      source,
      [
        "netAmount",
        "netIncome",
        "receivedAmount",
      ]
    ) ??
    (
      grossAmount -
      withholdingTax
    );

  if (
    !paymentDate &&
    !exDividendDate &&
    grossAmount === 0 &&
    amountPerShare === 0
  ) {
    return null;
  }

  const status =
    inferStatus(
      source,
      paymentDate
    );

  return {
    id:
      text(
        source,
        [
          "id",
          "eventId",
          "dividendId",
          "transactionId",
        ]
      ) ||
      `${position.symbol}-DIVIDEND-${index + 1}`,

    symbol:
      position.symbol,

    exDividendDate,
    recordDate,
    paymentDate,

    amountPerShare,
    quantity,

    grossAmount,
    withholdingTax,
    frankingCredit,
    netAmount,

    currency:
      text(
        source,
        [
          "currency",
          "dividendCurrency",
        ]
      ).toUpperCase() ||
      position.currency,

    status,

    confidence:
      clamp(
        numeric(
          source,
          [
            "confidence",
            "confidenceScore",
            "forecastConfidence",
          ]
        ) ??
        defaultConfidence(
          status
        )
      ),

    source:
      value,
  };
}

function syntheticForwardEvent(
  position: HoldingsVisualPosition
): PositionDividendEvent | null {
  const source =
    record(
      position.original
    );

  const nextPaymentDate =
    dateValue(
      source,
      [
        "nextPaymentDate",
        "paymentDate",
      ]
    );

  const nextExDividendDate =
    dateValue(
      source,
      [
        "nextExDividendDate",
        "exDividendDate",
      ]
    );

  const nextPaymentAmount =
    numeric(
      source,
      [
        "nextPaymentAmount",
        "projectedPayment",
        "forecastPayment",
      ]
    );

  if (
    !nextPaymentDate &&
    !nextExDividendDate &&
    nextPaymentAmount === null
  ) {
    return null;
  }

  const grossAmount =
    nextPaymentAmount ??
    position.annualIncome /
    4;

  return {
    id:
      `${position.symbol}-SYNTHETIC-FORWARD-DIVIDEND`,

    symbol:
      position.symbol,

    exDividendDate:
      nextExDividendDate,

    recordDate:
      null,

    paymentDate:
      nextPaymentDate,

    amountPerShare:
      position.quantity > 0
        ? grossAmount /
          position.quantity
        : 0,

    quantity:
      position.quantity,

    grossAmount,

    withholdingTax:
      0,

    frankingCredit:
      0,

    netAmount:
      grossAmount,

    currency:
      position.currency,

    status:
      "EXPECTED",

    confidence:
      65,

    source:
      position.original,
  };
}

function createAnnualHistory(
  events: PositionDividendEvent[]
): PositionDividendYear[] {
  const yearMap =
    new Map<
      number,
      PositionDividendYear
    >();

  for (const event of events) {
    if (
      event.status !== "PAID" ||
      !event.paymentDate
    ) {
      continue;
    }

    const date =
      new Date(
        event.paymentDate
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      continue;
    }

    const year =
      date.getFullYear();

    const existing =
      yearMap.get(
        year
      ) || {
        year,

        grossIncome: 0,
        netIncome: 0,
        frankingCredits: 0,
        withholdingTax: 0,

        paymentCount: 0,

        growthPercent: null,
      };

    existing.grossIncome +=
      event.grossAmount;

    existing.netIncome +=
      event.netAmount;

    existing.frankingCredits +=
      event.frankingCredit;

    existing.withholdingTax +=
      event.withholdingTax;

    existing.paymentCount +=
      1;

    yearMap.set(
      year,
      existing
    );
  }

  const years =
    Array.from(
      yearMap.values()
    ).sort(
      (
        left,
        right
      ) =>
        left.year -
        right.year
    );

  return years.map(
    (
      year,
      index
    ) => {
      const previous =
        years[
          index -
          1
        ];

      return {
        ...year,

        growthPercent:
          previous &&
          previous.netIncome !== 0
            ? safePercent(
                year.netIncome -
                previous.netIncome,
                previous.netIncome
              )
            : null,
      };
    }
  );
}

function createMonthlyProfile(
  events: PositionDividendEvent[]
): PositionDividendMonth[] {
  const formatter =
    new Intl.DateTimeFormat(
      "en-AU",
      {
        month:
          "short",
        timeZone:
          "UTC",
      }
    );

  const months:
    PositionDividendMonth[] =
      Array.from(
        {
          length: 12,
        },
        (
          _,
          index
        ) => ({
          month:
            index,

          monthLabel:
            formatter.format(
              new Date(
                Date.UTC(
                  2024,
                  index,
                  1
                )
              )
            ),

          grossIncome: 0,
          netIncome: 0,

          paymentCount: 0,
        })
      );

  for (const event of events) {
    if (
      event.status ===
      "CANCELLED"
    ) {
      continue;
    }

    const dateValue =
      event.paymentDate ||
      event.exDividendDate;

    if (!dateValue) {
      continue;
    }

    const date =
      new Date(
        dateValue
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      continue;
    }

    const month =
      date.getUTCMonth();

    months[
      month
    ].grossIncome +=
      event.grossAmount;

    months[
      month
    ].netIncome +=
      event.netAmount;

    months[
      month
    ].paymentCount +=
      1;
  }

  return months;
}

function compoundAnnualGrowth(
  history: PositionDividendYear[]
): number | null {
  if (
    history.length <
    2
  ) {
    return null;
  }

  const first =
    history[0];

  const last =
    history[
      history.length -
      1
    ];

  const periods =
    last.year -
    first.year;

  if (
    periods <= 0 ||
    first.netIncome <= 0 ||
    last.netIncome <= 0
  ) {
    return null;
  }

  return (
    Math.pow(
      last.netIncome /
      first.netIncome,
      1 /
      periods
    ) -
    1
  ) * 100;
}

export function createPositionDividendSnapshot({
  position,
  portfolioSnapshot,
}: {
  position:
    HoldingsVisualPosition;

  portfolioSnapshot:
    HoldingsVisualSnapshot;
}): PositionDividendSnapshot {
  const source =
    record(
      position.original
    );

  const rawEvents = [
    ...arrayValue(
      source,
      [
        "dividends",
        "dividendHistory",
        "distributions",
        "incomeHistory",
      ]
    ),

    ...arrayValue(
      source,
      [
        "upcomingDividends",
        "upcomingPayments",
        "forecastDividends",
      ]
    ),
  ];

  const eventMap =
    new Map<
      string,
      PositionDividendEvent
    >();

  rawEvents
    .map(
      (
        value,
        index
      ) =>
        normaliseDividend({
          value,
          position,
          index,
        })
    )
    .filter(
      (
        event
      ): event is PositionDividendEvent =>
        Boolean(event)
    )
    .forEach(
      event => {
        eventMap.set(
          event.id,
          event
        );
      }
    );

  const synthetic =
    syntheticForwardEvent(
      position
    );

  if (
    synthetic &&
    !eventMap.has(
      synthetic.id
    )
  ) {
    eventMap.set(
      synthetic.id,
      synthetic
    );
  }

  const events =
    Array.from(
      eventMap.values()
    ).sort(
      (
        left,
        right
      ) =>
        new Date(
          right.paymentDate ||
          right.exDividendDate ||
          0
        ).getTime() -
        new Date(
          left.paymentDate ||
          left.exDividendDate ||
          0
        ).getTime()
    );

  const historicalEvents =
    events
      .filter(
        event =>
          event.status ===
          "PAID"
      )
      .sort(
        (
          left,
          right
        ) =>
          new Date(
            right.paymentDate ||
            0
          ).getTime() -
          new Date(
            left.paymentDate ||
            0
          ).getTime()
      );

  const upcomingEvents =
    events
      .filter(
        event =>
          event.status !==
            "PAID" &&
          event.status !==
            "CANCELLED"
      )
      .sort(
        (
          left,
          right
        ) =>
          new Date(
            left.paymentDate ||
            left.exDividendDate ||
            "9999-12-31"
          ).getTime() -
          new Date(
            right.paymentDate ||
            right.exDividendDate ||
            "9999-12-31"
          ).getTime()
      );

  const annualHistory =
    createAnnualHistory(
      events
    );

  const monthlyProfile =
    createMonthlyProfile(
      events
    );

  const nextPayment =
    upcomingEvents[0] ||
    null;

  const historicalGrossIncome =
    historicalEvents.reduce(
      (
        total,
        event
      ) =>
        total +
        event.grossAmount,
      0
    );

  const historicalNetIncome =
    historicalEvents.reduce(
      (
        total,
        event
      ) =>
        total +
        event.netAmount,
      0
    );

  const upcomingGrossIncome =
    upcomingEvents.reduce(
      (
        total,
        event
      ) =>
        total +
        event.grossAmount,
      0
    );

  const upcomingNetIncome =
    upcomingEvents.reduce(
      (
        total,
        event
      ) =>
        total +
        event.netAmount,
      0
    );

  const averageConfidence =
    events.length > 0
      ? events.reduce(
          (
            total,
            event
          ) =>
            total +
            event.confidence,
          0
        ) /
        events.length
      : 0;

  return {
    events,
    historicalEvents,
    upcomingEvents,

    annualHistory,
    monthlyProfile,

    nextPayment,

    totals: {
      historicalGrossIncome,
      historicalNetIncome,

      upcomingGrossIncome,
      upcomingNetIncome,

      forwardAnnualIncome:
        position.annualIncome,

      monthlyAverageIncome:
        position.annualIncome /
        12,

      currentYield:
        position.dividendYield,

      yieldOnCost:
        safePercent(
          position.annualIncome,
          position.costBasis
        ),

      incomeContribution:
        safePercent(
          position.annualIncome,
          portfolioSnapshot.totals.annualIncome
        ),

      latestAnnualGrowth:
        annualHistory[
          annualHistory.length -
          1
        ]?.growthPercent ??
        null,

      compoundAnnualGrowth:
        compoundAnnualGrowth(
          annualHistory
        ),

      averageConfidence,

      historicalPaymentCount:
        historicalEvents.length,

      upcomingPaymentCount:
        upcomingEvents.length,

      daysUntilNextPayment:
        daysUntil(
          nextPayment
            ?.paymentDate ||
          null
        ),

      daysUntilNextExDividend:
        daysUntil(
          nextPayment
            ?.exDividendDate ||
          null
        ),
    },
  };
}
