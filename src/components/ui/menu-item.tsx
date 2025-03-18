"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import Link from "next/link";
import { MenuItemProps } from "./types";

const MenuItemWrapper = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <motion.div
      className="group backdrop-blur-sm bg-slate-800/80 border-2 border-white rounded-lg overflow-hidden"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
        borderColor: "#4ade80",
      }}
    >
      {children}
    </motion.div>
  );
};

const MenuItemContent = ({
  title,
  description,
  icon,
  withArrow,
}: MenuItemProps) => {
  return (
    <div className="px-3 sm:px-6 py-3 sm:py-5 flex items-center">
      <div className="group-hover:bg-white/10 group-hover:border-green-400 transition-all duration-500 delay-200 w-7 h-7 sm:w-10 sm:h-10 flex-shrink-0 border-2 border-white/50 rounded-full flex items-center justify-center mr-2 sm:mr-4 text-sm sm:text-base">
        {icon}
      </div>
      <div className="flex-grow overflow-hidden">
        <h3
          className="group-hover:text-green-400 transition-all duration-500 delay-200 text-sm sm:text-lg md:text-2xl font-bold tracking-wide text-white truncate"
          style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.6)" }}
        >
          {title}
        </h3>
        {description && (
          <p className="text-gray-300 mt-0.5 sm:mt-1 font-mono text-xs sm:text-sm truncate">
            {description.toLocaleUpperCase()}
          </p>
        )}
      </div>
      {withArrow && <div className="text-green-400 text-base sm:text-lg md:text-2xl ml-1 sm:ml-2 flex-shrink-0">➔</div>}
    </div>
  );
};

/**
 * A reusable menu item component that can be used in both interactive and non-interactive states.
 * Used throughout the application for consistent styling and behavior.
 */
export const MenuItem = ({
  title,
  description,
  icon,
  onClick,

  interactive = true,
  withArrow = true,
  href = undefined,
}: MenuItemProps) => {
  if (!interactive) {
    return (
      <motion.div
        className="group bg-slate-800/80 border-2 border-white rounded-lg overflow-hidden opacity-70"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 0.7 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <MenuItemContent
          title={title}
          description={description}
          icon={icon}
          withArrow={withArrow}
        />
      </motion.div>
    );
  }

  if (href) {
    return (
      <MenuItemWrapper>
        <Link href={href} title={title} className="w-full text-left block">
          <MenuItemContent
            title={title}
            description={description}
            icon={icon}
            withArrow={withArrow}
          />
        </Link>
      </MenuItemWrapper>
    );
  }

  return (
    <MenuItemWrapper>
      <button
        onClick={onClick}
        className="w-full text-left block cursor-pointer"
        title={title}
      >
        <MenuItemContent
          title={title}
          description={description}
          icon={icon}
          withArrow={withArrow}
        />
      </button>
    </MenuItemWrapper>
  );
};
