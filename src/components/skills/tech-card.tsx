"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaPlus, FaTimes } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export type Tech = {
  id: string;
  name: string;
  icon: string;
  level: number;
  years: number;
};

interface TechCardProps {
  tech: Tech;
  isSelected: boolean;
  isInStack: boolean;
  index: number;
  isReady: boolean;
  onSelect: (tech: Tech) => void;
  onAddToStack: (tech: Tech) => void;
  onRemoveFromStack: (techId: string) => void;
  onDragStart: (tech: Tech) => void;
  onDragEnd: () => void;
}

export default function TechCard({
  tech,
  isSelected,
  isInStack,
  index,
  isReady,
  onSelect,
  onAddToStack,
  onRemoveFromStack,
  onDragStart,
  onDragEnd,
}: TechCardProps) {
  const t = useTranslations("main");
  const [isHovered, setIsHovered] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // Set data transfer to ensure drag works across browsers
    e.dataTransfer.setData("text/plain", tech.id);
    e.dataTransfer.effectAllowed = "move";

    onDragStart(tech);
  };

  return (
    <motion.div
      key={tech.id}
      className={cn(
        "relative cursor-pointer rounded-lg overflow-hidden border-4 w-48",
        isSelected
          ? "border-blue-500/80 shadow-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10 shadow-blue-500/30 z-10 hover:shadow-lg hover:shadow-blue-500/30"
          : isInStack
          ? "shadow-md shadow-green-500/20 border-green-500/70 bg-gradient-to-br from-green-500/20 to-green-500/10"
          : "border-gray-700 z-0",
        isHovered && "shadow-lg shadow-white/30 border-white/80"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isReady ? 1 : 0,
        y: isReady ? 0 : 20,
      }}
      transition={{
        delay: isReady ? 0.05 * index : 0,
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.8,
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
      }}
      onClick={() => onSelect(tech)}
      onDoubleClick={() => onAddToStack(tech)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative backdrop-blur-sm p-4 h-48 flex flex-col items-center justify-center"
        onDragStart={handleDragStart}
        draggable
        onDragEnd={onDragEnd}
      >
        <div className="relative w-20 h-20 mb-3">
          <Image
            src={tech.icon}
            alt={tech.name}
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <h3 className="text-center font-bold text-lg">{tech.name}</h3>
        <div className="w-full mt-3 bg-gray-700 rounded-full h-2.5">
          <motion.div
            className="bg-primary h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${tech.level}%` }}
            transition={{
              delay: isReady ? 0.05 * index + 0.3 : 0,
              duration: 0.8,
            }}
          />
        </div>
        <span className="text-xs mt-2 text-gray-300">
          {tech.years} {tech.years === 1 ? t("skills.year") : t("skills.years")}
        </span>
      </div>

      <motion.button
        className={cn(
          "absolute top-0 right-0 bg-green-500 text-black font-bold px-2 py-1 text-xs transition-colors",
          isInStack && "bg-red-500/80"
        )}
        onClick={(e) => {
          e.stopPropagation(); // Prevent card selection when clicking the button
          if (isInStack) {
            onRemoveFromStack(tech.id);
            return;
          }

          onAddToStack(tech);
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        title={isInStack ? t("skills.removeFromStack") : t("skills.addToStack")}
        aria-label={
          isInStack ? t("skills.removeFromStack") : t("skills.addToStack")
        }
      >
        {isInStack ? <FaTimes /> : <FaPlus />}
      </motion.button>
    </motion.div>
  );
}
