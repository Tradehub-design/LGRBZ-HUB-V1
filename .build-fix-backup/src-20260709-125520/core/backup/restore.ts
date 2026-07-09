import {

latestBackup

} from "./backup";

export function restoreLatest(){

return latestBackup()?.data;

}

