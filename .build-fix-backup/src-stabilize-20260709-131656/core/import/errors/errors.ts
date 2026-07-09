export interface ImportError{

row:number;

message:string;

}

const errors:ImportError[]=[];

export function addError(

error:ImportError

){

errors.push(error);

}

export function clearErrors(){

errors.length=0;

}

export function getErrors(){

return errors;

}
