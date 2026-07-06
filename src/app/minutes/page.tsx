import { AppShell } from "@/components/layout";
import { PageActionsMenu } from "@/components/layout/PageActionsMenu";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function MinutesPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Meetings"
        title="Minutes"
        description="Meeting notes, default attendees, decisions, action items and AI transcript uploads."
        actions={<PageActionsMenu />}
      />
      <div className="mt-6">
        <EmptyState title="Minutes module pending" description="Meeting templates and transcripts will be added later." />
      </div>
    </AppShell>
  );
}
