export interface Exchange{

code:string;

name:string;

timezone:string;

currency:string;

}

export const EXCHANGES={

ASX:{

code:"ASX",

name:"Australian Securities Exchange",

timezone:"Australia/Sydney",

currency:"AUD"

},

NASDAQ:{

code:"NASDAQ",

name:"NASDAQ",

timezone:"America/New_York",

currency:"USD"

},

NYSE:{

code:"NYSE",

name:"New York Stock Exchange",

timezone:"America/New_York",

currency:"USD"

},

BINANCE:{

code:"BINANCE",

name:"Binance",

timezone:"UTC",

currency:"USD"

}

} satisfies Record<string,Exchange>;

