import type {
  MarketDataExchange,
  QuoteQualityThresholds,
  QuoteTradingStatus,
} from "./marketDataTypes";
import {
  tradingCalendarForExchange,
} from "./exchangeTradingCalendar";
import type {
  ExchangeHolidayOverride,
  ExchangeSessionWindow,
  MarketClockInput,
  MarketClosureReason,
  MarketSessionSnapshot,
  MarketSessionType,
  MarketTimeOfDay,
  TradingDayName,
} from "./marketSessionTypes";

const DAY_NAMES:
  TradingDayName[] = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

type LocalDateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  dayName: TradingDayName;
  dateKey: string;
};

function pad(
  value: number
): string {
  return String(
    value
  ).padStart(
    2,
    "0"
  );
}

function datePartsInTimezone(
  date: Date,
  timezone: string
): LocalDateParts {
  const formatter =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          timezone,

        year:
          "numeric",

        month:
          "2-digit",

        day:
          "2-digit",

        hour:
          "2-digit",

        minute:
          "2-digit",

        second:
          "2-digit",

        hourCycle:
          "h23",

        weekday:
          "short",
      }
    );

  const parts =
    Object.fromEntries(
      formatter
        .formatToParts(
          date
        )
        .filter(
          (
            part
          ) =>
            part.type !==
            "literal"
        )
        .map(
          (
            part
          ) => [
            part.type,
            part.value,
          ]
        )
    );

  const weekdayMap:
    Record<string, TradingDayName> = {
    Sun:
      "SUNDAY",

    Mon:
      "MONDAY",

    Tue:
      "TUESDAY",

    Wed:
      "WEDNESDAY",

    Thu:
      "THURSDAY",

    Fri:
      "FRIDAY",

    Sat:
      "SATURDAY",
  };

  const year =
    Number(
      parts.year
    );

  const month =
    Number(
      parts.month
    );

  const day =
    Number(
      parts.day
    );

  return {
    year,
    month,
    day,

    hour:
      Number(
        parts.hour
      ),

    minute:
      Number(
        parts.minute
      ),

    second:
      Number(
        parts.second
      ),

    dayName:
      weekdayMap[
        parts.weekday
      ] ||
      "SUNDAY",

    dateKey:
      `${year}-${pad(
        month
      )}-${pad(
        day
      )}`,
  };
}

function timezoneOffsetMilliseconds(
  date: Date,
  timezone: string
): number {
  const parts =
    datePartsInTimezone(
      date,
      timezone
    );

  const representedAsUtc =
    Date.UTC(
      parts.year,
      parts.month -
        1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second
    );

  return (
    representedAsUtc -
    date.getTime()
  );
}

function localDateTimeToUtc(
  timezone: string,
  year: number,
  month: number,
  day: number,
  time: MarketTimeOfDay
): Date {
  const initial =
    new Date(
      Date.UTC(
        year,
        month -
          1,
        day,
        time.hour,
        time.minute,
        0
      )
    );

  const firstOffset =
    timezoneOffsetMilliseconds(
      initial,
      timezone
    );

  const firstPass =
    new Date(
      initial.getTime() -
      firstOffset
    );

  const secondOffset =
    timezoneOffsetMilliseconds(
      firstPass,
      timezone
    );

  return new Date(
    initial.getTime() -
    secondOffset
  );
}

function localDayDate(
  base:
    LocalDateParts,
  dayOffset:
    number
): {
  year: number;
  month: number;
  day: number;
  dayName: TradingDayName;
  dateKey: string;
} {
  const utc =
    new Date(
      Date.UTC(
        base.year,
        base.month -
          1,
        base.day +
          dayOffset,
        12,
        0,
        0
      )
    );

  const dayName =
    DAY_NAMES[
      utc.getUTCDay()
    ];

  return {
    year:
      utc.getUTCFullYear(),

    month:
      utc.getUTCMonth() +
      1,

    day:
      utc.getUTCDate(),

    dayName,

    dateKey:
      `${utc.getUTCFullYear()}-${pad(
        utc.getUTCMonth() +
        1
      )}-${pad(
        utc.getUTCDate()
      )}`,
  };
}

function minutesOfDay(
  time:
    MarketTimeOfDay
): number {
  return (
    time.hour *
      60 +
    time.minute
  );
}

function currentMinutes(
  parts:
    LocalDateParts
): number {
  return (
    parts.hour *
      60 +
    parts.minute +
    parts.second /
      60
  );
}

function sessionContains(
  session:
    ExchangeSessionWindow,
  minutes:
    number
): boolean {
  const open =
    minutesOfDay(
      session.opensAt
    );

  const close =
    minutesOfDay(
      session.closesAt
    );

  if (
    session.crossesMidnight
  ) {
    return (
      minutes >=
        open ||
      minutes <
        close
    );
  }

  return (
    minutes >=
      open &&
    minutes <
      close
  );
}

function tradingStatusForSession(
  sessionType:
    MarketSessionType
): QuoteTradingStatus {
  if (
    sessionType ===
    "REGULAR" ||
    sessionType ===
    "CONTINUOUS"
  ) {
    return "OPEN";
  }

  if (
    sessionType ===
    "PRE_MARKET"
  ) {
    return "PRE_MARKET";
  }

  if (
    sessionType ===
    "AFTER_HOURS"
  ) {
    return "AFTER_HOURS";
  }

  if (
    sessionType ===
    "HALTED"
  ) {
    return "HALTED";
  }

  if (
    sessionType ===
    "CLOSED"
  ) {
    return "CLOSED";
  }

  return "UNKNOWN";
}

function thresholdsForSession(
  sessionType:
    MarketSessionType,
  calendar:
    ReturnType<
      typeof tradingCalendarForExchange
    >
): QuoteQualityThresholds {
  if (
    sessionType ===
    "REGULAR" ||
    sessionType ===
    "CONTINUOUS"
  ) {
    return {
      ...calendar
        .openMarketThresholds,
    };
  }

  if (
    sessionType ===
    "PRE_MARKET"
  ) {
    return {
      ...calendar
        .preMarketThresholds,
    };
  }

  if (
    sessionType ===
    "AFTER_HOURS"
  ) {
    return {
      ...calendar
        .afterHoursThresholds,
    };
  }

  return {
    ...calendar
      .closedMarketThresholds,
  };
}

function holidayForDate(
  exchange:
    MarketDataExchange,
  dateKey:
    string,
  holidays:
    ExchangeHolidayOverride[]
): ExchangeHolidayOverride | null {
  return (
    holidays.find(
      (
        holiday
      ) =>
        holiday.exchange ===
          exchange &&
        holiday.date ===
          dateKey
    ) ||
    null
  );
}

function regularSessionsForDay(
  calendar:
    ReturnType<
      typeof tradingCalendarForExchange
    >,
  holiday:
    ExchangeHolidayOverride |
    null
): ExchangeSessionWindow[] {
  if (
    holiday?.closed
  ) {
    return [];
  }

  return calendar.sessions.map(
    (
      session
    ) => {
      if (
        session.type !==
        "REGULAR"
      ) {
        if (
          session.type ===
            "PRE_MARKET" &&
          holiday
            ?.preMarketOpen
        ) {
          return {
            ...session,

            opensAt:
              holiday
                .preMarketOpen,
          };
        }

        if (
          session.type ===
            "AFTER_HOURS" &&
          holiday
            ?.afterHoursClose
        ) {
          return {
            ...session,

            closesAt:
              holiday
                .afterHoursClose,
          };
        }

        return session;
      }

      return {
        ...session,

        opensAt:
          holiday
            ?.regularOpen ||
          session.opensAt,

        closesAt:
          holiday
            ?.regularClose ||
          session.closesAt,
      };
    }
  );
}

function firstOpenSession(
  sessions:
    ExchangeSessionWindow[]
): ExchangeSessionWindow | null {
  return (
    [...sessions]
      .sort(
        (
          left,
          right
        ) =>
          minutesOfDay(
            left.opensAt
          ) -
          minutesOfDay(
            right.opensAt
          )
      )[
        0
      ] ||
    null
  );
}

function lastCloseSession(
  sessions:
    ExchangeSessionWindow[]
): ExchangeSessionWindow | null {
  return (
    [...sessions]
      .sort(
        (
          left,
          right
        ) =>
          minutesOfDay(
            right.closesAt
          ) -
          minutesOfDay(
            left.closesAt
          )
      )[
        0
      ] ||
    null
  );
}

function secondsBetween(
  from:
    Date,
  to:
    Date |
    null
): number | null {
  if (
    !to
  ) {
    return null;
  }

  return Math.max(
    0,
    Math.floor(
      (
        to.getTime() -
        from.getTime()
      ) /
      1_000
    )
  );
}

function sessionMessage(
  snapshot: {
    sessionType:
      MarketSessionType;

    closureReason:
      MarketClosureReason |
      null;

    exchangeName:
      string;

    holidayName:
      string |
      null;
  }
): string {
  if (
    snapshot.sessionType ===
    "REGULAR"
  ) {
    return `${snapshot.exchangeName} is in its regular trading session.`;
  }

  if (
    snapshot.sessionType ===
    "PRE_MARKET"
  ) {
    return `${snapshot.exchangeName} is in pre-market trading.`;
  }

  if (
    snapshot.sessionType ===
    "AFTER_HOURS"
  ) {
    return `${snapshot.exchangeName} is in after-hours trading.`;
  }

  if (
    snapshot.sessionType ===
    "CONTINUOUS"
  ) {
    return `${snapshot.exchangeName} is trading continuously.`;
  }

  if (
    snapshot.sessionType ===
    "HALTED"
  ) {
    return `${snapshot.exchangeName} trading is marked as halted.`;
  }

  if (
    snapshot.closureReason ===
      "HOLIDAY"
  ) {
    return `${snapshot.exchangeName} is closed for ${snapshot.holidayName || "a market holiday"}.`;
  }

  if (
    snapshot.closureReason ===
      "WEEKEND"
  ) {
    return `${snapshot.exchangeName} is closed for the weekend.`;
  }

  if (
    snapshot.closureReason ===
      "UNSUPPORTED_EXCHANGE"
  ) {
    return "Trading hours are unavailable for this exchange.";
  }

  return `${snapshot.exchangeName} is outside its active trading session.`;
}

function findNextOpenAndClose({
  exchange,
  local,
  now,
  holidays,
}: {
  exchange:
    MarketDataExchange;

  local:
    LocalDateParts;

  now:
    Date;

  holidays:
    ExchangeHolidayOverride[];
}): {
  nextOpen:
    Date |
    null;

  nextClose:
    Date |
    null;
} {
  const calendar =
    tradingCalendarForExchange(
      exchange
    );

  for (
    let offset =
      0;
    offset <=
      14;
    offset +=
      1
  ) {
    const day =
      localDayDate(
        local,
        offset
      );

    if (
      !calendar
        .tradingDays
        .includes(
          day.dayName
        )
    ) {
      continue;
    }

    const holiday =
      holidayForDate(
        exchange,
        day.dateKey,
        holidays
      );

    const sessions =
      regularSessionsForDay(
        calendar,
        holiday
      );

    if (
      sessions.length ===
      0
    ) {
      continue;
    }

    for (
      const session of
      [...sessions].sort(
        (
          left,
          right
        ) =>
          minutesOfDay(
            left.opensAt
          ) -
          minutesOfDay(
            right.opensAt
          )
      )
    ) {
      const open =
        localDateTimeToUtc(
          calendar.timezone,
          day.year,
          day.month,
          day.day,
          session.opensAt
        );

      const close =
        localDateTimeToUtc(
          calendar.timezone,
          day.year,
          day.month,
          day.day,
          session.closesAt
        );

      if (
        open.getTime() >
        now.getTime()
      ) {
        return {
          nextOpen:
            open,

          nextClose:
            close,
        };
      }

      if (
        now.getTime() >=
          open.getTime() &&
        now.getTime() <
          close.getTime()
      ) {
        return {
          nextOpen:
            open,

          nextClose:
            close,
        };
      }
    }
  }

  return {
    nextOpen:
      null,

    nextClose:
      null,
  };
}

export function createMarketSessionSnapshot({
  exchange,
  now =
    new Date(),
  holidays = [],
  tradingHalted =
    false,
}: MarketClockInput): MarketSessionSnapshot {
  const calendar =
    tradingCalendarForExchange(
      exchange
    );

  const local =
    datePartsInTimezone(
      now,
      calendar.timezone
    );

  const holiday =
    holidayForDate(
      exchange,
      local.dateKey,
      holidays
    );

  const tradingDay =
    calendar.tradingDays.includes(
      local.dayName
    );

  const sessions =
    regularSessionsForDay(
      calendar,
      holiday
    );

  const minute =
    currentMinutes(
      local
    );

  const activeSession =
    sessions.find(
      (
        session
      ) =>
        sessionContains(
          session,
          minute
        )
    ) ||
    null;

  let sessionType:
    MarketSessionType =
      activeSession
        ?.type ||
      "CLOSED";

  let closureReason:
    MarketClosureReason |
    null =
      null;

  if (
    exchange ===
    "UNKNOWN"
  ) {
    sessionType =
      "UNKNOWN";

    closureReason =
      "UNSUPPORTED_EXCHANGE";
  } else if (
    tradingHalted
  ) {
    sessionType =
      "HALTED";

    closureReason =
      "TRADING_HALT";
  } else if (
    holiday?.closed
  ) {
    sessionType =
      "CLOSED";

    closureReason =
      "HOLIDAY";
  } else if (
    !tradingDay
  ) {
    sessionType =
      "CLOSED";

    closureReason =
      "WEEKEND";
  } else if (
    !activeSession
  ) {
    sessionType =
      "CLOSED";

    closureReason =
      "OUTSIDE_SESSION";
  }

  const firstSession =
    firstOpenSession(
      sessions
    );

  const lastSession =
    lastCloseSession(
      sessions
    );

  const currentOpen =
    activeSession
      ? localDateTimeToUtc(
          calendar.timezone,
          local.year,
          local.month,
          local.day,
          activeSession.opensAt
        )
      : null;

  const currentClose =
    activeSession
      ? localDateTimeToUtc(
          calendar.timezone,
          local.year,
          local.month,
          local.day,
          activeSession.closesAt
        )
      : null;

  const next =
    findNextOpenAndClose({
      exchange,
      local,
      now,
      holidays,
    });

  const regularSession =
    sessions.find(
      (
        session
      ) =>
        session.type ===
        "REGULAR"
    ) ||
    null;

  const earlyClose =
    Boolean(
      holiday
        ?.regularClose &&
      regularSession &&
      minutesOfDay(
        holiday.regularClose
      ) !==
        minutesOfDay(
          regularSession.closesAt
        )
    );

  const snapshotBase = {
    sessionType,
    closureReason,

    exchangeName:
      calendar.name,

    holidayName:
      holiday?.name ||
      null,
  };

  const marketOpen =
    sessionType ===
      "REGULAR" ||
    sessionType ===
      "PRE_MARKET" ||
    sessionType ===
      "AFTER_HOURS" ||
    sessionType ===
      "CONTINUOUS";

  return {
    exchange,
    exchangeName:
      calendar.name,

    timezone:
      calendar.timezone,

    nowUtc:
      now.toISOString(),

    nowLocal:
      `${local.dateKey}T${pad(
        local.hour
      )}:${pad(
        local.minute
      )}:${pad(
        local.second
      )}`,

    localDate:
      local.dateKey,

    dayName:
      local.dayName,

    sessionType,

    tradingStatus:
      tradingStatusForSession(
        sessionType
      ),

    marketOpen,

    marketClosed:
      !marketOpen,

    continuous:
      calendar.continuous,

    tradingHalted,

    closureReason,

    currentSessionOpenedAt:
      currentOpen
        ?.toISOString() ||
      null,

    currentSessionClosesAt:
      currentClose
        ?.toISOString() ||
      null,

    nextOpenAt:
      next.nextOpen
        ?.toISOString() ||
      null,

    nextCloseAt:
      next.nextClose
        ?.toISOString() ||
      null,

    secondsUntilOpen:
      marketOpen
        ? 0
        : secondsBetween(
            now,
            next.nextOpen
          ),

    secondsUntilClose:
      marketOpen
        ? secondsBetween(
            now,
            currentClose ||
            next.nextClose
          )
        : secondsBetween(
            now,
            next.nextClose
          ),

    holidayName:
      holiday?.name ||
      null,

    earlyClose,

    thresholds:
      thresholdsForSession(
        sessionType,
        calendar
      ),

    message:
      sessionMessage(
        snapshotBase
      ),
  };
}

export function isMarketOpen(
  exchange:
    MarketDataExchange,
  now =
    new Date(),
  holidays:
    ExchangeHolidayOverride[] =
      []
): boolean {
  return createMarketSessionSnapshot({
    exchange,
    now,
    holidays,
  }).marketOpen;
}

export function marketTradingStatus(
  exchange:
    MarketDataExchange,
  now =
    new Date(),
  holidays:
    ExchangeHolidayOverride[] =
      []
): QuoteTradingStatus {
  return createMarketSessionSnapshot({
    exchange,
    now,
    holidays,
  }).tradingStatus;
}
