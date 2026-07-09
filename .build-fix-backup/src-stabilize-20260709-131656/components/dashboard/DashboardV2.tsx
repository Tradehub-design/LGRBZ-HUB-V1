"use client";

import BentoGrid from "./layout/BentoGrid";

import PortfolioOverviewWidget
from "./widgets/PortfolioOverviewWidget";

import PortfolioIntelligence
from "./PortfolioIntelligence";

import PortfolioTimeline
import MarketStatusBadge
import ProviderHealth
import LiveMarketFeed
import AIInsights
import AIForecast
import AICommandCentre
from "./PortfolioTimeline";

import KpiStrip
from "./widgets/KpiStrip";

export default function DashboardV2(){

return(

<div className="space-y-6">

<KpiStrip/>

<BentoGrid>

<div className="col-span-12 xl:col-span-8 row-span-2">

<PortfolioOverviewWidget/>

</div>

<div className="col-span-12 xl:col-span-4 row-span-2">

<PortfolioIntelligence/>

</div>

<div className="col-span-12 xl:col-span-7 row-span-3">

<div className="h-full rounded-2xl border bg-card p-6 h-full">

Charts

</div>

</div>

<div className="col-span-12 xl:col-span-5 row-span-3">

<MarketStatusBadge/>
<ProviderHealth/>
<LiveMarketFeed/>
<AIInsights/>
<AIForecast/>
<AICommandCentre/>
<PortfolioTimeline/>

</div>

</BentoGrid>

</div>

);

}
