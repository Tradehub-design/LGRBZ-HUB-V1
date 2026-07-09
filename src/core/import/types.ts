export interface ImportRow{

date:string;

ticker:string;

action:string;

quantity:number;

price:number;

fees:number;

currency:string;

broker:string;

notes:string;

}

export interface ImportResult{

success:number;

failed:number;

errors:string[];

rows:ImportRow[];

}

