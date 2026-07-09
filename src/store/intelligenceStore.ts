import { create } from "zustand";

import type {

IntelligenceCard

} from "@/core/intelligence/models/intelligence";

interface State{

cards:IntelligenceCard[];

setCards:(

cards:IntelligenceCard[]

)=>void;

}

export const useIntelligenceStore=

create<State>((set)=>({

cards:[],

setCards:(cards)=>

set({

cards

})

}));

