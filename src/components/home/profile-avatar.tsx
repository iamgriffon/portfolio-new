import { AnimationProps, motion } from "framer-motion";

export const ProfileAvatar = ({
  animationProps,
}: {
  animationProps: AnimationProps;
}) => (
  <a href="https://github.com/iamgriffon" target="_blank" className="z-10">
    <motion.img
      src="https://github.com/iamgriffon.png"
      alt="logo"
      className="w-20 h-20 sm:w-24 sm:h-24 z-10 rounded-full"
      {...animationProps}
    />
  </a>
);