"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { type Rank, ranks } from "@/app/[locale]/skills/ranks";

interface StackAssessmentProps {
  avgLevel: number;
  currentSeniority: Rank;
  targetSeniority: string;
}

export default function StackAssessment({
  avgLevel,
  currentSeniority,
  targetSeniority,
}: StackAssessmentProps) {
  const t = useTranslations("main");

  const getRecommendationMessage = (current: Rank, targetLabel: string) => {
    const targetRank = ranks.find(
      (r: Rank) => r.label === targetLabel
    );
    
    if (!targetRank) {
      return t("skills.recommendationLower");
    }
    
    return current.min < targetRank.min
      ? t("skills.recommendationLower")
      : t("skills.recommendationHigher");
  };

  return (
    <motion.div
      layoutId="stack-assessment"
      className="bg-gray-800 rounded-lg p-6 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring" }}
    >
      <h3 className="text-xl font-bold mb-4">
        {t("skills.stackAssessment")}
      </h3>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span>
            {t("skills.averageSkillLevel")}: {avgLevel}%
          </span>
          <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            {t(`skills.ranks.${currentSeniority.label.toLowerCase()}`)}{" "}
            {t("skills.level")}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <motion.div
            className="bg-gradient-to-r from-primary to-secondary h-4 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${avgLevel}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div
          className={`
            flex-1 p-4 rounded-lg border
            ${
              currentSeniority.label === targetSeniority
                ? "bg-green-900/20 border-green-700/30 text-green-400"
                : "bg-amber-900/20 border-amber-700/30 text-amber-400"
            }
          `}
        >
          <h4 className="font-semibold mb-2">
            {t("skills.stackSuitability")}
          </h4>
          <p>
            {currentSeniority.label === targetSeniority
              ? t("skills.stackMatches")
              : t("skills.stackMismatch", {
                  current: t(
                    `skills.ranks.${currentSeniority.label.toLowerCase()}`
                  ),
                  target: t(
                    `skills.ranks.${targetSeniority.toLowerCase()}`
                  ),
                })}
          </p>
        </div>
        <div className="flex-1 p-4 rounded-lg bg-gray-700/50 border border-gray-600/30">
          <h4 className="font-semibold mb-2">
            {t("skills.stackDescription")}
          </h4>
          <p className="text-gray-300">
            {t(
              `skills.ranks.${currentSeniority.label.toLowerCase()}_description`
            )}
          </p>
        </div>
      </div>

      {currentSeniority.label !== targetSeniority && (
        <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
          <h4 className="font-semibold mb-2">
            {t("skills.recommendations")}
          </h4>
          <p className="text-gray-300">
            {getRecommendationMessage(currentSeniority, targetSeniority)}
          </p>
        </div>
      )}
    </motion.div>
  );
} 