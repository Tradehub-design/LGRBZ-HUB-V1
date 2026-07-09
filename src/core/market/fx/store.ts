import { create } from "zustand";

import type { FxRate } from "./types";

interface FxState{

rates:Record<string,FxRate>;

upsert:(rate:FxRate)=>void;

find:(pair:string)=>FxRate|undefined;

}

export const useFxStore=create<FxState>((set,get)=>({

rates:{},

upsert:(rate)=>set(state=>({

rates:{

...state.rates,

[`${rate.base}_${rate.quote}`]:rate

}

})),

find:(pair)=>get().rates[pair]

}));
