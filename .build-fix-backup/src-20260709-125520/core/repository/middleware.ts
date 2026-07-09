import {

validateEntity

} from "@/core/validation/entityValidator";

export async function repositoryMiddleware(

entity:any,

save:()=>Promise<void>

){

const result=

validateEntity(entity);

if(!result.valid){

throw new Error(

result.errors.join(",")

);

}

await save();

}

