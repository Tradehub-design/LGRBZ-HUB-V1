const pending=

new Map<string,any>();

export function optimisticSave(

id:string,

record:any

){

pending.set(

id,

record

);

}

export function optimisticCommit(

id:string

){

pending.delete(id);

}

export function pendingUpdates(){

return[

...pending.values()

];

}
