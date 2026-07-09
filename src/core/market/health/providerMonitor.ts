import { create } from "zustand";

interface ProviderStatus{

name:string;

online:boolean;

latency:number;

lastCheck:string;

}

interface State{

providers:ProviderStatus[];

update:(status:ProviderStatus)=>void;

}

export const useProviderMonitor=

create<State>((set,get)=>({

providers:[],

update:(status)=>{

const list=

get()

.providers

.filter(

p=>p.name!==status.name

);

set({

providers:[

...list,

status

]

});

}

}));

