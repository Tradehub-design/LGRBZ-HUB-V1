"use client";

import { useEffect } from "react";

import { usePortfolio } from "@/hooks/usePortfolio";

import {

buildAdvancedSnapshot

} from "@/core/business/services/buildAdvancedSnapshot";

import {

useAdvancedSnapshotStore

} from "@/store/advancedSnapshotStore";

export default function useAdvancedBusinessEngine(){

const {

portfolio

}=usePortfolio();

const {

setSnapshot

}=useAdvancedSnapshotStore();

useEffect(()=>{

if(!portfolio){

return;

}

setSnapshot(

buildAdvancedSnapshot(

portfolio

)

);

},[

portfolio,

setSnapshot

]);

}
