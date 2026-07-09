import {

pendingUpdates

} from "./optimisticUpdates";

import {

queueLength

} from "./syncQueue";

export function syncStatistics(){

return{

queued:

queueLength(),

pending:

pendingUpdates().length

};

}
