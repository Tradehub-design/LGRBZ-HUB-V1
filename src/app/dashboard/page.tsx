import { AppShell } from "@/components/layout";
import { PageActionsMenu } from "@/components/layout/PageActionsMenu";
import { PageHeader } from "@/components/ui/PageHeader";
import { Metric } from "@/components/ui/Metric";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  BadgeDollarSign,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  CircleDollarSign,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Portfolio overview"
          title="Dashboard"
          description="Live portfolio summary, allocation, dividend income, risk exposure and performance overview."
          actions={<PageActionsMenu />}
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric
            label="Portfolio value"
            value="$0.00"
            change="Waiting for ledger"
            tone="neutral"
            icon={<CircleDollarSign className="h-5 w-5" />}
          />
          <Metric
            label="Total return"
            value="$0.00"
            change="+0.00%"
            tone="neutral"
            icon={<ChartNoAxesCombined className="h-5 w-5" />}
          />
          <Metric
            label="Dividends"
            value="$0.00"
            change="All time"
            tone="neutral"
            icon={<BadgeDollarSign className="h-5 w-5" />}
          />
          <Metric
            label="Holdings"
            value="0"
            change="Open positions"
            tone="neutral"
            icon={<BriefcaseBusiness className="h-5 w-5" />}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.45fr_0.9fr]">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Portfolio performance</CardTitle>
                <CardDescription>
                  This chart will connect to the portfolio engine in Module 2.
                </CardDescription>
              </div>
              <Badge tone="blue">AUD</Badge>
            </CardHeader>
            <CardContent>
              <EmptyState
                title="Portfolio engine not connected yet"
                description="The next module will read your master transaction ledger and power this dashboard automatically."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Allocation</CardTitle>
                <CardDescription>Asset class, sector, country, risk and currency split.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <EmptyState
                title="No allocation data yet"
                description="Allocation will appear once transactions are processed."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
