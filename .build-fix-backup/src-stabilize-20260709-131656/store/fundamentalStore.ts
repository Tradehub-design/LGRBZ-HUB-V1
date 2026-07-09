import { create } from "zustand";

import type {
CompanyFundamentals
} from "@/core/intelligence/fundamentals/types";

interface State{

items:Record<string,CompanyFundamentals>;

upsert:(item:CompanyFundamentals)=>void;

}

export const useFundamentalStore=create<State>((set)=>({

items:{},

upsert:(item)=>set(state=>({

items:{

...state.items,

[item.ticker]:item

}

}))

}));
