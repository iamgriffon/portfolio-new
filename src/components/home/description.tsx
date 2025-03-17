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
    <motion.h1 className="text-4xl m-4 font-bold" {...getAnimationProps(0)}>
      {header}
    </motion.h1>
    <p className="flex flex-col text-center gap-2 z-10">
      <motion.span
        className="text-base font-bold font-mono"
        {...getAnimationProps(2)}
      >
        {description1}
      </motion.span>
      <motion.span
        className="text-base z-10 font-bold font-mono"
        {...getAnimationProps(4)}
      >
        {description2}
      </motion.span>
    </p>
  </>
);