import { create } from "zustand";

export const useTimelineStore=create((set)=>({

events:[],

setEvents:(events:any[])=>set({events})

}));
