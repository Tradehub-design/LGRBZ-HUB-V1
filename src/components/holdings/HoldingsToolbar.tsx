"use client";

interface Props{
search:string;
onSearch(v:string):void;
}

export default function HoldingsToolbar({
search,
onSearch
}:Props){

return(

<div className="flex flex-wrap gap-3">

<input
value={search}
onChange={e=>onSearch(e.target.value)}
placeholder="Search holdings..."
className="w-full rounded-xl border p-3 md:max-w-md"
/>

<button
className="rounded-xl border px-4 py-2">
Export CSV
</button>

<button
className="rounded-xl border px-4 py-2">
Filters
</button>

</div>

);

}
