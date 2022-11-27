import type { Transition } from "framer-motion";
import { motion } from "framer-motion";

const containerVariants = {
  initial: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const dotClasses = "block h-2 w-2 rounded-full bg-black/80";

const dotVariants = {
  initial: {
    y: "0%",
  },
  animate: {
    y: "100%",
  },
};

const dotTransition: Transition = {
  duration: 0.3,
  repeat: Infinity,
  repeatType: "mirror",
  ease: "easeInOut",
};

export default function LoadingDots() {
  return (
    <div className="flex w-full items-center justify-center">
      <motion.div
        className="flex h-7 w-12 justify-around"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.span
          className={dotClasses}
          variants={dotVariants}
          transition={dotTransition}
        />
        <motion.span
          className={dotClasses}
          variants={dotVariants}
          transition={dotTransition}
        />
        <motion.span
          className={dotClasses}
          variants={dotVariants}
          transition={dotTransition}
        />
      </motion.div>
    </div>
  );
}
