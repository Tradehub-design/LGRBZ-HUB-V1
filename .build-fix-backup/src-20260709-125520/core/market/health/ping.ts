import {

useProviderMonitor

} from "./providerMonitor";

export async function ping(

provider:string,

run:()=>Promise<void>

){

const start=

performance.now();

try{

await run();

useProviderMonitor

.getState()

.update({

name:provider,

online:true,

latency:

Math.round(

performance.now()-start

),

lastCheck:

new Date()

.toISOString()

});

}catch{

useProviderMonitor

.getState()

.update({

name:provider,

online:false,

latency:0,

lastCheck:

new Date()

.toISOString()

});

}

}

