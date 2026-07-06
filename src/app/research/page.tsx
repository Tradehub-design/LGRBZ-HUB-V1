import { AppShell } from "@/components/layout";
import { PageActionsMenu } from "@/components/layout/PageActionsMenu";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ResearchPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Watchlist + research"
        title="Research"
        description="Watchlist, company research, company detail, AI compare, valuation metrics and buy/hold/sell summary."
        actions={<PageActionsMenu />}
      />
      <div className="mt-6">
        <EmptyState title="Research module pending" description="Search and watchlist tools will be added after the portfolio core." />
      </div>
    </AppShell>
  );
}
