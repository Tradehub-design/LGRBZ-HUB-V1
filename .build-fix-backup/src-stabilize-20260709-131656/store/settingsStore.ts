import { create } from "zustand";

export interface UserSettings{

theme:"light"|"dark"|"system";

currency:string;

dateFormat:string;

language:string;

compactMode:boolean;

animations:boolean;

}

interface SettingsState{

settings:UserSettings;

update:<K extends keyof UserSettings>(
key:K,
value:UserSettings[K]
)=>void;

}

export const useSettingsStore=create<SettingsState>((set)=>({

settings:{

theme:"system",

currency:"AUD",

dateFormat:"DD/MM/YYYY",

language:"English",

compactMode:false,

animations:true

},

update:(key,value)=>

set(state=>({

settings:{

...state.settings,

[key]:value

}

}))

}));

