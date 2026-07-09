import { create } from "zustand";

import portfolioCalculator from "@/core/portfolio/calculator";

import type {

  Portfolio,

  PortfolioTransaction,

  ReplaySnapshot

} from "@/core/portfolio/types";

import buildReplaySnapshot
from "@/core/portfolio/replay";

interface PortfolioState{

  transactions:PortfolioTransaction[];

  portfolio:Portfolio|null;

  replayEnabled:boolean;

  replayDate:string|null;

  replaySnapshot:ReplaySnapshot|null;

  calculate:()=>void;

  loadTransactions:(

    tx:PortfolioTransaction[]

  )=>void;

  addTransaction:(

    tx:PortfolioTransaction

  )=>void;

  removeTransaction:(

    id:string

  )=>void;

  updateTransaction:(

    tx:PortfolioTransaction

  )=>void;

  enableReplay:(

    date:string

  )=>void;

  disableReplay:()=>void;

}

export const usePortfolioStore=

create<PortfolioState>()(

(set,get)=>({

transactions:[],

portfolio:null,

replayEnabled:false,

replayDate:null,

replaySnapshot:null,


calculate(){

const result=

portfolioCalculator.calculate(

get().transactions

);

set({

portfolio:result.portfolio

});

},

loadTransactions(tx){

set({

transactions:tx

});

get().calculate();

},

addTransaction(tx){

set({

transactions:[

...get().transactions,

tx

]

});

get().calculate();

},

removeTransaction(id){

set({

transactions:

get().transactions.filter(

t=>t.id!==id

)

});

get().calculate();

},

updateTransaction(tx){

set({

transactions:

get().transactions.map(

t=>

t.id===tx.id

?tx

:t

)

});

get().calculate();

},


enableReplay(date){

const portfolio=

get().portfolio;

if(!portfolio)return;

set({

replayEnabled:true,

replayDate:date,

replaySnapshot:

buildReplaySnapshot(

portfolio,

date

)

});

},

disableReplay(){

set({

replayEnabled:false,

replayDate:null,

replaySnapshot:null

});

}

})

);

