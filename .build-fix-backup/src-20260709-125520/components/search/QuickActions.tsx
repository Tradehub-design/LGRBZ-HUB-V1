"use client";

import { useRouter } from "next/navigation";

export default function QuickActions(){

const router=

useRouter();

const actions=[

["Dashboard","/"],

["Holdings","/holdings"],

["Transactions","/transactions"],

["Analytics","/analytics"],

["Risk","/risk"],

["Research","/research"],

["Dividends","/dividends"],

["Reviews","/reviews"]

];

return(

<div className="grid gap-3 md:grid-cols-4">

{actions.map(([title,href])=>(

<button

key={title}

onClick={()=>router.push(href)}

className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5 hover:bg-muted"

>

{title}

</button>

))}

</div>

);

}

