import { resolveHeaders } from "./resolveHeaders";

export function inspectWorkbook(
    rows:Record<string,unknown>[]
){

    if(rows.length===0){
        return {};
    }

    return resolveHeaders(Object.keys(rows[0]));

}
