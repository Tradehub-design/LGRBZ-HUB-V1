import { create } from "zustand";

interface State{

connected:boolean;

provider:string;

lastSync:string;

setStatus:(

connected:boolean,

provider:string

)=>void;

}

export const useMarketStatus=

create<State>((set)=>({

connected:false,

provider:"",

lastSync:"",

setStatus:(

connected,

provider

)=>set({

connected,

provider,

lastSync:

new Date().toISOString()

})

}));

