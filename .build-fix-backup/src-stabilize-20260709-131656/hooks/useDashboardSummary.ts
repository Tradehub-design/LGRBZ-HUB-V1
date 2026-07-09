"use client";

import { useEffect } from "react";

import { usePortfolio } from "@/hooks/usePortfolio";

import {

buildDashboardSummary

} from "@/core/intelligence/services/dashboardSummary";

import {

useDashboardSummaryStore

} from "@/store/dashboardSummaryStore";

export default function useDashboardSummary(){

const { portfolio }=

usePortfolio();

const { setSummary }=

useDashboardSummaryStore();

useEffect(()=>{

if(!portfolio){

return;

}

setSummary(

buildDashboardSummary(

portfolio

)

);

},[portfolio]);

}
