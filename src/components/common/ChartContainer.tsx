"use client";

import { ReactNode } from "react";

type Props={
title:string;
subtitle?:string;
children:ReactNode;
actions?:ReactNode;
};

export default function ChartContainer({
title,
subtitle,
children,
actions
}:Props){

return(

<section
className="
rounded-2xl
border
border-slate-800
bg-slate-950/35
backdrop-blur-xl
overflow-hidden
shadow-[0_20px_60px_rgba(0,0,0,.28)]
transition-all
duration-300
hover:border-slate-700
"
>

<div
className="
flex
items-start
justify-between
gap-4
border-b
border-slate-800
px-6
py-5
"
>

<div>

<h2
className="
text-lg
font-semibold
text-white
"
>
{title}
</h2>

{subtitle&&(

<p
className="
mt-1
text-sm
text-slate-400
"
>

{subtitle}

</p>

)}

</div>

{actions}

</div>

<div
className="
p-5
"
>

{children}

</div>

</section>

);

}
