"use client";

import { useEffect } from "react";

import { usePortfolio } from "@/hooks/usePortfolio";

import {

buildTimeline

} from "@/core/intelligence/timeline/buildTimeline";

import {

useTimelineStore

} from "@/store/timelineStore";

export default function usePortfolioTimeline(){

const { portfolio }=

usePortfolio();

const { setEvents }=

useTimelineStore();

useEffect(()=>{

if(!portfolio as any)return;

setEvents(

buildTimeline(portfolio as any)

);

},[portfolio]);

}
