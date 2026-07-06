import { AppShell } from "@/components/layout";
import { PageActionsMenu } from "@/components/layout/PageActionsMenu";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function SettingsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Control centre"
        title="Settings"
        description="Theme, currency, mobile experience, offline queue, biometrics, layout and user preferences."
        actions={<PageActionsMenu />}
      />
      <div className="mt-6">
        <EmptyState title="Settings module pending" description="Full settings controls will be added soon." />
      </div>
    </AppShell>
  );
}
