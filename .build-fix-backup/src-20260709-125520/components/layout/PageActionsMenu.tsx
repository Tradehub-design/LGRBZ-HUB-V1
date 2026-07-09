"use client";

import { Download, FileText, MoreHorizontal, Printer, RefreshCw, Share2 } from "lucide-react";
import { Dropdown } from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/Button";

type PageActionsMenuProps = {
  onRefresh?: () => void;
  onExportSummary?: () => void;
  onExportDetailed?: () => void;
  onPrint?: () => void;
  onShare?: () => void;
};

export function PageActionsMenu({
  onRefresh,
  onExportSummary,
  onExportDetailed,
  onPrint,
  onShare,
}: PageActionsMenuProps) {
  return (
    <Dropdown
      trigger={
        <Button variant="secondary" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      }
      items={[
        {
          label: "Refresh page",
          icon: <RefreshCw className="h-4 w-4" />,
          onClick: onRefresh ?? (() => window.location.reload()),
        },
        {
          label: "Export summary PDF",
          icon: <FileText className="h-4 w-4" />,
          onClick: onExportSummary ?? (() => undefined),
        },
        {
          label: "Export detailed PDF",
          icon: <Download className="h-4 w-4" />,
          onClick: onExportDetailed ?? (() => undefined),
        },
        {
          label: "Print page",
          icon: <Printer className="h-4 w-4" />,
          onClick: onPrint ?? (() => window.print()),
        },
        {
          label: "Share",
          icon: <Share2 className="h-4 w-4" />,
          onClick:
            onShare ??
            (() => {
              if (navigator.share) {
                navigator.share({
                  title: "LGRBZ",
                  url: window.location.href,
                });
              }
            }),
        },
      ]}
    />
  );
}
