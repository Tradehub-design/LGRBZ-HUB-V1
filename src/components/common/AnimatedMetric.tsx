"use client";

import useAnimatedNumber
from "@/hooks/useAnimatedNumber";

type Props={

label:string;

value:number;

suffix?:string;

};

export default function AnimatedMetric({

label,

value,

suffix=""

}:Props){

const animated=

useAnimatedNumber(value);

return(

<div
className="
rounded-xl
border
border-slate-800
bg-slate-900/60
p-4
"
>

<div
className="
text-[10px]
uppercase
tracking-widest
text-slate-500
"
>

{label}

</div>

<div
className="
mt-2
text-2xl
font-bold
text-white
"
>

{animated.toFixed(1)}

{suffix}

</div>

</div>

);

}
