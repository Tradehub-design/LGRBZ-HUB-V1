"use client";

import { useEffect } from "react";

import { usePortfolio } from "@/hooks/usePortfolio";

import {

buildIntelligence

} from "@/core/intelligence/services/buildIntelligence";

import {

useIntelligenceStore

} from "@/store/intelligenceStore";

export default function usePortfolioIntelligence(){

const {

portfolio

}=usePortfolio();

const {

setCards

}=useIntelligenceStore();

useEffect(()=>{

if(!portfolio){

return;

}

setCards(

buildIntelligence(

portfolio

)

);

},[

portfolio,

setCards

]);

}

