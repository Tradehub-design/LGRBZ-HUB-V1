export interface VersionRecord{

id:string;

table:string;

recordId:string;

version:number;

updatedAt:string;

updatedBy:string;

snapshot:any;

}

const versions:VersionRecord[]=[];

export function saveVersion(

record:VersionRecord

){

versions.unshift(record);

}

export function history(

table:string,

recordId:string

){

return versions.filter(

v=>

v.table===table&&

v.recordId===recordId

);

}

