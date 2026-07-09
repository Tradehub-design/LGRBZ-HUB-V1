export interface AuditRecord{

id:string;

table:string;

recordId:string;

action:string;

timestamp:string;

user:string;

}

const audit:AuditRecord[]=[];

export function log(

record:AuditRecord

){

audit.unshift(record);

}

export function getAudit(){

return audit;

}
