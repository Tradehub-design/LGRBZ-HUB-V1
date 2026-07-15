import type {
  HoldingsVisualPosition,
  HoldingsVisualSnapshot,
} from "./holdingsVisualModels";

export type PositionIntelligenceTab =
  | "OVERVIEW"
  | "LOTS"
  | "ACTIVITY"
  | "DIVIDENDS"
  | "ANALYTICS"
  | "NOTES";

export type PositionIntelligenceHealthLevel =
  | "STRONG"
  | "HEALTHY"
  | "WATCH"
  | "HIGH_RISK";

export type PositionIntelligenceMetric = {
  key: string;
  label: string;
  value: string;
  detail?: string;

  tone:
    | "POSITIVE"
    | "NEGATIVE"
    | "NEUTRAL"
    | "INFORMATION";
};

export type PositionHealthIndicator = {
  key: string;
  label: string;

  score: number;
  value: string;
  description: string;

  level:
    PositionIntelligenceHealthLevel;
};

export type PositionIntelligenceSummary = {
  position:
    HoldingsVisualPosition;

  rank: number;
  holdingCount: number;

  currentPrice: number | null;
  averageCost: number | null;

  realisedGainLoss: number;
  unrealisedGainLoss: number;

  totalReturn: number;
  totalReturnPercent: number | null;

  yieldOnCost: number | null;
  incomeContribution: number;

  concentrationLevel:
    PositionIntelligenceHealthLevel;

  healthScore: number;
  healthLevel:
    PositionIntelligenceHealthLevel;

  metrics:
    PositionIntelligenceMetric[];

  healthIndicators:
    PositionHealthIndicator[];

  generatedSummary: string[];

  original:
    unknown;
};

export type PositionIntelligenceContextValue = {
  isOpen: boolean;

  selectedPosition:
    HoldingsVisualPosition |
    null;

  summary:
    PositionIntelligenceSummary |
    null;

  activeTab:
    PositionIntelligenceTab;

  openPosition:
    (
      position:
        HoldingsVisualPosition
    ) => void;

  closePosition: () => void;

  setActiveTab:
    (
      tab:
        PositionIntelligenceTab
    ) => void;
};

export type CreatePositionIntelligenceInput = {
  position:
    HoldingsVisualPosition;

  snapshot:
    HoldingsVisualSnapshot;
};
