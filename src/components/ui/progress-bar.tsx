"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  duration?: number;
  complete?: boolean;
  width?: string;
  height?: string;
  bgColor?: string;
  fillColor?: string;
}

/**
 * A reusable animated progress bar component.
 * Used primarily for the intro loading animation.
 */
export const ProgressBar = ({
  duration = 5,
  complete = false,
  width = "w-32",
  height = "h-2",
  bgColor = "bg-gray-700",
  fillColor = "bg-green-400",
}: ProgressBarProps) => {
  return (
    <motion.div
      className={`${width} ${height} ${bgColor} rounded-full overflow-hidden`}
      initial={{ opacity: complete ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={`h-full ${fillColor} rounded-full`}
        initial={{ width: complete ? "100%" : "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: complete ? 0 : duration, ease: "linear" }}
      />
    </motion.div>
  );
}; 