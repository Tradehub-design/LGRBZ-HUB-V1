import { AppShell } from "@/components/layout";
import { PageActionsMenu } from "@/components/layout/PageActionsMenu";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function TaxPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Financial year"
        title="Tax Centre"
        description="FY summaries for Sam, Tom and Kieren, including CGT, dividends, interest, franking and tax guide."
        actions={<PageActionsMenu />}
      />
      <div className="mt-6">
        <EmptyState title="Tax module pending" description="Tax calculations will be generated from verified transactions." />
      </div>
    </AppShell>
  );
}
