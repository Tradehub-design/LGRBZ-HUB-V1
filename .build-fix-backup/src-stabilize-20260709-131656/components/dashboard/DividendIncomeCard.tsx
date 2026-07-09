"use client";

import { usePortfolio } from "@/hooks/usePortfolio";

export default function DividendIncomeCard(){

const { portfolio }=usePortfolio();

if(!portfolio){

return null;

}

const d=portfolio.dividends;

return(

<div className="h-full rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<div className="text-sm text-muted-foreground">

Dividend Income

</div>

<div className="mt-3 text-3xl font-bold">

${d.yearly.toLocaleString()}

</div>

<div className="mt-3 space-y-2">

<div className="flex justify-between">

<span>Monthly</span>

<span>

${d.monthly.toFixed(2)}

</span>

</div>

<div className="flex justify-between">

<span>Forward</span>

<span>

${d.forwardIncome.toFixed(2)}

</span>

</div>

<div className="flex justify-between">

<span>Total Received</span>

<span>

${d.total.toFixed(2)}

</span>

</div>

</div>

</div>

);

}

