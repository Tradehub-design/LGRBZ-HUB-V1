"use client";

import { useMemo } from "react";
import { Activity, BarChart3, Coins, Shield, TrendingUp, Wallet } from "lucide-react";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import {
  PremiumRow,
  PremiumTable,
  PremiumTableBody,
  PremiumTableHead,
  PremiumTd,
  PremiumTh,
} from "@/components/workspace/premium-table";
import { StatusPill } from "@/components/workspace/status-pill";
import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { formatMoney, formatNumber, formatPercent } from "@/lib/portfolio-engine/format";
import {
  ProgressRow,
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function AnalyticsPage() {
  useSeedPortfolio();
  const data = useDashboardData();

  const transactionTypes = useMemo(() => {
    const map = new Map<string, number>();

    data.transactions.forEach((transaction) => {
      map.set(transaction.action, (map.get(transaction.action) ?? 0) + 1);
    });

    return [...map.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [data.transactions]);

  const monthlyActivity = useMemo(() => {
    const map = new Map<string, { buys: number; sells: number; dividends: number; deposits: number }>();

    data.transactions.forEach((transaction) => {
      const month = transaction.date.slice(0, 7);
      const current = map.get(month) ?? { buys: 0, sells: 0, dividends: 0, deposits: 0 };

      if (transaction.action === "Buy") current.buys += transaction.totalFeesIncludedAud;
      if (transaction.action === "Sell") current.sells += transaction.totalFeesIncludedAud;
      if (transaction.action === "Cash Dividend") current.dividends += transaction.totalFeesIncludedAud;
      if (transaction.action === "Cash Deposit") current.deposits += transaction.totalFeesIncludedAud;

      map.set(month, current);
    });

    return [...map.entries()]
      .map(([month, values]) => ({ month, ...values }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 12);
  }, [data.transactions]);

  const maxType = Math.max(...transactionTypes.map((item) => item.count), 1);
  const maxMonth = Math.max(...monthlyActivity.map((item) => item.buys + item.sells + item.dividends + item.deposits), 1);

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Analytics Engine"
        title="Analytics"
        description="Portfolio behaviour, activity and exposure analysis generated from the transaction engine."
        actions={
          <>
            <WorkspaceLink href="/performance-attribution">Attribution</WorkspaceLink>
            <WorkspaceLink href="/portfolio-health">Health</WorkspaceLink>
            <WorkspaceLink href="/reports">Reports</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-6">
        <PremiumStatCard icon={<Activity />} label="Transactions" value={String(data.transactions.length)} tone="blue" />
        <PremiumStatCard icon={<Wallet />} label="Open Holdings" value={String(data.openHoldings.length)} tone="purple" />
        <PremiumStatCard icon={<TrendingUp />} label="Total Return" value={formatMoney(data.totalReturnAud)} helper={formatPercent(data.totalReturnPercent)} tone="green" />
        <PremiumStatCard icon={<Coins />} label="Dividend Income" value={formatMoney(data.totalDividendsAud)} tone="green" />
        <PremiumStatCard icon={<BarChart3 />} label="Fees" value={formatMoney(data.enginePerformance.feesAud)} tone="amber" />
        <PremiumStatCard icon={<Shield />} label="Health" value={`${data.health.score}/100`} helper={data.health.rating} tone="blue" />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-3">
        <WorkspacePanel title="Transaction Mix">
          <div className="space-y-3">
            {transactionTypes.slice(0, 10).map((item) => (
              <ProgressRow
                key={item.label}
                label={item.label}
                value={`${formatNumber(item.count, 0)} records`}
                percent={(item.count / maxType) * 100}
              />
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Asset Class Exposure">
          <div className="space-y-3">
            {data.allocation.assetClass.map((item) => (
              <ProgressRow
                key={item.label}
                label={item.label}
                value={`${formatPercent(item.percent)} · ${formatMoney(item.value)}`}
                percent={item.percent}
              />
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Cash Flow Metrics">
          <div className="space-y-3">
            <ProgressRow label="Buy Value" value={formatMoney(data.enginePerformance.buyValueAud)} percent={70} tone="sky" />
            <ProgressRow label="Sell Value" value={formatMoney(data.enginePerformance.sellValueAud)} percent={40} tone="violet" />
            <ProgressRow label="Deposits" value={formatMoney(data.enginePerformance.depositsAud)} percent={65} tone="emerald" />
            <ProgressRow label="Withdrawals" value={formatMoney(data.enginePerformance.withdrawalsAud)} percent={25} tone="rose" />
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Risk Exposure">
          <div className="space-y-3">
            {data.allocation.risk.map((item) => (
              <ProgressRow
                key={item.label}
                label={item.label}
                value={`${formatPercent(item.percent)} · ${formatMoney(item.value)}`}
                percent={item.percent}
                tone={item.label.toLowerCase().includes("high") ? "rose" : "sky"}
              />
            ))}
          </div>
        </WorkspacePanel>
      </section>




      <WorkspacePanel title="Portfolio Replay">
        <PremiumTable>
          <PremiumTableHead>
            <tr>
              <PremiumTh>Date</PremiumTh>
              <PremiumTh align="right">Buys</PremiumTh>
              <PremiumTh align="right">Sells</PremiumTh>
              <PremiumTh align="right">Dividends</PremiumTh>
              <PremiumTh align="right">Fees</PremiumTh>
              <PremiumTh align="right">Net Activity</PremiumTh>
            </tr>
          </PremiumTableHead>

          <PremiumTableBody>
            {data.portfolioReplay.slice(0, 20).map((point) => (
              <PremiumRow key={point.date}>
                <PremiumTd strong>{point.date}</PremiumTd>
                <PremiumTd align="right">{formatMoney(point.buysAud, 2)}</PremiumTd>
                <PremiumTd align="right">{formatMoney(point.sellsAud, 2)}</PremiumTd>
                <PremiumTd align="right">{formatMoney(point.dividendsAud, 2)}</PremiumTd>
                <PremiumTd align="right">{formatMoney(point.feesAud, 2)}</PremiumTd>
                <PremiumTd align="right" strong>{formatMoney(point.netActivityAud, 2)}</PremiumTd>
              </PremiumRow>
            ))}
          </PremiumTableBody>
        </PremiumTable>
      </WorkspacePanel>


      <WorkspacePanel title="Return Metrics">
        <div className="grid gap-3 md:grid-cols-3">
          <PremiumStatCard icon={<TrendingUp />} label="Total Gain" value={formatMoney(data.returnMetrics.totalGainAud)} helper={formatPercent(data.returnMetrics.totalGainPercent)} tone="green" />
          <PremiumStatCard icon={<BarChart3 />} label="Unrealised Return" value={formatPercent(data.returnMetrics.unrealisedReturnPercent)} tone="blue" />
          <PremiumStatCard icon={<Coins />} label="Dividend Return" value={formatPercent(data.returnMetrics.dividendReturnPercent)} tone="green" />
        </div>

        <div className="mt-4 space-y-3">
          <ProgressRow label="Simple Return" value={formatPercent(data.returnMetrics.simpleReturnPercent)} percent={Math.min(Math.abs(data.returnMetrics.simpleReturnPercent), 100)} tone="emerald" />
          <ProgressRow label="Unrealised Return" value={formatPercent(data.returnMetrics.unrealisedReturnPercent)} percent={Math.min(Math.abs(data.returnMetrics.unrealisedReturnPercent), 100)} tone="sky" />
          <ProgressRow label="Dividend Return" value={formatPercent(data.returnMetrics.dividendReturnPercent)} percent={Math.min(Math.abs(data.returnMetrics.dividendReturnPercent), 100)} tone="violet" />
        </div>
      </WorkspacePanel>


      <WorkspacePanel title="Top Movers">
        <PremiumTable>
          <PremiumTableHead>
            <tr>
              <PremiumTh>Ticker</PremiumTh>
              <PremiumTh>Direction</PremiumTh>
              <PremiumTh align="right">Value</PremiumTh>
              <PremiumTh align="right">Change</PremiumTh>
              <PremiumTh align="right">Change %</PremiumTh>
            </tr>
          </PremiumTableHead>

          <PremiumTableBody>
            {data.topMovers.slice(0, 10).map((mover) => (
              <PremiumRow key={mover.ticker}>
                <PremiumTd strong>{mover.ticker}</PremiumTd>
                <PremiumTd>
                  <StatusPill tone={mover.direction === "up" ? "green" : mover.direction === "down" ? "rose" : "neutral"}>
                    {mover.direction}
                  </StatusPill>
                </PremiumTd>
                <PremiumTd align="right">{formatMoney(mover.valueAud)}</PremiumTd>
                <PremiumTd align="right" strong>{formatMoney(mover.changeAud)}</PremiumTd>
                <PremiumTd align="right">{formatPercent(mover.changePercent)}</PremiumTd>
              </PremiumRow>
            ))}
          </PremiumTableBody>
        </PremiumTable>
      </WorkspacePanel>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <WorkspacePanel title="Monthly Activity">
          <PremiumTable>
            <PremiumTableHead>
              <tr>
                <PremiumTh>Month</PremiumTh>
                <PremiumTh align="right">Buys</PremiumTh>
                <PremiumTh align="right">Sells</PremiumTh>
                <PremiumTh align="right">Dividends</PremiumTh>
                <PremiumTh align="right">Deposits</PremiumTh>
              </tr>
            </PremiumTableHead>

            <PremiumTableBody>
              {monthlyActivity.map((row) => (
                <PremiumRow key={row.month}>
                  <PremiumTd strong>{row.month}</PremiumTd>
                  <PremiumTd align="right">{formatMoney(row.buys)}</PremiumTd>
                  <PremiumTd align="right">{formatMoney(row.sells)}</PremiumTd>
                  <PremiumTd align="right">{formatMoney(row.dividends)}</PremiumTd>
                  <PremiumTd align="right">{formatMoney(row.deposits)}</PremiumTd>
                </PremiumRow>
              ))}
            </PremiumTableBody>
          </PremiumTable>
        </WorkspacePanel>

        <WorkspacePanel title="Activity Intensity">
          <div className="space-y-3">
            {monthlyActivity.map((row) => {
              const total = row.buys + row.sells + row.dividends + row.deposits;

              return (
                <div key={row.month} className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <StatusPill tone="purple">{row.month}</StatusPill>
                    <span className="text-sm font-semibold text-white">{formatMoney(total)}</span>
                  </div>
                  <ProgressRow label="Activity" value={formatPercent((total / maxMonth) * 100)} percent={(total / maxMonth) * 100} tone="violet" />
                </div>
              );
            })}
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}
