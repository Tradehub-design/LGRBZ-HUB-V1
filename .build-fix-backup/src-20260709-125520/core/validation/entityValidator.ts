export interface ValidationResult{

valid:boolean;

errors:string[];

}

export function validateEntity(

entity:any

):ValidationResult{

const errors:string[]=[];

if(!entity.id){

errors.push(

"Missing ID"

);

}

if(

entity.version===undefined

){

errors.push(

"Missing version"

);

}

return{

valid:

errors.length===0,

errors

};

}

