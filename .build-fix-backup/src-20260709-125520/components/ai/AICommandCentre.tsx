"use client";

import {

useAIWorkspaceStore

} from "@/store/ai/workspaceStore";

export default function AICommandCentre(){

const {

workspace

}=useAIWorkspaceStore();

if(!workspace){

return null;

}

return(

<div className="rounded-2xl border bg-card p-6 shadow-sm">

<h2 className="mb-6 text-xl font-semibold">

AI Command Centre

</h2>

<div className="grid gap-6 grid-cols-2">

<div>

<div className="text-sm text-muted-foreground">

Confidence

</div>

<div className="mt-2 text-4xl font-bold">

{workspace.confidence}

</div>

</div>

<div>

<div className="text-sm text-muted-foreground">

Portfolio Value

</div>

<div className="mt-2 text-4xl font-bold">

$

{workspace.portfolioValue.toLocaleString()}

</div>

</div>

</div>

</div>

);

}
