const calls=new Map<string,number>();

export function canCall(

provider:string,

limit:number

){

const used=

calls.get(provider)||0;

if(used>=limit){

return false;

}

calls.set(

provider,

used+1

);

return true;

}

export function resetLimits(){

calls.clear();

}

