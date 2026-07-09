import { saveVersion } from "./versionHistory";

export async function saveWithVersion(

table:string,

record:any,

save:()=>Promise<void>

){

await save();

saveVersion({

id:crypto.randomUUID(),

table,

recordId:record.id,

version:record.version,

updatedAt:new Date().toISOString(),

updatedBy:"current-user",

snapshot:structuredClone(record)

});

}

