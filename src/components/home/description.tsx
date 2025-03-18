import { motion, AnimationProps } from "framer-motion";

export const Description = ({
  header,
  description1,
  description2,
  getAnimationProps,
}: {
  header: string;
  description1: string;
  description2: string;
  getAnimationProps: (delay: number) => AnimationProps;
}) => (
  <>
    <motion.h1 className="text-xl sm:text-2xl md:text-4xl m-2 sm:m-4 font-bold text-center px-2 sm:px-4" {...getAnimationProps(0)}>
      {header}
    </motion.h1>
    <p className="flex flex-col text-center gap-2 z-10 px-4 sm:px-8 max-w-[90vw] sm:max-w-2xl">
      <motion.span
        className="text-xs sm:text-sm md:text-base font-bold font-mono"
        {...getAnimationProps(2)}
      >
        {description1}
      </motion.span>
      <motion.span
        className="text-xs sm:text-sm md:text-base z-10 font-bold font-mono"
        {...getAnimationProps(4)}
      >
        {description2}
      </motion.span>
    </p>
  </>
);