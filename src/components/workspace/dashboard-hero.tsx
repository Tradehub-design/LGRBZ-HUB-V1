import { TrendingUp } from "lucide-react";
import { formatMoney, formatPercent } from "@/lib/portfolio-engine/format";

export function DashboardHero({
value,
returnAmount,
returnPercent
}:{

value:number
returnAmount:number
returnPercent:number

}){

return(

<div className="relative overflow-hidden rounded-[32px] border border-sky-500/20 bg-gradient-to-br from-sky-900 via-[#071827] to-[#071827] p-10">

<div className="absolute right-[-60px] top-[-60px] h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"/>

<p className="text-xs uppercase tracking-[0.25em] text-sky-300">
PORTFOLIO VALUE
</p>

<h1 className="mt-3 text-6xl font-bold tracking-tight text-white">
{formatMoney(value)}
</h1>

<div className="mt-6 inline-flex items-center gap-3 rounded-full bg-emerald-500/10 px-5 py-3">

<TrendingUp className="h-5 w-5 text-emerald-300"/>

<p className="font-semibold text-emerald-300">

{formatMoney(returnAmount)}
<span className="ml-2">
({formatPercent(returnPercent)})
</span>

</p>

</div>

</div>

)

}
