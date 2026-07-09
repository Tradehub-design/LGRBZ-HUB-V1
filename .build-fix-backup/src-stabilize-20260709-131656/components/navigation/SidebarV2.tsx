"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { NAVIGATION } from "./navigation";

export default function SidebarV2(){

const pathname=

usePathname();

return(

<aside className="fixed inset-y-0 left-0 w-72 border-r bg-card">

<div className="border-b p-8">

<h1 className="text-4xl font-bold">

LGRBZ

</h1>

<p className="mt-2 text-sm text-muted-foreground">

Professional

</p>

</div>

<nav className="space-y-2 p-4">

{NAVIGATION.map(item=>{

const Icon=item.icon;

const active=

pathname===item.href;

return(

<Link

key={item.href}

href={item.href}

className={`flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-200

${active

?"bg-primary text-primary-foreground shadow"

:"hover:bg-muted"

}`}

>

<Icon size={20}/>

<span>

{item.title}

</span>

</Link>

);

})}

</nav>

</aside>

);

}

