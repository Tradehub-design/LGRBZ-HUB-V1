export interface Backup{

id:string;

created:string;

data:any;

}

const backups:Backup[]=[];

export function createBackup(

data:any

){

backups.unshift({

id:crypto.randomUUID(),

created:new Date().toISOString(),

data

});

}

export function latestBackup(){

return backups[0];

}

export function allBackups(){

return backups;

}

