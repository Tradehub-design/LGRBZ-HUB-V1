"use client";

type Props = {
  score:number
  title:string
  subtitle?:string
}

export function PortfolioScore({
  score,
  title,
  subtitle
}:Props){

const colour =
score>=80
?"text-emerald-400"
:score>=60
?"text-amber-400"
:"text-rose-400"

return(

<div className="rounded-2xl border border-[#173047] bg-[#071827] p-6">

<p className="text-xs uppercase tracking-[0.18em] text-slate-500">
{title}
</p>

<div className="mt-5 flex justify-center">

<div className="relative flex h-44 w-44 items-center justify-center rounded-full border-[14px] border-slate-800">

<div
className={`text-5xl font-bold ${colour}`}
>
{score}
</div>

</div>

</div>

{subtitle&&(
<p className="mt-5 text-center text-sm text-slate-400">
{subtitle}
</p>
)}

</div>

)

}
