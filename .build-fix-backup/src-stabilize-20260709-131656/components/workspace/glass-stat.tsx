import type {ReactNode} from "react"

export function GlassStat({

title,
value,
icon

}:{

title:string
value:string
icon?:ReactNode

}){

return(

<div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">

<div className="flex items-center justify-between">

<p className="text-sm text-slate-400">
{title}
</p>

{icon}

</div>

<p className="mt-5 text-3xl font-bold text-white">
{value}
</p>

</div>

)

}
