"use client";

import ImportDropzone

from "./dropzone/ImportDropzone";

import useImportRunner

from "@/hooks/useImportRunner";

export default function ImportWorkspace(){

const{

loading,

importFile

}=useImportRunner();

return(

<div className="space-y-6">

<ImportDropzone

onSelect={importFile}

/>

{loading&&(

<div className="rounded-xl border p-6">

Importing...

</div>

)}

</div>

);

}
