"use client";

import { Activity } from "lucide-react";
import { useMarketQuotes } from "@/hooks/useMarketQuotes";
import { buildMarketSummary } from "@/lib/market/summary";
import {
Workspace,
WorkspaceHeader,
WorkspacePanel,
WorkspaceGrid
} from "@/components/workspace";

import { PremiumStatCard } from "@/components/workspace/premium-stat-card";

export default function MarketWorkspace(){

const {quotes}=useMarketQuotes([
"VAS",
"VGS",
"IVV",
"NDQ",
"BTC"
]);

const summary = buildMarketSummary(quotes);

return(

<Workspace>

<WorkspaceHeader

eyebrow="Market"

title="Market Centre"

description="Live market pricing foundation."

/>

<WorkspaceGrid columns="xl:grid-cols-4">

<PremiumStatCard icon={<Activity/>} label="Quotes" value={String(summary.quoteCount)} tone="green" />
<PremiumStatCard label="Gainers" value={String(summary.gainers)} tone="green" />
<PremiumStatCard label="Losers" value={String(summary.losers)} tone="rose" />
<PremiumStatCard label="Average Change" value={`${summary.averageChangePercent}%`} tone="blue" />

</WorkspaceGrid>

<WorkspacePanel title="Market Prices">

<div className="space-y-3">

{quotes.map(q=>(

<div
key={q.symbol}
className="flex items-center justify-between rounded-xl border border-[#173047] bg-[#0b1e30] p-4"
>

<div>

<p className="font-semibold text-white">

{q.symbol}

</p>

<p className="text-xs text-slate-500">

{q.updatedAt}

</p>

</div>

<div className="text-right">

<p className="font-semibold text-white">

${q.price}

</p>

<p className="text-emerald-300">

{q.changePercent.toFixed(2)}%

</p>

</div>

</div>

))}

</div>

</WorkspacePanel>

</Workspace>

)

}
