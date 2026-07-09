import { create } from "zustand";
import type {
InvestmentThesis,
Catalyst
} from "@/core/research/types";

interface ResearchState{

thesis:InvestmentThesis[];

catalysts:Catalyst[];

saveThesis:(t:InvestmentThesis)=>void;

addCatalyst:(c:Catalyst)=>void;

}

export const useResearchStore=create<ResearchState>((set,get)=>({

thesis:[],

catalysts:[],

saveThesis:(t)=>{

const list=get().thesis.filter(

x=>x.ticker!==t.ticker

);

set({

thesis:[...list,t]

});

},

addCatalyst:(c)=>set({

catalysts:[

...get().catalysts,

c

]

})

}));

