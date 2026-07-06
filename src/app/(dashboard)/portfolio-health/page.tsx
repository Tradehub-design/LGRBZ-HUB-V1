import { HealthChecksCard } from "@/features/portfolio-health/components/health-checks-card";
import { HealthScoreCard } from "@/features/portfolio-health/components/health-score-card";
import { PortfolioHealthHeader } from "@/features/portfolio-health/components/portfolio-health-header";
import { PortfolioHealthSummary } from "@/features/portfolio-health/components/portfolio-health-summary";

export default function PortfolioHealthPage() {
  return (
    <div className="space-y-6">
      <PortfolioHealthHeader />
      <PortfolioHealthSummary />

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <HealthScoreCard />
        <HealthChecksCard />
      </div>
    </div>
  );
}
