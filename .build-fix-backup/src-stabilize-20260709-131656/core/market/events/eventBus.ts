type Callback=(payload:any)=>void;

const listeners=

new Map<string,Callback[]>();

export function publish(

event:string,

payload:any

){

listeners

.get(event)

?.forEach(cb=>cb(payload));

}

export function subscribe(

event:string,

callback:Callback

){

const current=

listeners.get(event)??[];

listeners.set(

event,

[

...current,

callback

]

);

}
