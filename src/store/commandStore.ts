import { create } from "zustand";

interface CommandState{

open:boolean;

query:string;

setOpen:(open:boolean)=>void;

setQuery:(query:string)=>void;

}

export const useCommandStore=create<CommandState>((set)=>({

open:false,

query:"",

setOpen:(open)=>set({open}),

setQuery:(query)=>set({query})

}));

