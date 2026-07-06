import { AppShell } from "@/components/layout";
import { PageActionsMenu } from "@/components/layout/PageActionsMenu";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CalendarPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Timeline"
        title="Calendar"
        description="Monthly, weekly, daily and yearly view of purchases, sales, dividends, reports and portfolio replay."
        actions={<PageActionsMenu />}
      />
      <div className="mt-6">
        <EmptyState title="Calendar module pending" description="Portfolio replay will be connected after the ledger engine." />
      </div>
    </AppShell>
  );
}
