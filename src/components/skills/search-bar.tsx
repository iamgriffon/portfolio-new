"use client";

import { useTranslations } from "next-intl";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
}: SearchBarProps) {
  const t = useTranslations("main");

  return (
    <div className="max-w-md mx-auto mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder={t("skills.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-gray-800/80 border border-gray-700 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
} 