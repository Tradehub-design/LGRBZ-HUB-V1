"use client";

import { useState } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";
import type { PortfolioTransaction } from "@/core/portfolio/types";

export default function AddTransactionDialog(){

const { addTransaction } = usePortfolioStore();

const [open,setOpen]=useState(false);

const [form,setForm]=useState<Partial<PortfolioTransaction>>({

action:"Buy",

currency:"AUD",

assetClass:"Stock",

fees:0,

quantity:0,

price:0

});

function update(

field:keyof PortfolioTransaction,

value:any

){

setForm({

...form,

[field]:value

});

}

function save(){

addTransaction({
id: crypto.randomUUID(),
raw: {},
rowNumber: Date.now(),
source: "manual",
sourceRow: Date.now(),
date: form.date!,
action: form.action!,
type: form.action!,
assetTicker: form.assetTicker!,
ticker: form.assetTicker!,
quantity: Number(form.quantity),
price: Number(form.price),
priceAud: Number(form.price),
marketPriceAud: Number(form.price),
fees: Number(form.fees),
fiatFees: Number(form.fees),
feesAud: Number(form.fees),
currency: form.currency as any,
platform: form.platform!,
assetClass: "Equity",
sector: "Uncategorised",
country: "Australia",
strategy: "Manual",
total: Number(form.quantity) * Number(form.price) + Number(form.fees),
totalAud: Number(form.quantity) * Number(form.price) + Number(form.fees),
totalFeesIncluded: Number(form.quantity) * Number(form.price) + Number(form.fees),
totalFeesIncludedAud: Number(form.quantity) * Number(form.price) + Number(form.fees),
amount: Number(form.quantity) * Number(form.price) + Number(form.fees),
amountAud: Number(form.quantity) * Number(form.price) + Number(form.fees),
notes: form.notes ?? "",
});

setOpen(false);

}

if(!open){

return(

<button

onClick={()=>setOpen(true)}

className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"

>

Add Transaction

</button>

);

}


return(

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

<div className="w-full max-w-2xl rounded-xl bg-background p-6">

<h2 className="mb-5 text-2xl font-bold">

New Transaction

</h2>

<div className="grid gap-4 md:grid-cols-2">

<input placeholder="Ticker"

onChange={e=>update("assetTicker",e.target.value)}/>

<input type="date"

onChange={e=>update("date",e.target.value)}/>

<input placeholder="Quantity"

onChange={e=>update("quantity",e.target.value)}/>

<input placeholder="Price"

onChange={e=>update("price",e.target.value)}/>

<input placeholder="Fees"

onChange={e=>update("fees",e.target.value)}/>

<input placeholder="Broker"

onChange={e=>update("platform",e.target.value)}/>

</div>

<div className="mt-6 flex justify-end gap-3">

<button

onClick={()=>setOpen(false)}

className="rounded border px-4 py-2"

>

Cancel

</button>

<button

onClick={save}

className="rounded bg-primary px-4 py-2 text-primary-foreground"

>

Save

</button>

</div>

</div>

</div>

);

}

