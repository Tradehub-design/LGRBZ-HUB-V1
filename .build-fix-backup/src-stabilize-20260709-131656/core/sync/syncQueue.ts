export interface QueueItem{

id:string;

table:string;

action:

"create"|

"update"|

"delete";

payload:any;

attempts:number;

}

const queue:QueueItem[]=[];

export function enqueue(

item:QueueItem

){

queue.push(item);

}

export function dequeue(){

return queue.shift();

}

export function queueLength(){

return queue.length;

}

export function allQueue(){

return queue;

}
