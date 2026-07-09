"use client";

export default function LoadingOverlay(){

return(

<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">

<div className="h-14 w-14 animate-spin rounded-full border-4 border-primary border-t-transparent"/>

</div>

);

}

