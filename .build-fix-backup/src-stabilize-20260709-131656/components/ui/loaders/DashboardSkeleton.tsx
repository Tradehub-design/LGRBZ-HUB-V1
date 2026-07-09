"use client";

export default function DashboardSkeleton(){

return(

<div className="grid grid-cols-4 gap-6">

{Array.from({

length:8

}).map((_,i)=>(

<div

key={i}

className="h-52 animate-pulse rounded-2xl bg-muted"

>

</div>

))}

</div>

);

}
