"use client";

export function HealthRing({

score

}:{

score:number

}){

const angle=(score/100)*360

return(

<div className="flex justify-center">

<div
className="flex h-48 w-48 items-center justify-center rounded-full"
style={{
background:`conic-gradient(#1f8cff ${angle}deg,#17263a ${angle}deg)`
}}
>

<div className="flex h-36 w-36 items-center justify-center rounded-full bg-[#071827]">

<div>

<p className="text-center text-5xl font-bold text-white">
{score}
</p>

<p className="mt-1 text-center text-xs uppercase tracking-[0.18em] text-slate-500">
Health
</p>

</div>

</div>

</div>

</div>

)

}
