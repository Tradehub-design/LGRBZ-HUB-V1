"use client";

import{
Workspace,
WorkspaceHeader,
WorkspacePanel
}from "@/components/workspace";

const events=[

"First Investment",

"First Dividend",

"Reached $10,000",

"Reached $25,000",

"Highest Portfolio Value",

"Largest Drawdown",

"Reached FIRE 10%",

"Reached FIRE 20%",

];

export default function Timeline(){

return(

<Workspace>

<WorkspaceHeader

eyebrow="Journey"

title="Portfolio Timeline"

description="Your complete investing journey."

/>

<WorkspacePanel title="Timeline">

<div className="space-y-4">

{events.map(e=>(

<div
key={e}
className="rounded-xl border border-[#173047] bg-[#0b1e30] p-4"
>

{e}

</div>

))}

</div>

</WorkspacePanel>

</Workspace>

)

}
