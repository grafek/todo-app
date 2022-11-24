import { motion } from "framer-motion";

const ContainerVariants = {
  initial: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};
const dotClasses = "block h-2 w-2 rounded-full bg-gray-700";

const dotVariants = {
  initial: {
    y: "0%",
  },
  animate: {
    y: "100%",
  },
};

const dotTransition = {
  duration: 0.5,
  repeat: Infinity,
  ease: "easeInOut",
};

export default function LoadingDots() {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        className="flex h-7 w-12 justify-around"
        variants={ContainerVariants}
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
