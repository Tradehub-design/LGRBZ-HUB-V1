"use client";

export default function NotificationSettings(){

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-6">

<h2 className="mb-5 text-xl font-bold">

Notifications

</h2>

<div className="space-y-3">

<label className="flex gap-3">

<input type="checkbox"/>

Price Alerts

</label>

<label className="flex gap-3">

<input type="checkbox"/>

Dividend Reminders

</label>

<label className="flex gap-3">

<input type="checkbox"/>

Earnings Notifications

</label>

<label className="flex gap-3">

<input type="checkbox"/>

Portfolio Risk Alerts

</label>

</div>

</div>

);

}
