export interface PortfolioEvent{

id:string;

time:string;

title:string;

description:string;

priority:number;

}

export function createEvent(

title:string,

description:string,

priority:number

):PortfolioEvent{

return{

id:crypto.randomUUID(),

time:new Date().toISOString(),

title,

description,

priority

};

}
