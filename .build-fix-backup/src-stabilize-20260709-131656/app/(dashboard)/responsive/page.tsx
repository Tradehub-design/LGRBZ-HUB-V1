import { MobileLayoutCard } from "@/features/responsive/components/mobile-layout-card";
import { NavigationOptimisationCard } from "@/features/responsive/components/navigation-optimisation-card";
import { ResponsiveActionsCard } from "@/features/responsive/components/responsive-actions-card";
import { ResponsiveCheckTable } from "@/features/responsive/components/responsive-check-table";
import { ResponsiveFooter } from "@/features/responsive/components/responsive-footer";
import { ResponsiveHeader } from "@/features/responsive/components/responsive-header";
import { ResponsiveSummaryCards } from "@/features/responsive/components/responsive-summary-cards";
import { TableOptimisationCard } from "@/features/responsive/components/table-optimisation-card";
import { TouchTargetCard } from "@/features/responsive/components/touch-target-card";

export default function ResponsivePage() {
  return (
    <div className="space-y-6">
      <ResponsiveHeader />
      <ResponsiveSummaryCards />

      <div className="grid gap-6 xl:grid-cols-3">
        <MobileLayoutCard />
        <TableOptimisationCard />
        <NavigationOptimisationCard />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <TouchTargetCard />
        <ResponsiveActionsCard />
      </div>

      <ResponsiveCheckTable />
      <ResponsiveFooter />
    </div>
  );
}