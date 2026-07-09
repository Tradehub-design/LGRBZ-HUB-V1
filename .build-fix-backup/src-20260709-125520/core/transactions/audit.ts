export interface AuditEntry{

id:string;

date:string;

action:string;

user:string;

description:string;

}

const history:AuditEntry[]=[];

export function logAudit(

entry:AuditEntry

){

history.push(entry);

}

export function getAudit(){

return history;

}

