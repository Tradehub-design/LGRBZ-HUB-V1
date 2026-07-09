"use client";

import { useState } from "react";

export default function HoldingNotes(){

const [

notes,

setNotes

]=useState("");

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="font-semibold">

Notes

</h2>

<textarea

value={notes}

onChange={(e)=>

setNotes(

e.target.value

)

}

placeholder="Research, earnings notes, reasons for holding..."

className="mt-4 h-56 w-full rounded border p-3"

/>

</div>

);

}

