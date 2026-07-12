"use client";

export default function HoldingsTable({
rows
}:{rows:any[]}){

return(

<div className="overflow-x-auto rounded-xl border bg-white">

<table className="min-w-full text-sm">

<thead>

<tr className="border-b bg-slate-50">

<th className="p-3 text-left">Code</th>
<th className="p-3 text-left">Company</th>
<th className="p-3 text-right">Units</th>
<th className="p-3 text-right">Cost</th>
<th className="p-3 text-right">Value</th>

</tr>

</thead>

<tbody>

{rows.map(r=>(

<tr
key={r.symbol}
className="border-b hover:bg-slate-50">

<td className="p-3 font-semibold">
{r.symbol}
</td>

<td className="p-3">
{r.name}
</td>

<td className="p-3 text-right">
{r.quantity}
</td>

<td className="p-3 text-right">
${Number(r.costBase||0).toLocaleString()}
</td>

<td className="p-3 text-right font-semibold">
${Number(r.marketValue||0).toLocaleString()}
</td>

</tr>

))}

</tbody>

</table>

</div>

);

}
