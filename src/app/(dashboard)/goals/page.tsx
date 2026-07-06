import { GoalsActionsCard } from "@/features/goals/components/goals-actions-card";
import { GoalsContributionCard } from "@/features/goals/components/goals-contribution-card";
import { GoalsFooterSummary } from "@/features/goals/components/goals-footer-summary";
import { GoalsHeader } from "@/features/goals/components/goals-header";
import { GoalsList } from "@/features/goals/components/goals-list";
import { GoalsPriorityCard } from "@/features/goals/components/goals-priority-card";
import { GoalsProjectionTable } from "@/features/goals/components/goals-projection-table";
import { GoalsStatusCard } from "@/features/goals/components/goals-status-card";
import { GoalsSummaryCards } from "@/features/goals/components/goals-summary-cards";

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <GoalsHeader />
      <GoalsSummaryCards />
      <GoalsList />

      <div className="grid gap-6 xl:grid-cols-3">
        <GoalsPriorityCard />
        <GoalsContributionCard />
        <GoalsStatusCard />
      </div>

      <GoalsActionsCard />
      <GoalsProjectionTable />
      <GoalsFooterSummary />
    </div>
  );
}
