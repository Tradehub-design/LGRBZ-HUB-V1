export interface ImportHistory{

id:string;

broker:string;

rows:number;

created:string;

}

const history:ImportHistory[]=[];

export function addHistory(

item:ImportHistory

){

history.unshift(item);

}

export function getHistory(){

return history;

}
