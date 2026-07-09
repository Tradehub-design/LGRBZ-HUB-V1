import { create } from "zustand";

export const useAIWorkspaceStore=

create((set)=>({

workspace:null,

setWorkspace:(workspace:any)=>

set({

workspace

})

}));
