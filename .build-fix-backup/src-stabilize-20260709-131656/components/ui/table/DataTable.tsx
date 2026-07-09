"use client";

export default function DataTable({

headers,

rows

}:{

headers:string[];

rows:React.ReactNode[][];

}){

return(

<div className="overflow-hidden rounded-2xl border">

<table className="w-full">

<thead className="sticky top-0 bg-muted">

<tr>

{headers.map(h=>(

<th

key={h}

className="px-5 py-4 text-left"

>

{h}

</th>

))}

</tr>

</thead>

<tbody>

{rows.map((row,i)=>(

<tr

key={i}

className="border-t"

>

{row.map((cell,j)=>(

<td

key={j}

className="px-5 py-4"

>

{cell}

</td>

))}

</tr>

))}

</tbody>

</table>

</div>

);

}

