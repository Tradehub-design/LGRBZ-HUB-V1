export interface EarningsSnapshot{

ticker:string;

date:string;

estimate:number|null;

actual:number|null;

status:string;

}

export async function earningsSnapshot(

ticker:string

):Promise<EarningsSnapshot>{

return{

ticker,

date:"",

estimate:null,

actual:null,

status:"Unknown"

};

}
