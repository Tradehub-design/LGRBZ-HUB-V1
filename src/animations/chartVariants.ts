import { Variants } from "framer-motion";

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: .35,
      ease: "easeOut",
    },
  },
};

export const cardHover: Variants = {

  rest:{
    scale:1
  },

  hover:{
    scale:1.015,

    transition:{
      duration:.18
    }

  }

};

export const staggerParent:Variants={

hidden:{},

visible:{

transition:{

staggerChildren:.08

}

}

};

export default{

fadeIn,

cardHover,

staggerParent

};
