import { AppShell } from "@/components/layout";
import { PageActionsMenu } from "@/components/layout/PageActionsMenu";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ForecastPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Planning"
        title="Forecast"
        description="Annual growth forecast, what-if scenarios, compound interest and dividend lifestyle planning."
        actions={<PageActionsMenu />}
      />
      <div className="mt-6">
        <EmptyState title="Forecast module pending" description="Forecasting will use verified portfolio history." />
      </div>
    </AppShell>
  );
}
