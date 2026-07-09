"use client";

import {

allBackups

} from "@/core/backup/backup";

export default function BackupStatus(){

const backups=

allBackups();

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="font-semibold">

Backups

</h2>

<div className="mt-4 text-4xl font-bold">

{backups.length}

</div>

</div>

);

}

