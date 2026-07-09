"use client";

import { useEffect } from "react";

import { usePortfolio } from "@/hooks/usePortfolio";

import {

buildPortfolioSnapshot

} from "@/core/business/services/buildPortfolioSnapshot";

import {

useSnapshotStore

} from "@/store/snapshotStore";

export default function useBusinessEngine(){

const {

portfolio

}=usePortfolio();

const {

setSnapshot

}=useSnapshotStore();

useEffect(()=>{

if(!portfolio){

return;

}

setSnapshot(

buildPortfolioSnapshot(

portfolio

)

);

},[

portfolio,

setSnapshot

]);

}

