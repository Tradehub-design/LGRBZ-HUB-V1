"use client";

import AddTransactionDialog from "./AddTransactionDialog";

import {

Plus,

Upload,

Download,

RotateCcw,

Search

} from "lucide-react";

export default function TransactionsToolbar(){

return(

<div className="flex flex-wrap items-center justify-between gap-4">

<div>

<h1 className="text-3xl font-bold">

Transactions

</h1>

<p className="text-muted-foreground">

Portfolio Transaction Centre

</p>

</div>

<div className="flex gap-2">

<AddTransactionDialog/>

<button className="rounded-lg border p-2">

<Upload size={18}/>

</button>

<button className="rounded-lg border p-2">

<Download size={18}/>

</button>

<button className="rounded-lg border p-2">

<RotateCcw size={18}/>

</button>

<button className="rounded-lg border p-2">

<Search size={18}/>

</button>

</div>

</div>

);

}

