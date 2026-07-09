"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot()";

export default function IncomeCalendar(){

const { portfolio }=useBusinessSnapshot()();

if(!portfolio)return null;

return(

<div className="rounded-xl border bg-card p-5">

<h2 className="mb-5 font-semibold">

Dividend Calendar

</h2>

<div className="space-y-3">

{portfolio.dividends.records.map(record=>(

<div

key={record.id}

className="flex justify-between rounded border p-3"

>

<div>

<strong>

{record.ticker}

</strong>

<div className="text-xs">

{record.paymentDate}

</div>

</div>

<div>

${record.amount.toFixed(2)}

</div>

</div>

))}

</div>

</div>

);

}
