import { AppShell } from "@/components/layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { ImportDropzone } from "@/features/import/ImportDropzone";

export default function ImportPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Data"
          title="Import Centre"
          description="Upload your Master Transaction Ledger. All portfolio pages update automatically."
        />

        <ImportDropzone />
      </div>
    </AppShell>
  );
}
