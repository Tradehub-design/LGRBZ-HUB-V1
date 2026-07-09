export interface Benchmark{

ticker:string;

name:string;

returnPercent:number;

volatility:number;

}

export const DEFAULT_BENCHMARKS:Benchmark[]=[

{

ticker:"VAS",

name:"Vanguard Australian Shares",

returnPercent:0,

volatility:0

},

{

ticker:"NDQ",

name:"NASDAQ 100",

returnPercent:0,

volatility:0

},

{

ticker:"SPY",

name:"S&P 500",

returnPercent:0,

volatility:0

},

{

ticker:"BTC",

name:"Bitcoin",

returnPercent:0,

volatility:0

},

{

ticker:"XJO",

name:"ASX 200",

returnPercent:0,

volatility:0

}

];

