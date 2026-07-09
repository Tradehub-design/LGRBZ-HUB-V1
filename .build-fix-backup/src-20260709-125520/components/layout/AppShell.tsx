"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/navigation/SidebarV2";
import TopBar from "@/components/navigation/TopBar";

interface Props{
children:ReactNode;
}

export default function AppShell({
children
}:Props){

return(

<div className="min-h-screen bg-background">

<Sidebar/>

<div className="ml-72">

<TopBar/>

<main className="mx-auto max-w-[1900px] px-10 py-8">

{children}

</main>

</div>

</div>

);

}
