export function calculateCAGR(

starting:number,

ending:number,

years:number

){

if(

starting<=0||

ending<=0||

years<=0

){

return 0;

}

return(

Math.pow(

ending/starting,

1/years

)-1

)*100;

}
