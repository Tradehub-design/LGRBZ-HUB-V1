import {
  exchangeTradingSession,
} from "./exchangeTradingSessions";
import {
  marketHoliday,
} from "./marketHolidayCalendar";
import type {
  MarketClockResult,
  MarketClockState,
  MarketSessionDefinition,
  MarketWeekday,
} from "./marketHoursTypes";
import type {
  MarketDataExchange,
  QuoteTradingStatus,
} from "./marketDataTypes";

type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: MarketWeekday;
};

const WEEKDAY_MAP:
  Record<string, MarketWeekday> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7,
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

function zonedParts(
  date: Date,
  timezone: string
): ZonedParts {
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
    formatter.formatToParts(
      date
    );

  const value =
    (
      type: string
    ) =>
      parts.find(
        (
          part
        ) =>
          part.type === type
      )?.value ||
      "";

  return {
    year:
      Number(
        value(
          "year"
        )
      ),

    month:
      Number(
        value(
          "month"
        )
      ),

    day:
      Number(
        value(
          "day"
        )
      ),

    hour:
      Number(
        value(
          "hour"
        )
      ),

    minute:
      Number(
        value(
          "minute"
        )
      ),

    second:
      Number(
        value(
          "second"
        )
      ),

    weekday:
      WEEKDAY_MAP[
        value(
          "weekday"
        )
      ] ||
      7,
  };
}

function localDate(
  parts: ZonedParts
): string {
  return [
    parts.year,
    pad(
      parts.month
    ),
    pad(
      parts.day
    ),
  ].join(
    "-"
  );
}

function localTime(
  parts: ZonedParts
): string {
  return [
    pad(
      parts.hour
    ),
    pad(
      parts.minute
    ),
    pad(
      parts.second
    ),
  ].join(
    ":"
  );
}

function timeToSeconds(
  value: string
): number {
  const [
    hours,
    minutes,
    seconds = "0",
  ] =
    value
      .split(
        ":"
      );

  return (
    Number(
      hours
    ) *
      3_600 +
    Number(
      minutes
    ) *
      60 +
    Number(
      seconds
    )
  );
}

function currentSeconds(
  parts: ZonedParts
): number {
  return (
    parts.hour *
      3_600 +
    parts.minute *
      60 +
    parts.second
  );
}

function sessionContains(
  session:
    MarketSessionDefinition,
  seconds:
    number,
  earlyCloseTime:
    string |
    null
): boolean {
  const open =
    timeToSeconds(
      session.openTime
    );

  const regularClose =
    timeToSeconds(
      session.closeTime
    );

  const close =
    session.type ===
      "REGULAR" &&
    earlyCloseTime
      ? Math.min(
          regularClose,
          timeToSeconds(
            earlyCloseTime
          )
        )
      : regularClose;

  if (
    open <= close
  ) {
    return (
      seconds >= open &&
      seconds < close
    );
  }

  return (
    seconds >= open ||
    seconds < close
  );
}

function stateFromSession(
  session:
    MarketSessionDefinition |
    null
): MarketClockState {
  if (
    !session
  ) {
    return "CLOSED";
  }

  if (
    session.type ===
    "REGULAR"
  ) {
    return "OPEN";
  }

  return session.type;
}

function tradingStatusFromState(
  state:
    MarketClockState
): QuoteTradingStatus {
  if (
    state ===
    "OPEN"
  ) {
    return "OPEN";
  }

  if (
    state ===
    "PRE_MARKET"
  ) {
    return "PRE_MARKET";
  }

  if (
    state ===
    "AFTER_HOURS"
  ) {
    return "AFTER_HOURS";
  }

  return "CLOSED";
}

function timezoneOffsetMilliseconds(
  date: Date,
  timezone: string
): number {
  const parts =
    zonedParts(
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

function zonedLocalToUtc(
  year: number,
  month: number,
  day: number,
  time: string,
  timezone: string
): Date {
  const [
    hour,
    minute,
    second = "0",
  ] =
    time.split(
      ":"
    );

  const guess =
    new Date(
      Date.UTC(
        year,
        month -
          1,
        day,
        Number(
          hour
        ),
        Number(
          minute
        ),
        Number(
          second
        )
      )
    );

  const offset =
    timezoneOffsetMilliseconds(
      guess,
      timezone
    );

  return new Date(
    guess.getTime() -
    offset
  );
}

function addLocalDays(
  parts: ZonedParts,
  days: number
): {
  year: number;
  month: number;
  day: number;
} {
  const date =
    new Date(
      Date.UTC(
        parts.year,
        parts.month -
          1,
        parts.day +
          days,
        12,
        0,
        0
      )
    );

  return {
    year:
      date.getUTCFullYear(),

    month:
      date.getUTCMonth() +
      1,

    day:
      date.getUTCDate(),
  };
}

function localWeekdayForDate(
  year: number,
  month: number,
  day: number
): MarketWeekday {
  const dayValue =
    new Date(
      Date.UTC(
        year,
        month -
          1,
        day,
        12,
        0,
        0
      )
    ).getUTCDay();

  return (
    dayValue === 0
      ? 7
      : dayValue
  ) as MarketWeekday;
}

function dateKey(
  year: number,
  month: number,
  day: number
): string {
  return [
    year,
    pad(
      month
    ),
    pad(
      day
    ),
  ].join(
    "-"
  );
}

function nextRegularOpen(
  exchange: MarketDataExchange,
  now: Date
): Date | null {
  const definition =
    exchangeTradingSession(
      exchange
    );

  const regularSessions =
    definition.sessions
      .filter(
        (
          session
        ) =>
          session.enabled &&
          session.type ===
          "REGULAR"
      )
      .sort(
        (
          left,
          right
        ) =>
          timeToSeconds(
            left.openTime
          ) -
          timeToSeconds(
            right.openTime
          )
      );

  if (
    regularSessions.length ===
    0
  ) {
    return null;
  }

  const current =
    zonedParts(
      now,
      definition.timezone
    );

  for (
    let dayOffset =
      0;
    dayOffset <=
      14;
    dayOffset +=
      1
  ) {
    const candidateDate =
      addLocalDays(
        current,
        dayOffset
      );

    const weekday =
      localWeekdayForDate(
        candidateDate.year,
        candidateDate.month,
        candidateDate.day
      );

    if (
      !definition
        .tradingWeekdays
        .includes(
          weekday
        )
    ) {
      continue;
    }

    const key =
      dateKey(
        candidateDate.year,
        candidateDate.month,
        candidateDate.day
      );

    const holiday =
      marketHoliday(
        exchange,
        key
      );

    if (
      holiday?.closed
    ) {
      continue;
    }

    for (
      const session of
      regularSessions
    ) {
      const open =
        zonedLocalToUtc(
          candidateDate.year,
          candidateDate.month,
          candidateDate.day,
          session.openTime,
          definition.timezone
        );

      if (
        open.getTime() >
        now.getTime()
      ) {
        return open;
      }
    }
  }

  return null;
}

function currentRegularClose(
  exchange: MarketDataExchange,
  now: Date
): Date | null {
  const definition =
    exchangeTradingSession(
      exchange
    );

  const current =
    zonedParts(
      now,
      definition.timezone
    );

  const key =
    localDate(
      current
    );

  const holiday =
    marketHoliday(
      exchange,
      key
    );

  const seconds =
    currentSeconds(
      current
    );

  const active =
    definition.sessions.find(
      (
        session
      ) =>
        session.enabled &&
        session.type ===
          "REGULAR" &&
        sessionContains(
          session,
          seconds,
          holiday?.earlyCloseTime ||
          null
        )
    );

  if (
    !active
  ) {
    return null;
  }

  const closeTime =
    holiday?.earlyCloseTime ||
    active.closeTime;

  return zonedLocalToUtc(
    current.year,
    current.month,
    current.day,
    closeTime,
    definition.timezone
  );
}

function resultMessage(
  state: MarketClockState,
  exchangeName: string,
  holidayName:
    string |
    null
): string {
  if (
    state ===
    "OPEN"
  ) {
    return `${exchangeName} is open for regular trading.`;
  }

  if (
    state ===
    "PRE_MARKET"
  ) {
    return `${exchangeName} is in its pre-market session.`;
  }

  if (
    state ===
    "AFTER_HOURS"
  ) {
    return `${exchangeName} is in its after-hours session.`;
  }

  if (
    state ===
    "HOLIDAY"
  ) {
    return `${exchangeName} is closed for ${holidayName || "a market holiday"}.`;
  }

  if (
    state ===
    "WEEKEND"
  ) {
    return `${exchangeName} is closed for the weekend.`;
  }

  if (
    state ===
    "UNKNOWN"
  ) {
    return `The current state of ${exchangeName} is unknown.`;
  }

  return `${exchangeName} is closed.`;
}

export function getMarketClock(
  exchange: MarketDataExchange,
  now =
    new Date()
): MarketClockResult {
  const definition =
    exchangeTradingSession(
      exchange
    );

  const parts =
    zonedParts(
      now,
      definition.timezone
    );

  const date =
    localDate(
      parts
    );

  const time =
    localTime(
      parts
    );

  const holiday =
    marketHoliday(
      exchange,
      date
    );

  const tradingWeekday =
    definition
      .tradingWeekdays
      .includes(
        parts.weekday
      );

  const isWeekend =
    !tradingWeekday;

  const isHoliday =
    Boolean(
      holiday?.closed
    );

  const isTradingDay =
    tradingWeekday &&
    !isHoliday;

  const seconds =
    currentSeconds(
      parts
    );

  const currentSession =
    isTradingDay
      ? definition.sessions.find(
          (
            session
          ) =>
            session.enabled &&
            sessionContains(
              session,
              seconds,
              holiday?.earlyCloseTime ||
              null
            )
        ) ||
        null
      : null;

  let state:
    MarketClockState;

  if (
    isHoliday
  ) {
    state =
      "HOLIDAY";
  } else if (
    isWeekend
  ) {
    state =
      "WEEKEND";
  } else {
    state =
      stateFromSession(
        currentSession
      );
  }

  const regularSessions =
    definition.sessions.filter(
      (
        session
      ) =>
        session.enabled &&
        session.type ===
        "REGULAR"
    );

  const firstRegular =
    regularSessions[
      0
    ] ||
    null;

  const lastRegular =
    regularSessions[
      regularSessions.length -
      1
    ] ||
    null;

  const regularOpenAt =
    isTradingDay &&
    firstRegular
      ? zonedLocalToUtc(
          parts.year,
          parts.month,
          parts.day,
          firstRegular.openTime,
          definition.timezone
        ).toISOString()
      : null;

  const closeTime =
    holiday?.earlyCloseTime ||
    lastRegular?.closeTime ||
    null;

  const regularCloseAt =
    isTradingDay &&
    closeTime
      ? zonedLocalToUtc(
          parts.year,
          parts.month,
          parts.day,
          closeTime,
          definition.timezone
        ).toISOString()
      : null;

  const nextOpen =
    state ===
      "OPEN"
      ? null
      : nextRegularOpen(
          exchange,
          now
        );

  const nextClose =
    state ===
      "OPEN"
      ? currentRegularClose(
          exchange,
          now
        )
      : null;

  return {
    exchange,
    exchangeName:
      definition.name,
    timezone:
      definition.timezone,

    state,
    tradingStatus:
      tradingStatusFromState(
        state
      ),

    localDate:
      date,
    localTime:
      time,
    localWeekday:
      parts.weekday,

    isTradingDay,
    isWeekend,
    isHoliday,
    isEarlyClose:
      Boolean(
        holiday?.earlyCloseTime
      ),

    currentSession,

    regularOpenAt,
    regularCloseAt,

    nextOpenAt:
      nextOpen
        ?.toISOString() ||
      null,

    nextCloseAt:
      nextClose
        ?.toISOString() ||
      null,

    secondsUntilOpen:
      nextOpen
        ? Math.max(
            0,
            Math.floor(
              (
                nextOpen.getTime() -
                now.getTime()
              ) /
              1_000
            )
          )
        : null,

    secondsUntilClose:
      nextClose
        ? Math.max(
            0,
            Math.floor(
              (
                nextClose.getTime() -
                now.getTime()
              ) /
              1_000
            )
          )
        : null,

    holidayName:
      holiday?.name ||
      null,

    message:
      resultMessage(
        state,
        definition.name,
        holiday?.name ||
        null
      ),
  };
}

export function isMarketOpen(
  exchange: MarketDataExchange,
  now =
    new Date()
): boolean {
  return (
    getMarketClock(
      exchange,
      now
    ).state ===
    "OPEN"
  );
}

export function nextMarketOpen(
  exchange: MarketDataExchange,
  now =
    new Date()
): string | null {
  return getMarketClock(
    exchange,
    now
  ).nextOpenAt;
}


export type CompatibilityMarketSessionSnapshot = {
  exchange: string | null;
  exchangeName: string;

  timezone: string;
  marketTimezone: string;

  nowUtc: string;
  nowLocal: string;
  observedAt: string;

  marketState:
    | "OPEN"
    | "CLOSED"
    | "PRE_MARKET"
    | "AFTER_HOURS"
    | "UNKNOWN";

  sessionType:
    | "PRE_MARKET"
    | "CONTINUOUS"
    | "AFTER_HOURS"
    | "CLOSED"
    | "UNKNOWN";

  marketOpen: boolean;
  marketClosed: boolean;
  continuous: boolean;

  isMarketOpen: boolean;
  tradingHalted: boolean;

  nextMarketOpenAt: string | null;
  nextMarketCloseAt: string | null;

  openAt: string | null;
  closeAt: string | null;

  message: string;

  holidays: unknown[];

  [key: string]: unknown;
};

export function createMarketSessionSnapshot(
  input:
    | string
    | null
    | undefined
    | {
        exchange?: string | null;
        now?: Date | string;
        holidays?: unknown[];
        tradingHalted?: boolean;
        [key: string]: unknown;
      },
  fallbackNow:
    Date |
    string =
      new Date()
): CompatibilityMarketSessionSnapshot {
  const structured =
    input &&
    typeof input === "object"
      ? input
      : null;

  const exchange =
    structured
      ? String(
          structured.exchange ||
          "UNKNOWN"
        )
      : String(
          input ||
          "UNKNOWN"
        );

  const requestedNow =
    structured?.now ??
    fallbackNow;

  const parsedNow =
    requestedNow instanceof Date
      ? requestedNow
      : new Date(
          requestedNow
        );

  const now =
    Number.isNaN(
      parsedNow.getTime()
    )
      ? new Date()
      : parsedNow;

  const tradingHalted =
    structured?.tradingHalted ===
    true;

  return {
    exchange,
    exchangeName:
      exchange,

    timezone:
      "UTC",

    marketTimezone:
      "UTC",

    nowUtc:
      now.toISOString(),

    nowLocal:
      now.toISOString(),

    observedAt:
      now.toISOString(),

    marketState:
      "UNKNOWN",

    sessionType:
      "UNKNOWN",

    marketOpen:
      false,

    marketClosed:
      true,

    continuous:
      false,

    isMarketOpen:
      false,

    tradingHalted,

    nextMarketOpenAt:
      null,

    nextMarketCloseAt:
      null,

    openAt:
      null,

    closeAt:
      null,

    message:
      tradingHalted
        ? "Trading is halted."
        : "Market-session status is unavailable.",

    holidays:
      Array.isArray(
        structured?.holidays
      )
        ? structured.holidays
        : [],
  };
}
