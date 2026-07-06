import { AccountGrowthCard } from "@/features/business-model/components/account-growth-card";
import { BusinessModelFooter } from "@/features/business-model/components/business-model-footer";
import { BusinessModelHeader } from "@/features/business-model/components/business-model-header";
import { RiskCalculatorCard } from "@/features/business-model/components/risk-calculator-card";
import { RiskProfileTable } from "@/features/business-model/components/risk-profile-table";
import { RiskSummaryCards } from "@/features/business-model/components/risk-summary-cards";

export default function BusinessModelPage() {
  return (
    <div className="space-y-6">
      <BusinessModelHeader />

      <RiskSummaryCards />

      <div className="grid gap-6 xl:grid-cols-2">
        <RiskProfileTable />
        <RiskCalculatorCard />
      </div>

      <AccountGrowthCard />

      <BusinessModelFooter />
    </div>
  );
}
