import { supabase } from "@/lib/supabase";

const subscriptions=

new Map<string,any>();

export function subscribe(

table:string,

callback:(payload:any)=>void

){

if(

subscriptions.has(table)

){

return;

}

const channel=

supabase

.channel(table)

.on(

"postgres_changes",

{

event:"*",

schema:"public",

table

},

callback

)

.subscribe();

subscriptions.set(

table,

channel

);

}

export function unsubscribeAll(){

subscriptions.forEach(

channel=>

supabase.removeChannel(

channel

)

);

subscriptions.clear();

}
