"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot()";

export default function FutureIncome(){

const { portfolio }=useBusinessSnapshot()();

if(!portfolio)return null;

const yearly=

portfolio.dividends.forwardIncome;

return(

<div className="rounded-xl border bg-card p-5">

<h2 className="mb-4 font-semibold">

Projected Income

</h2>

<div className="space-y-3">

<div>

Yearly

<strong className="float-right">

${yearly.toFixed(2)}

</strong>

</div>

<div>

Monthly

<strong className="float-right">

${(yearly/12).toFixed(2)}

</strong>

</div>

<div>

Weekly

<strong className="float-right">

${(yearly/52).toFixed(2)}

</strong>

</div>

<div>

Daily

<strong className="float-right">

${(yearly/365).toFixed(2)}

</strong>

</div>

</div>

</div>

);

}
