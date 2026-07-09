"use client";

import CountUp from "react-countup";

import { usePortfolio } from "@/hooks/usePortfolio";

export default function AnimatedPortfolioValue(){

const {

portfolio,

snapshot,

replay

}=usePortfolio();

if(!portfolio){

return null;

}

const value=replay

?snapshot?.equity??0

:portfolio.performance

.allTime.marketValue+

portfolio.cash.totalCash;

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<div className="text-sm text-muted-foreground">

Portfolio Value

</div>

<div className="mt-4 text-5xl font-bold">

$

<CountUp

end={value}

duration={0.6}

separator=","

/>

</div>

</div>

);

}

