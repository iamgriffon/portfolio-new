"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { type Tech } from "./tech-card";

interface TechDetailProps {
  tech: Tech;
  isInStack: boolean;
  onClose: () => void;
  onAddToStack: (tech: Tech) => void;
}

export default function TechDetail({
  tech,
  isInStack,
  onClose,
  onAddToStack,
}: TechDetailProps) {
  const t = useTranslations("main");

  return (
    <motion.div
      key="selected-tech-card"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="mt-4 mb-10 p-8 rounded-lg bg-gray-800/70 backdrop-blur-sm shadow-2xl border-2 border-primary/30 max-w-4xl mx-auto relative"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div className="flex flex-col md:flex-row items-center gap-8">
        <motion.div
          className="relative w-32 h-32 bg-gray-700/50 rounded-full p-4 flex items-center justify-center"
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Image
            src={tech.icon}
            alt={tech.name}
            width={80}
            height={80}
            style={{ objectFit: "contain" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-3 border-white/80 select-none hover:border-green-500"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <div className="flex-1">
          <h3 className="text-3xl md:text-4xl font-bold bg-clip-text text-white text-center md:text-left">
            {tech.name}
          </h3>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex items-center mb-1">
                <span className="text-sm font-medium text-gray-300 w-24">
                  {t("skills.skillLevel")}:
                </span>
                <span className="font-bold ml-auto">
                  {tech.level}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <motion.div
                  className="bg-gradient-to-r from-green-500 to-green-500 h-4 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${tech.level}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center mb-1">
                <span className="text-sm font-medium text-gray-300 w-24">
                  {t("skills.experience")}:
                </span>
                <span className="font-bold ml-auto">
                  {tech.years}{" "}
                  {tech.years === 1
                    ? t("skills.year")
                    : t("skills.years")}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <motion.div
                  className="bg-gradient-to-r from-green-500 to-green-500 h-4 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(tech.years * 20, 100)}%`,
                  }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          </div>

          <motion.div
            className="mt-6 text-center md:text-left flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={() => onAddToStack(tech)}
              className={`px-4 py-2 rounded-full cursor-pointer text-sm font-medium ${
                isInStack
                  ? "bg-red-700/50 text-red-200 border border-red-700/30 hover:bg-red-700/30"
                  : "bg-green-500/20 text-green-500 border border-green-500/30 hover:bg-green-500/30"
              }`}
            >
              {isInStack
                ? t("skills.removeFromStack")
                : t("skills.addToStack")}
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
} 