"use client";

import { useEffect } from "react";

import {

registerImporters

} from "@/core/import/registerImporters";

export default function useImportPlatform(){

useEffect(()=>{

registerImporters();

},[]);

}
