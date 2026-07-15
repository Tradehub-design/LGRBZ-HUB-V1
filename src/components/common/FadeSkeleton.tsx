"use client";

import { motion } from "framer-motion";

export default function FadeSkeleton(){

return(

<motion.div

initial={{opacity:1}}

animate={{opacity:0}}

transition={{

duration:.4

}}

className="absolute inset-0"

>

</motion.div>

);

}
