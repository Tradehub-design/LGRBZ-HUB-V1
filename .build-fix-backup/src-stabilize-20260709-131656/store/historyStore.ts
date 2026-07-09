import { create } from "zustand";

interface HistoryState{

undoStack:any[];

redoStack:any[];

push:(state:any)=>void;

undo:()=>any;

redo:()=>any;

}

export const useHistoryStore=create<HistoryState>((set,get)=>({

undoStack:[],

redoStack:[],

push:(state)=>set({

undoStack:[

...get().undoStack,

state

]

}),

undo:()=>{

const stack=[...get().undoStack];

const last=stack.pop();

set({

undoStack:stack

});

return last;

},

redo:()=>null

}));

