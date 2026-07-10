import { HEADER_ALIASES } from "./headerAliases";

function clean(text: string) {
  return text
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export interface HeaderMap {
    [key:string]:string;
}

export function resolveHeaders(headers:string[]):HeaderMap{

    const result:HeaderMap={};

    const cleaned=headers.map(h=>({
        original:h,
        cleaned:clean(h),
    }));

    for(const [field,aliases] of Object.entries(HEADER_ALIASES)){

        const aliasSet=aliases.map(clean);

        const found=cleaned.find(x=>aliasSet.includes(x.cleaned));

        if(found){
            result[field]=found.original;
        }

    }

    return result;

}
