"use client";

import { useState } from "react";

export default function ImportWizard(){

const [file,setFile]=useState<File|null>(null);

return(

<div className="rounded-xl border bg-card p-5">

<h2 className="text-xl font-semibold">

Initial Portfolio Import

</h2>

<p className="mt-2 text-sm text-muted-foreground">

Import your historical Excel workbook once. Future transactions are entered manually through TradeHub.

</p>

<input

type="file"

accept=".xlsx,.xls,.csv"

className="mt-6"

onChange={(e)=>{

setFile(

e.target.files?.[0]??null

);

}}

/>

{file&&(

<div className="mt-4 rounded-lg bg-muted p-3">

{file.name}

</div>

)}

</div>

);

}

