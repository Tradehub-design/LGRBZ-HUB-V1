const queue=new Set<string>();

export function queueTicker(

ticker:string

){

queue.add(ticker);

}

export function flushQueue(){

const tickers=[...queue];

queue.clear();

return tickers;

}
