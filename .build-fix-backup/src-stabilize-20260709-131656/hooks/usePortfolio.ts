import {

useMemo

} from "react";

import {

usePortfolioStore

} from "@/store/portfolioStore";

export function usePortfolio(){

const store=

usePortfolioStore();

return useMemo(

()=>{

if(

store.replayEnabled&&

store.replaySnapshot

){

return{

portfolio:

store.portfolio,

snapshot:

store.replaySnapshot,

replay:true

};

}

return{

portfolio:

store.portfolio,

snapshot:null,

replay:false

};

},

[

store

]

);

}

export default usePortfolio;

