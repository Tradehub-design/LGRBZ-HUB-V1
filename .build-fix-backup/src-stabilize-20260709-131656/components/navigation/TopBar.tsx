"use client";

export default function TopBar(){

return(

<header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">

<div className="flex h-20 items-center justify-between px-10">

<div>

<h2 className="text-3xl font-semibold">

Portfolio Dashboard

</h2>

</div>

<div className="flex items-center gap-4">

<button className="rounded-2xl border px-4 py-2">

Search

</button>

<button className="rounded-2xl border px-4 py-2">

Notifications

</button>

</div>

</div>

</header>

);

}
