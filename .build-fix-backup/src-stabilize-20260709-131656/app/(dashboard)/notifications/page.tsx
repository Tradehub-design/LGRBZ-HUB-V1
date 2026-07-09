"use client";

import {
Workspace,
WorkspaceHeader,
WorkspacePanel
} from "@/components/workspace";

import {notifications} from "@/lib/notifications/notifications";

export default function Notifications(){

return(

<Workspace>

<WorkspaceHeader

eyebrow="Productivity"

title="Notification Centre"

description="Upcoming portfolio events."

/>

<WorkspacePanel title="Notifications">

<div className="space-y-4">

{notifications.map(n=>(

<div
key={n.id}
className="rounded-xl border border-[#173047] bg-[#0b1e30] p-4"
>

<p className="font-semibold text-white">

{n.title}

</p>

<p className="text-xs text-slate-500">

{n.type}

</p>

</div>

))}

</div>

</WorkspacePanel>

</Workspace>

)

}
