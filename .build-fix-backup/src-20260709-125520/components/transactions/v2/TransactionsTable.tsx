"use client";

import { usePortfolio } from "@/hooks/usePortfolio";

export default function TransactionsTable(){

const { portfolio }=usePortfolio();

if(!portfolio)return null;

return(

<div className="rounded-2xl border bg-card shadow-sm overflow-hidden">

<div className="overflow-x-auto">

<table className="w-full">

<thead className="bg-muted">

<tr>

<th className="px-6 py-4 text-left">

Date

</th>

<th className="px-6 py-4 text-left">

Ticker

</th>

<th className="px-6 py-4">

Action

</th>

<th className="px-6 py-4 text-right">

Qty

</th>

<th className="px-6 py-4 text-right">

Price

</th>

<th className="px-6 py-4 text-right">

Fees

</th>

</tr>

</thead>

<tbody>

{portfolio.transactions.map(tx=>(

<tr

key={tx.id}

className="border-t hover:bg-muted/30"

>

<td className="px-6 py-4">

{tx.date}

</td>

<td className="px-6 py-4">

{tx.ticker}

</td>

<td className="px-6 py-4">

{tx.action}

</td>

<td className="px-6 py-4 text-right">

{tx.quantity}

</td>

<td className="px-6 py-4 text-right">

${tx.price}

</td>

<td className="px-6 py-4 text-right">

${tx.fees}

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

);

}
