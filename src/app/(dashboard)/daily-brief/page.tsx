"use client";

import{
Workspace,
WorkspaceHeader,
WorkspacePanel
}from "@/components/workspace";

export default function DailyBrief(){

return(

<Workspace>

<WorkspaceHeader

eyebrow="AI"

title="Daily Brief"

description="Everything important about your portfolio today."

/>

<WorkspacePanel title="Today's Summary">

<ul className="space-y-4">

<li>Portfolio gained 0.84%</li>

<li>Technology was strongest sector.</li>

<li>Dividend expected this week.</li>

<li>No major concentration changes.</li>

<li>US CPI later tonight.</li>

<li>Portfolio health remains Grade A.</li>

</ul>

</WorkspacePanel>

</Workspace>

)

}
