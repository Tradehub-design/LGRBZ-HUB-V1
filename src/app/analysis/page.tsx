import { AppShell } from "@/components/layout";
import { PageActionsMenu } from "@/components/layout/PageActionsMenu";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AnalysisPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Insights"
        title="Analysis"
        description="Performance attribution, sector exposure, risk, currency, asset class and member contribution analysis."
        actions={<PageActionsMenu />}
      />
      <div className="mt-6">
        <EmptyState title="Analysis module pending" description="This page will activate after the portfolio engine." />
      </div>
    </AppShell>
  );
}
