"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, Reorder } from "framer-motion";
import { useTranslations } from "next-intl";
import { ranks } from "@/app/[locale]/skills/ranks";
import { type Tech } from "./tech-card";
import StackAssessment from "./stack-assessment";
import { SectionTitle } from "../ui";

interface StackBuilderProps {
  stack: Tech[];
  onStackChange: (stack: Tech[]) => void;
  onRemoveFromStack: (techId: string) => void;
  onClearStack: () => void;
  onDrop: () => void;
}

export default function StackBuilder({
  stack,
  onStackChange,
  onRemoveFromStack,
  onClearStack,
  onDrop,
}: StackBuilderProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [targetSeniority, setTargetSeniority] = useState("Senior");
  const t = useTranslations("main");

  const avgLevel = stack.length
    ? Math.round(
        stack.reduce((sum, tech) => {
          const yearsScore = Math.min(tech.years * 10, 100);
          const weightedScore = tech.level * 0.6 + yearsScore * 0.4;
          return sum + weightedScore;
        }, 0) / stack.length
      )
    : 0;

  const getSeniorityLevel = (level: number) => {
    return ranks.find((s) => level >= s.min && level <= s.max) || ranks[0];
  };

  const currentSeniority = getSeniorityLevel(avgLevel);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    onDrop();
  };

  return (
    <motion.div
      layoutId="stack-builder-container"
      className="max-w-4xl mx-auto mt-12 mb-20 overflow-visible rounded-xl p-6 border-gray-800 backdrop-blur-sm"
    >
      <SectionTitle title={t("skills.buildStack")} />

      <motion.div
        layoutId="drop-zone"
        className={`
          border-4 border-dashed rounded-lg p-6 mb-6 transition-colors
          min-h-[200px] flex flex-col items-center justify-center
          ${
            isDraggingOver
              ? "border-primary/80 bg-primary/10"
              : "border-gray-700 bg-gray-800/50"
          }
          ${!!stack.length ? "justify-start" : "justify-center"}
        `}
        animate={{
          borderColor: isDraggingOver
            ? "rgba(var(--primary-rgb), 0.8)"
            : "rgba(55, 65, 81, 1)",
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!stack.length ? (
          <div className="text-center">
            <div className="text-5xl mb-4 text-gray-500">👇</div>
            <h3 className="text-xl font-medium mb-2">{t("skills.dropHere")}</h3>
            <p className="text-gray-400 text-sm">
              {t("skills.dragDescription")}
            </p>
          </div>
        ) : (
          <>
            <div className="w-full flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{t("skills.yourStack")}</h3>
              <button
                onClick={onClearStack}
                className="px-3 py-1 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50 transition text-sm font-bold cursor-pointer"
              >
                {t("skills.clearAll")}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
              <Reorder.Group
                values={stack}
                onReorder={onStackChange}
                className="contents"
              >
                {stack.map((tech) => (
                  <Reorder.Item
                    key={tech.id}
                    value={tech}
                    className="bg-gray-700 rounded-lg p-4 flex flex-col items-center relative"
                    whileDrag={{
                      scale: 1.05,
                      boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
                      cursor: "grabbing",
                    }}
                  >
                    <button
                      onClick={() => onRemoveFromStack(tech.id)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-900/70 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition"
                    >
                      ✕
                    </button>
                    <div className="relative w-12 h-12 mb-2">
                      <Image
                        src={tech.icon}
                        alt={tech.name}
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                    <h4 className="text-sm font-medium">{tech.name}</h4>
                    <div className="mt-2 w-full bg-gray-800 rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{ width: `${tech.level}%` }}
                      />
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
          </>
        )}
      </motion.div>

      <motion.p
        layoutId="stack-builder-description"
        className="text-center text-lg text-gray-200 mb-8 max-w-2xl mx-auto"
      >
        {t("skills.dragDropDescription")}
      </motion.p>

      <motion.div layoutId="seniority-selector" className="mb-6">
        <h3 className="text-xl font-semibold text-center mb-4">
          {t("skills.chooseSeniority")}
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {ranks.map((level) => (
            <button
              key={level.label}
              onClick={() => setTargetSeniority(level.label)}
              className={`cursor-pointer px-4 py-2 rounded-lg transition ${
                targetSeniority === level.label
                  ? "bg-primary text-white"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {t(`skills.ranks.${level.label.toLowerCase()}`)}
            </button>
          ))}
        </div>
      </motion.div>

      {!!stack.length && (
        <StackAssessment
          avgLevel={avgLevel}
          currentSeniority={currentSeniority}
          targetSeniority={targetSeniority}
        />
      )}
    </motion.div>
  );
}
