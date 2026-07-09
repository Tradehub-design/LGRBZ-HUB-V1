export interface SearchItem{

id:string;

title:string;

subtitle:string;

type:
"holding"|
"transaction"|
"page"|
"research"|
"setting";

href:string;

keywords:string[];

}

export function searchEverything(

query:string,

items:SearchItem[]

){

const q=query.toLowerCase();

return items

.filter(item=>

item.title.toLowerCase().includes(q)||

item.subtitle.toLowerCase().includes(q)||

item.keywords.some(

k=>k.toLowerCase().includes(q)

)

)

.sort(

(a,b)=>

a.title.localeCompare(b.title)

);

}

