"use client";

import {Download} from "lucide-react"

import{
Workspace,
WorkspaceHeader,
WorkspacePanel,
WorkspaceLink
}from "@/components/workspace"

export default function AccountantExport(){

return(

<Workspace>

<WorkspaceHeader

eyebrow="Tax Centre"

title="Accountant Export"

description="Generate accountant-ready tax exports."

actions={

<WorkspaceLink href="/tax-report">

Tax Report

</WorkspaceLink>

}

/>

<WorkspacePanel title="Export">

<div className="space-y-4">

<button className="rounded-xl bg-sky-600 px-5 py-3 text-white flex items-center gap-2">

<Download size={18}/>

Generate Accountant Package

</button>

<p className="text-sm text-slate-400">

CSV, PDF and supporting schedules will be generated here.

</p>

</div>

</WorkspacePanel>

</Workspace>

)

}
