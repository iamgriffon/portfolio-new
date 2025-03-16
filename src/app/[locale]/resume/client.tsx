"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  FaBriefcase,
  FaGraduationCap,
  FaChevronUp,
} from "react-icons/fa";
import { JobHistoryItem, EducationItem } from "./types";
import { ResumeCard } from "@/components/resume/resume-card";
import { cn } from "@/lib/utils";

interface ResumeClientProps {
  jobHistory: JobHistoryItem[];
  education: EducationItem[];
}

export default function ResumeClient({
  jobHistory,
  education,
}: ResumeClientProps) {
  const t = useTranslations("main");
  const [activeTab, setActiveTab] = useState<"jobs" | "education">("jobs");
  const [expandedCardIds, setExpandedCardIds] = useState<number[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const jobs = jobHistory.map((job) => ({
    ...job,
    image_url: job.image_url || null,
    description: {
      en: job.en_position,
      "pt-BR": job.ptbr_position,
      zh: job.zh_position,
    },
  }));

  const educations = education.map((edu) => ({
    ...edu,
    image_url: edu.image_url || null,
    description: {
      en: edu.en_description,
      "pt-BR": edu.ptbr_description,
      zh: edu.zh_description,
    },
    degree: {
      en: edu.en_degree,
      "pt-BR": edu.ptbr_degree,
      zh: edu.zh_degree,
    },
  }));

  const activeItems = useMemo(() => {
    return activeTab === "jobs" ? jobs : educations;
  }, [activeTab, jobs, educations]);

  const toggleCard = (id: number) => {
    setExpandedCardIds((prevIds) => {
      if (prevIds.includes(id)) {
        return prevIds.filter((cardId) => cardId !== id);
      }
      return [...prevIds, id];
    });
  };

  const expandAllCards = () => {
    const allIds = activeItems.map((item) => item.id);
    setExpandedCardIds(allIds);
    setIsExpanded(true);
  };

  const collapseAllCards = () => {
    setExpandedCardIds([]);
    setIsExpanded(false);
  };

  const handleToggleTab = (tab: "jobs" | "education") => {
    setExpandedCardIds([]);
    setActiveTab(tab);
    setIsExpanded(false);
  };

  const renderJobHistory = () => {
    if (jobHistory.length === 0) {
      return <p className="text-center text-gray-400">No job history found</p>;
    }

    return (
      <div className="space-y-6">
        {jobs.map((job) => (
          <ResumeCard
            key={job.id}
            id={job.id}
            title={
              job.description[
                t("language.current") as keyof typeof job.description
              ]
            }
            subtitle={job.company}
            startDate={job.start_date}
            endDate={job.end_date}
            image_url={job.image_url}
            details={[
              {
                label: t("resume.technologies"),
                content: job.technologies,
              },
            ]}
            url={job.url}
            isExpanded={expandedCardIds.includes(job.id)}
            onToggle={toggleCard}
            visitText={t("resume.visitWebsite")}
          />
        ))}
      </div>
    );
  };

  const renderEducation = () => {
    if (education.length === 0) {
      return (
        <p className="text-center text-gray-400">No education history found</p>
      );
    }

    return (
      <div className="space-y-6">
        {educations.map((edu) => (
          <ResumeCard
            key={edu.id}
            id={edu.id}
            title={`${
              edu.degree[t("language.current") as keyof typeof edu.degree]
            }`}
            subtitle={edu.institution}
            startDate={edu.start_date}
            endDate={edu.end_date}
            image_url={edu.image_url}
            details={[
              {
                label: t("resume.achievements"),
                content: edu.achievements,
              },
              {
                label: t("resume.technologies"),
                content: edu.technologies,
              },
            ]}
            url={edu.degree_url}
            isExpanded={expandedCardIds.includes(edu.id)}
            onToggle={toggleCard}
            visitText={t("resume.seeCertificate")}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="text-white z-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 bg-slate-800/50 p-4 rounded-lg backdrop-contrast-100">
          <div className="flex border-b border-gray-700">
            <button
              className={`flex-1 py-3 px-4 text-center font-mono text-lg transition-colors ${
                activeTab === "jobs"
                  ? "text-green-400 border-b-2 border-green-400"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => handleToggleTab("jobs")}
            >
              <span className="flex items-center justify-center gap-2">
                <FaBriefcase /> {t("resume.experience")}
              </span>
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center font-mono text-lg transition-colors ${
                activeTab === "education"
                  ? "text-green-400 border-b-2 border-green-400"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => handleToggleTab("education")}
            >
              <span className="flex items-center justify-center gap-2">
                <FaGraduationCap /> {t("resume.education")}
              </span>
            </button>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() =>
                isExpanded ? collapseAllCards() : expandAllCards()
              }
              className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 rounded-md transition-colors cursor-pointer"
            >
              <FaChevronUp
                size={12}
                className={cn(
                  "transition-all duration-300 rotate-180",
                  isExpanded && "rotate-0"
                )}
              />{" "}
              {isExpanded ? t("resume.collapseAll") : t("resume.expandAll")}
            </button>
          </div>

          <div className="pt-6">
            {activeTab === "jobs" ? renderJobHistory() : renderEducation()}
          </div>
        </div>
      </div>
    </div>
  );
}
