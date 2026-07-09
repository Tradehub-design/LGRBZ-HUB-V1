import { create } from "zustand";

import {

MarketQuote

} from "@/core/market/types";

interface MarketState{

quotes:Record<string,MarketQuote>;

updateQuote:(

quote:MarketQuote

)=>void;

}

export const useMarketStore=create<MarketState>((set)=>({

quotes:{},

updateQuote:(quote)=>set(state=>({

quotes:{

...state.quotes,

[quote.ticker]:quote

}

}))

}));

