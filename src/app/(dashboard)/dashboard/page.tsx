"use client";

import Link from "next/link";
import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { formatMoney, formatNumber, formatPercent } from "@/lib/portfolio-engine/format";
import {
  MetricTile,
  ProgressRow,
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";
import { useDashboardData } from "@/features/dashboard/useDashboardData";

export default function DashboardPage() {
  useSeedPortfolio();

  const data = useDashboardData();

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Portfolio Command Centre"
        title="Dashboard"
        description="Executive summary powered by your transaction ledger. Detailed tools live in the dedicated workspaces."
        actions={
          <>
            <WorkspaceLink href="/transactions">Transactions</WorkspaceLink>
            <WorkspaceLink href="/holdings">Holdings</WorkspaceLink>
            <WorkspaceLink href="/analytics">Analytics</WorkspaceLink>
            <WorkspaceLink href="/reports">Reports</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-6">
        <MetricTile label="Total Value" value={formatMoney(data.totalValueAud)} helper="Cost basis + cash" />
        <MetricTile label="Daily G/L" value="$0" helper="Live prices in v2.0" />
        <MetricTile label="Cash Available" value={formatMoney(data.totalCashAud)} helper="Across cash accounts" />
        <MetricTile label="Dividends" value={formatMoney(data.totalDividendsAud)} helper="Received income" />
        <MetricTile label="Health Score" value={`${data.health.score}/100`} helper={data.health.rating} />
        <MetricTile label="Risk Score" value={`${data.risk.riskScore}/100`} helper={data.risk.concentrationLevel} />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <WorkspacePanel
          title="Portfolio Summary"
          action={<Link href="/holdings" className="text-xs text-sky-300">View holdings</Link>}
        >
          <div className="grid gap-3 md:grid-cols-3">
            <MiniStat label="Invested Cost" value={formatMoney(data.totalCostAud)} />
            <MiniStat label="Realised P/L" value={formatMoney(data.realisedPlAud)} />
            <MiniStat label="Total Return" value={formatMoney(data.totalReturnAud)} />
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-[#173047]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b1e30] text-slate-400">
                <tr>
                  <th className="px-3 py-3">Holding</th>
                  <th className="px-3 py-3">Platform</th>
                  <th className="px-3 py-3 text-right">Qty</th>
                  <th className="px-3 py-3 text-right">Cost</th>
                  <th className="px-3 py-3 text-right">Weight</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {data.topHoldings.slice(0, 6).map((holding) => (
                  <tr key={holding.id} className="hover:bg-slate-800/40">
                    <td className="px-3 py-3 font-semibold text-white">{holding.ticker}</td>
                    <td className="px-3 py-3 text-slate-400">{holding.platform}</td>
                    <td className="px-3 py-3 text-right text-slate-300">{formatNumber(holding.quantity)}</td>
                    <td className="px-3 py-3 text-right text-white">{formatMoney(holding.totalCostAud)}</td>
                    <td className="px-3 py-3 text-right text-sky-300">{formatPercent(holding.weightPercent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </WorkspacePanel>

        <WorkspacePanel
          title="Asset Allocation"
          action={<Link href="/portfolio-allocation" className="text-xs text-sky-300">Details</Link>}
        >
          <div className="space-y-3">
            {data.allocation.assetClass.slice(0, 6).map((item) => (
              <ProgressRow
                key={item.label}
                label={item.label}
                value={`${formatPercent(item.percent)} · ${formatMoney(item.value)}`}
                percent={item.percent}
              />
            ))}

            {data.allocation.assetClass.length === 0 ? (
              <p className="text-sm text-slate-500">No allocation data loaded yet.</p>
            ) : null}
          </div>
        </WorkspacePanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <WorkspacePanel title="Recent Transactions" action={<Link href="/transactions" className="text-xs text-sky-300">Open ledger</Link>}>
          <div className="space-y-3">
            {data.recentTransactions.slice(0, 6).map((tx) => (
              <ActivityRow key={tx.id} title={`${tx.action} · ${tx.assetTicker}`} meta={tx.date} value={formatMoney(tx.totalFeesIncludedAud)} />
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Dividend Summary" action={<Link href="/dividends" className="text-xs text-sky-300">View dividends</Link>}>
          <div className="space-y-3">
            {data.latestDividends.slice(0, 6).map((dividend) => (
              <ActivityRow key={dividend.id} title={dividend.ticker} meta={dividend.date} value={formatMoney(dividend.amountAud)} />
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Portfolio Health">
          <div className="space-y-3">
            <ProgressRow label="Health Score" value={`${data.health.score}/100`} percent={data.health.score} tone="emerald" />
            <ProgressRow label="Risk Score" value={`${data.risk.riskScore}/100`} percent={data.risk.riskScore} tone="amber" />
            <ProgressRow label="High Risk Exposure" value={formatPercent(data.risk.highRiskPercent)} percent={data.risk.highRiskPercent} tone="rose" />
            <ProgressRow label="Cash Weight" value={formatPercent(data.risk.cashPercent)} percent={data.risk.cashPercent} tone="sky" />
          </div>
        </WorkspacePanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <WorkspacePanel title="Alerts & Notifications">
          <div className="space-y-3">
            <Alert tone="green" title="Transaction engine active" />
            <Alert tone="blue" title={`${data.transactions.length} transactions loaded`} />
            <Alert tone="amber" title="Live prices not connected yet" />
            <Alert tone="slate" title="Broker sync planned for v2.0" />
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Quick Actions">
          <div className="grid gap-3 sm:grid-cols-4">
            <Action href="/transactions" label="Update Ledger" />
            <Action href="/portfolio-health" label="Health Check" />
            <Action href="/dividend-forecast" label="Forecast Income" />
            <Action href="/tax" label="Tax Centre" />
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function ActivityRow({ title, meta, value }: { title: string; meta: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3 last:border-0 last:pb-0">
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-slate-500">{meta}</p>
      </div>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function Alert({ title, tone }: { title: string; tone: "green" | "blue" | "amber" | "slate" }) {
  const tones = {
    green: "bg-emerald-500/10 text-emerald-300",
    blue: "bg-sky-500/10 text-sky-300",
    amber: "bg-amber-500/10 text-amber-300",
    slate: "bg-slate-500/10 text-slate-300",
  };

  return <div className={`rounded-lg px-3 py-2 text-sm ${tones[tone]}`}>{title}</div>;
}

function Action({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="rounded-lg border border-[#173047] bg-[#0b1e30] px-4 py-3 text-center text-sm font-semibold text-slate-200 hover:border-sky-500 hover:text-white">
      {label}
    </Link>
  );
}
