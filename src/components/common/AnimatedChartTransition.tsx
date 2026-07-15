"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

type Props={
    animationKey:string;
    children:ReactNode;
};

export default function AnimatedChartTransition({
    animationKey,
    children
}:Props){

    return(

        <AnimatePresence mode="wait">

            <motion.div
                key={animationKey}
                initial={{
                    opacity:0,
                    y:12
                }}
                animate={{
                    opacity:1,
                    y:0
                }}
                exit={{
                    opacity:0,
                    y:-12
                }}
                transition={{
                    duration:.28
                }}
            >

                {children}

            </motion.div>

        </AnimatePresence>

    );

}
