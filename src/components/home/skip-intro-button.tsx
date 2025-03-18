"use client";

import { motion } from "framer-motion";
import { FaFastForward } from "react-icons/fa";

interface SkipIntroButtonProps {
  onSkip: () => void;
  skipText: string;
}

/**
 * A reusable skip intro button component.
 * Displayed during intro animations to allow users to skip them.
 */
export const SkipIntroButton = ({ onSkip, skipText }: SkipIntroButtonProps) => {
  return (
    <motion.button
      className="relative text-green-400 hover:text-green-300 z-50 mt-3 sm:mt-4 flex items-center gap-2 cursor-pointer font-bold bg-slate-800/80 border border-white rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-slate-700/80 transition-colors"
      onClick={onSkip}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <FaFastForward className="text-green-400 text-xs sm:text-sm" />
      <span className="font-mono text-xs sm:text-sm">{skipText}</span>
    </motion.button>
  );
}; 