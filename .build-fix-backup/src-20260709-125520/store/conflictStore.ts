import { create } from "zustand";

import type {

Conflict

} from "@/core/sync/conflicts";

interface ConflictState{

conflicts:Conflict[];

add:(c:Conflict)=>void;

resolve:(id:string)=>void;

}

export const useConflictStore=

create<ConflictState>((set,get)=>({

conflicts:[],

add:(c)=>set({

conflicts:[

...get().conflicts,

c

]

}),

resolve:(id)=>set({

conflicts:

get()

.conflicts

.map(c=>

c.id===id

?{

...c,

resolved:true

}

:c

)

})

}));

