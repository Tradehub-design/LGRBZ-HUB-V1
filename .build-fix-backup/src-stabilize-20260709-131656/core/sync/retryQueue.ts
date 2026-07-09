const retry:any[]=[];

export function addRetry(

item:any

){

retry.push(item);

}

export function nextRetry(){

return retry.shift();

}

export function retryCount(){

return retry.length;

}

