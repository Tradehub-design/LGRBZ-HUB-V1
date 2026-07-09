import {

dequeue

} from "./syncQueue";

export async function processSyncQueue(){

while(true){

const item=

dequeue();

if(!item){

break;

}

try{

// repository sync

}catch{

item.attempts++;

}

}

}
