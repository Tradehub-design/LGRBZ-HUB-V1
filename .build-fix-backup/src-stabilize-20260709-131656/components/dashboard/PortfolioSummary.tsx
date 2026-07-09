"use client";

import { useBusinessSnapshot } from "@/core/business/hooks/useBusinessSnapshot";

import PortfolioKPICard from "./PortfolioKPICard";

export default function PortfolioSummary(){

const {

portfolio,

replay

}=usePortfolio();

if(!portfolio){

return null;

}

const dashboard=

portfolio.dashboard;

return(

<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

<PortfolioKPICard

title="Portfolio Value"

value={`$${dashboard.portfolioValue.toLocaleString()}`}

/>

<PortfolioKPICard

title="Profit"

value={`$${dashboard.totalProfit.toLocaleString()}`}

subtitle={`${dashboard.totalProfitPercent.toFixed(2)}%`}

/>

<PortfolioKPICard

title="Cash"

value={`$${dashboard.availableCash.toLocaleString()}`}

/>

<PortfolioKPICard

title="Open Positions"

value={dashboard.openPositions.toString()}

subtitle={

replay

?"Replay Mode"

:"Live Portfolio"

}

/>

</div>

);

}

