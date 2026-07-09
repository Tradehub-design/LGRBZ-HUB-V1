"use client";

import { usePortfolio } from "@/hooks/usePortfolio";

export default function CashPositionCard(){

const { portfolio }=usePortfolio();

if(!portfolio){

return null;

}

const cash=

portfolio.cash;

return(

<div className="h-full rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="font-semibold">

Cash Position

</h2>

<div className="mt-4 text-4xl font-bold">

${cash.totalCash.toLocaleString()}

</div>

<div className="mt-6 space-y-2">

<div className="flex justify-between">

<span>Deposits</span>

<span>

${cash.totalDeposits.toLocaleString()}

</span>

</div>

<div className="flex justify-between">

<span>Withdrawals</span>

<span>

${cash.totalWithdrawals.toLocaleString()}

</span>

</div>

<div className="flex justify-between">

<span>Dividends</span>

<span>

${cash.totalDividends.toLocaleString()}

</span>

</div>

<div className="flex justify-between">

<span>Interest</span>

<span>

${cash.totalInterest.toLocaleString()}

</span>

</div>

</div>

</div>

);

}

