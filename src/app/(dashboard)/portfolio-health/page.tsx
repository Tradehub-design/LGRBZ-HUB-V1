import { HealthActionsCard } from "@/features/portfolio-health/components/health-actions-card";
import { HealthChecksCard } from "@/features/portfolio-health/components/health-checks-card";
import { HealthScoreCard } from "@/features/portfolio-health/components/health-score-card";
import { ImprovementRecommendationsCard } from "@/features/portfolio-health/components/improvement-recommendations-card";
import { PortfolioDiversificationCard } from "@/features/portfolio-health/components/portfolio-diversification-card";
import { PortfolioHealthFooter } from "@/features/portfolio-health/components/portfolio-health-footer";
import { PortfolioHealthHeader } from "@/features/portfolio-health/components/portfolio-health-header";
import { PortfolioHealthSummary } from "@/features/portfolio-health/components/portfolio-health-summary";
import { RiskBreakdownCard } from "@/features/portfolio-health/components/risk-breakdown-card";

export default function PortfolioHealthPage() {
  return (
    <div className="space-y-6">
      <PortfolioHealthHeader />

      <PortfolioHealthSummary />

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <HealthScoreCard />
        <HealthChecksCard />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <RiskBreakdownCard />
        <PortfolioDiversificationCard />
        <ImprovementRecommendationsCard />
      </div>

      <HealthActionsCard />

      <PortfolioHealthFooter />
    </div>
  );
}
