import { create } from "zustand";

interface TransactionState{

selected:string[];

editing:string|null;

select:(id:string)=>void;

clear:()=>void;

edit:(id:string|null)=>void;

}

export const useTransactionStore=create<TransactionState>((set,get)=>({

selected:[],

editing:null,

select:(id)=>{

const exists=

get().selected.includes(id);

set({

selected:exists

?get().selected.filter(

x=>x!==id

)

:[

...get().selected,

id

]

});

},

clear:()=>set({

selected:[]

}),

edit:(editing)=>set({

editing

})

}));

