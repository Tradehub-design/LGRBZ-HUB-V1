"use client";

import { usePortfolioStore } from "@/store/portfolioStore";

export default function TransactionsTable(){

const {

transactions

}=usePortfolioStore();

return(

<div className="rounded-xl border bg-card overflow-hidden">

<div className="overflow-x-auto">

<table className="w-full">

<thead className="bg-muted">

<tr>

<th>Date</th>

<th>Action</th>

<th>Ticker</th>

<th>Qty</th>

<th>Price</th>

<th>Fees</th>

<th>Broker</th>

<th>Currency</th>

<th>Strategy</th>

<th>Notes</th>

</tr>

</thead>

<tbody>

{transactions.map(tx=>(

<tr

key={tx.id}

className="border-t hover:bg-muted/50"

>

<td>{tx.date}</td>

<td>{tx.action}</td>

<td>{tx.assetTicker}</td>

<td>{tx.quantity}</td>

<td>{tx.price}</td>

<td>{tx.fees}</td>

<td>{tx.platform}</td>

<td>{tx.currency}</td>

<td>{tx.strategy}</td>

<td>{tx.notes}</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

);

}

