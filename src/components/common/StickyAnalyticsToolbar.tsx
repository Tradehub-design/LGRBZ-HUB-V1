"use client";

import { ReactNode } from "react";

type Props={
    children:ReactNode;
};

export default function StickyAnalyticsToolbar({
    children
}:Props){

    return(

        <div
            className="
            sticky
            top-4
            z-30
            rounded-2xl
            border
            border-slate-800
            bg-slate-950/80
            backdrop-blur-xl
            mb-5
            "
        >

            <div className="p-3">

                {children}

            </div>

        </div>

    );

}
