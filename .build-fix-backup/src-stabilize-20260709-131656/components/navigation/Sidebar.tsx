"use client";

import Link from "next/link";

const items=[

["Dashboard","/"],

["Portfolio","/portfolio"],

["Holdings","/holdings"],

["Transactions","/transactions"],

["Analytics","/analytics"],

["Risk","/risk"],

["Dividends","/dividends"],

["Research","/research"],

["Reviews","/reviews"],

["Watchlists","/watchlists"],

["Settings","/settings"]

];

export default function Sidebar(){

return(

<aside className="fixed left-0 top-0 h-screen w-72 border-r bg-card">

<div className="border-b p-8">

<h1 className="text-3xl font-bold">

LGRBZ

</h1>

<div className="text-sm text-muted-foreground">

Professional

</div>

</div>

<nav className="p-5">

<div className="space-y-2">

{items.map(([name,href])=>(

<Link

key={href}

href={href}

className="block rounded-2xl px-4 py-3 transition hover:bg-muted"

>

{name}

</Link>

))}

</div>

</nav>

</aside>

);

}
