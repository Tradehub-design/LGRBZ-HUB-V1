export interface ExchangeSession{

exchange:string;

timezone:string;

openHour:number;

closeHour:number;

weekends:boolean;

}

export const EXCHANGE_SESSIONS={

ASX:{

exchange:"ASX",

timezone:"Australia/Sydney",

openHour:10,

closeHour:16,

weekends:false

},

NYSE:{

exchange:"NYSE",

timezone:"America/New_York",

openHour:9,

closeHour:16,

weekends:false

},

NASDAQ:{

exchange:"NASDAQ",

timezone:"America/New_York",

openHour:9,

closeHour:16,

weekends:false

},

CRYPTO:{

exchange:"CRYPTO",

timezone:"UTC",

openHour:0,

closeHour:24,

weekends:true

}

};

