export function isOffline(){

if(typeof window==="undefined"){

return false;

}

return !navigator.onLine;

}
