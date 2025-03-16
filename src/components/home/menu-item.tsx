"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MenuItemProps {
  title: string;
  description?: string;
  icon: ReactNode;
  onClick?: () => void;
  index?: number;
  interactive?: boolean;
  withArrow?: boolean;
  }

/**
 * A reusable menu item component that can be used in both interactive and non-interactive states.
 * Used throughout the application for consistent styling and behavior.
 */
export const MenuItem = ({
  title,
  description,
  icon,
  onClick,
  index = 0,
  interactive = true,
  withArrow = true,
}: MenuItemProps) => {
  if (!interactive) {
    return (
      <motion.div
        key={`${title}-${index}`}
        className="group bg-slate-800/80 border-2 border-white rounded-lg overflow-hidden opacity-70"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 0.7 }}
        transition={{ duration: 0.5, delay: 0.2 * index }}
      >
        <div className="w-full text-left block cursor-not-allowed">
          <div className="px-6 py-5 flex items-center">
            <div className="w-10 h-10 flex-shrink-0 border-2 border-white/50 rounded-full flex items-center justify-center mr-4 font-bold">
              {icon}
            </div>
            <div className="flex-grow">
              <h3
                className="text-2xl font-bold tracking-wide text-white"
                style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.6)" }}
              >
                {title}
              </h3>
              {description && (
                <p className="text-gray-300 mt-1 font-mono text-sm">{description}</p>
              )}
            </div>
            {withArrow && <div className="text-green-400 text-2xl">➔</div>}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={`${title}-${index}`}
      className="group bg-slate-800/80 border-2 border-white rounded-lg overflow-hidden"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 * index }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
        borderColor: "#4ade80",
      }}
    >
      <button
        onClick={onClick}
        className="w-full text-left block cursor-pointer"
        title={title}
      >
        <div className="px-6 py-5 flex items-center">
          <div className="group-hover:bg-white/10 group-hover:border-green-400 transition-all duration-500 delay-200 w-10 h-10 flex-shrink-0 border-2 border-white/50 rounded-full flex items-center justify-center mr-4 font-bold">
            {icon}
          </div>
          <div className="flex-grow">
            <h3
              className="group-hover:text-green-400 transition-all duration-500 delay-200 text-2xl font-bold tracking-wide text-white"
              style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.6)" }}
            >
              {title}
            </h3>
            {description && (
              <p className="text-gray-300 mt-1 font-mono text-sm">{description}</p>
            )}
          </div>
          {withArrow && <div className="text-green-400 text-2xl">➔</div>}
        </div>
      </button>
    </motion.div>
  );
}; 