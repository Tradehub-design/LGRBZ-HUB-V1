export function exportCSV(

rows:any[]

){

if(rows.length===0){

return "";

}

const headers=

Object.keys(rows[0]);

const csv=[

headers.join(",")

];

rows.forEach(row=>{

csv.push(

headers.map(h=>row[h]).join(",")

);

});

return csv.join("\n");

}

