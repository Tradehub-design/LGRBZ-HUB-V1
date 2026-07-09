import { create } from "zustand";

import type {

WatchlistItem

} from "@/core/watchlist/types";

interface WatchlistState{

items:WatchlistItem[];

add:(item:WatchlistItem)=>void;

remove:(ticker:string)=>void;

}

export const useWatchlistStore=create<WatchlistState>((set,get)=>({

items:[],

add:(item)=>set({

items:[

...get().items,

item

]

}),

remove:(ticker)=>set({

items:get().items.filter(

i=>i.ticker!==ticker

)

})

}));

