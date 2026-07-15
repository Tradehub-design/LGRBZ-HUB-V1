"use client";

type Props={

label:string;

value:string;

colour?:
"blue"|
"green"|
"red"|
"yellow";

};

const colours={

blue:"text-sky-300",

green:"text-emerald-300",

red:"text-rose-300",

yellow:"text-amber-300"

};

export default function MetricChip({

label,

value,

colour="blue"

}:Props){

return(

<div
className="
rounded-xl
border
border-slate-800
bg-slate-900/60
px-4
py-3
min-w-[120px]
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
className={`
mt-1
text-lg
font-semibold
${colours[colour]}
`}
>

{value}

</div>

</div>

);

}
