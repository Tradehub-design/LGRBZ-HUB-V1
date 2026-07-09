"use client";

import { useSettingsStore } from "@/store/settingsStore";

export default function AppearanceSettings(){

const {

settings,

update

}=useSettingsStore();

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-6">

<h2 className="mb-5 text-xl font-bold">

Appearance

</h2>

<div className="space-y-4">

<select

value={settings.theme}

onChange={e=>

update(

"theme",

e.target.value as any

)

}

className="rounded border p-2"

>

<option value="light">

Light

</option>

<option value="dark">

Dark

</option>

<option value="system">

System

</option>

</select>

<label className="flex gap-3">

<input

type="checkbox"

checked={settings.animations}

onChange={e=>

update(

"animations",

e.target.checked

)

}

/>

Animations

</label>

<label className="flex gap-3">

<input

type="checkbox"

checked={settings.compactMode}

onChange={e=>

update(

"compactMode",

e.target.checked

)

}

/>

Compact Mode

</label>

</div>

</div>

);

}
