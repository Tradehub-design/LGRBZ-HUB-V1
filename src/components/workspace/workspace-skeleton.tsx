export function WorkspaceSkeleton(){

return(

<div className="space-y-5 animate-pulse">

<div className="h-10 w-72 rounded-xl bg-slate-800"/>

<div className="grid gap-4 md:grid-cols-4">

{Array.from({length:4}).map((_,i)=>(

<div
key={i}
className="h-40 rounded-3xl bg-slate-800"
/>

))}

</div>

<div className="h-[420px] rounded-3xl bg-slate-800"/>

</div>

)

}
