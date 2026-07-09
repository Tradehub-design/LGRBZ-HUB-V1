"use client";

import {

Plus,

TrendingUp,

TrendingDown,

Notebook

} from "lucide-react";

export default function QuickActions(){

const actions=[

{

label:"Buy",

icon:TrendingUp

},

{

label:"Sell",

icon:TrendingDown

},

{

label:"Dividend",

icon:Plus

},

{

label:"Add Note",

icon:Notebook

}

];

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="mb-5 font-semibold">

Quick Actions

</h2>

<div className="grid grid-cols-2 gap-3">

{actions.map(action=>(

<button

key={action.label}

className="rounded-lg border p-4 hover:bg-muted transition"

>

<action.icon

className="mx-auto mb-2"

size={22}

/>

<div>

{action.label}

</div>

</button>

))}

</div>

</div>

);

}

