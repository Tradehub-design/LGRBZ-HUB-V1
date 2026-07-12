import type {
  DividendEligibility,
  DividendEvent,
  DividendEventStatus,
  DividendHolding,
  DividendIntelligenceResponse,
  DividendTransaction,
} from "@/lib/dividend-data";

export type DividendCentreFilter =
  | "ALL"
  | DividendEventStatus;

export type DividendCalendarMarkerType =
  | "EX_DATE"
  | "RECORD_DATE"
  | "PAYMENT_DATE"
  | "DECLARATION_DATE";

export type DividendCalendarMarker = {
  id: string;
  date: string;
  symbol: string;
  label: string;
  markerType: DividendCalendarMarkerType;
  status: DividendEventStatus;
  amount: number | null;
  currency: string;
  confidence: string;
};

export type DividendCentreSourceInput = {
  holdings?: DividendHolding[];
  transactions?: DividendTransaction[];
  dividendData?: DividendIntelligenceResponse | null;
  loading?: boolean;
  error?: string | null;
  refreshing?: boolean;
  onRefresh?: () => void;
  baseCurrency?: string;
};

export type DividendTimelineRow = {
  id: string;
  symbol: string;
  displaySymbol: string;
  date: string | null;
  exDate: string | null;
  paymentDate: string | null;
  amount: number | null;
  dividendPerShare: number | null;
  eligibleQuantity: number;
  currency: string;
  status: DividendEventStatus;
  confidence: string;
  frankingCredit: number;
};

export type DividendReconciliationSummary = {
  announcedAmount: number;
  forecastAmount: number;
  receivedAmount: number;
  outstandingAmount: number;
  matchedEventCount: number;
  unmatchedReceivedCount: number;
};

export type DividendCentreResolvedData = {
  events: DividendEvent[];
  eligibility: DividendEligibility[];
  filteredEvents: DividendEvent[];
  timeline: DividendTimelineRow[];
  calendarMarkers: DividendCalendarMarker[];
  reconciliation: DividendReconciliationSummary;
};
