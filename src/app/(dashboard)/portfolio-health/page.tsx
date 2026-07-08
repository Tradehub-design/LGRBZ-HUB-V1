"use client";

import {calculateHealthScore} from "@/lib/portfolio-engine/healthScore";

import{
Workspace,
WorkspaceHeader,
WorkspacePanel,
WorkspaceGrid
}from "@/components/workspace";

import {PremiumStatCard} from "@/components/workspace/premium-stat-card";

export default function PortfolioHealth(){

const h=calculateHealthScore()

return(

<Workspace>

<WorkspaceHeader

eyebrow="Intelligence"

title="Portfolio Health"

description="Overall health of your investment portfolio."

/>

<WorkspaceGrid columns="xl:grid-cols-3">

<PremiumStatCard label="Health Score" value={String(h.score)} tone="green"/>

<PremiumStatCard label="Grade" value={h.grade} tone="blue"/>

<PremiumStatCard label="Diversification" value={String(h.diversification)} tone="purple"/>

</WorkspaceGrid>

<WorkspacePanel title="Health Breakdown">

<div className="space-y-4">

<p>Diversification {h.diversification}</p>

<p>Income {h.income}</p>

<p>Risk {h.risk}</p>

<p>Liquidity {h.liquidity}</p>

</div>

</WorkspacePanel>

</Workspace>

)

}
