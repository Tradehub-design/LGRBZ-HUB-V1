export const MARKET_CONFIG={

provider:

process.env.NEXT_PUBLIC_MARKET_PROVIDER??

"fmp",

refreshIntervals:{

marketOpen:30000,

marketClosed:1800000,

watchlist:60000,

news:600000,

profile:2592000000

},

requestTimeout:10000,

retryAttempts:3,

retryDelay:1000

};

