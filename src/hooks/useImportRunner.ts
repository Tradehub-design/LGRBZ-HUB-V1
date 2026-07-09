"use client";

import { useState } from "react";

import {

runImport

} from "@/core/import/runtime/importRuntime";

export default function useImportRunner(){

const [loading,setLoading]=

useState(false);

async function importFile(

file:File

){

setLoading(true);

const text=

await file.text();

await runImport(

file.name,

text

);

setLoading(false);

}

return{

loading,

importFile

};

}
