"use client";

import { useState } from "react";

export default function ImportPreview(){

const [rows]=useState<any[]>([]);

return(

<div className="rounded-xl border bg-card">

<div className="border-b p-4">

<h2 className="font-semibold">

Import Preview

</h2>

</div>

<div className="max-h-[500px] overflow-auto">

<table className="w-full">

<thead>

<tr>

<th>Row</th>

<th>Date</th>

<th>Action</th>

<th>Ticker</th>

<th>Qty</th>

<th>Price</th>

<th>Status</th>

</tr>

</thead>

<tbody>

{rows.map((row,index)=>(

<tr key={index}>

<td>{index+1}</td>

<td>{row.date}</td>

<td>{row.action}</td>

<td>{row.ticker}</td>

<td>{row.quantity}</td>

<td>{row.price}</td>

<td>

Pending

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

);

}

