import {

nextRetry

} from "./retryQueue";

export async function processRetries(){

while(true){

const item=

nextRetry();

if(!item){

break;

}

try{

await item.run();

}catch{

break;

}

}

}

