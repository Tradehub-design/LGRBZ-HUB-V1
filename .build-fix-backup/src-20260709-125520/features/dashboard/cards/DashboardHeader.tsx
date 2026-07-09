"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { PageActionsMenu } from "@/components/layout/PageActionsMenu";

export function DashboardHeader() {
  return (
    <PageHeader
      eyebrow="Portfolio"
      title="Dashboard"
      description="Live portfolio generated automatically from your master transaction ledger."
      actions={
        <PageActionsMenu />
      }
    />
  );
}
