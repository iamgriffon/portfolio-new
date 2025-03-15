"use client";

import { motion } from "framer-motion";
import { FaEye } from "react-icons/fa";

interface ToggleMenuButtonProps {
  onClick: () => void;
  buttonText: string;
  interactive?: boolean;
}

/**
 * A reusable toggle menu button component.
 * Used to show/hide the main menu.
 */
export const ToggleMenuButton = ({
  onClick,
  buttonText,
  interactive = true,
}: ToggleMenuButtonProps) => {
  if (!interactive) {
    return (
      <motion.div
        className="group mt-8 bg-slate-800/80 border-2 border-white rounded-lg px-6 py-3 overflow-hidden z-10 opacity-70"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ duration: 1, delay: 6 }}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 flex-shrink-0 border-2 border-white/50 rounded-full flex items-center justify-center mr-3 font-bold">
            <FaEye />
          </div>
          <span className="font-mono">{buttonText}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.button
      className="group mt-8 bg-slate-800/80 border-2 border-white rounded-lg px-6 py-3 overflow-hidden z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      onClick={onClick}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
        borderColor: "#4ade80",
      }}
      title={buttonText}
    >
      <div className="flex items-center">
        <div className="group-hover:bg-white/10 group-hover:border-green-400 transition-all duration-500 delay-200 w-8 h-8 flex-shrink-0 border-2 border-white/50 rounded-full flex items-center justify-center mr-3 font-bold">
          <FaEye />
        </div>
        <span className="group-hover:text-green-400 transition-all duration-300 font-mono">
          {buttonText}
        </span>
      </div>
    </motion.button>
  );
}; 