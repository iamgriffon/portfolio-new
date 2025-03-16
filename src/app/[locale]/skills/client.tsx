"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  TechGrid,
  TechDetail,
  StackBuilder,
  SearchBar,
  type Tech,
} from "@/components/skills";
import { SectionTitle } from "@/components/ui";

interface TechSelectionProps {
  techs: Tech[];
}

// LocalStorage keys
const STACK_STORAGE_KEY = "skills-stack";

export default function TechSelection({ techs }: TechSelectionProps) {
  const [selectedTech, setSelectedTech] = useState<Tech | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [stack, setStack] = useState<Tech[]>([]);
  const [draggedTech, setDraggedTech] = useState<Tech | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const t = useTranslations("main");

  // Load stack from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);

    try {
      const savedStack = localStorage.getItem(STACK_STORAGE_KEY);
      if (savedStack) {
        const savedStackIds = JSON.parse(savedStack) as string[];
        const restoredStack = techs.filter((tech) =>
          savedStackIds.includes(tech.id)
        );
        setStack(restoredStack);
      }
    } catch (error) {
      console.error("Failed to parse saved stack:", error);
    }

    return () => clearTimeout(timer);
  }, [techs]);

  // Save stack to localStorage whenever it changes
  useEffect(() => {
    // Make sure we're running in the browser
    if (typeof window === "undefined" || !isReady) {
      return;
    }

    try {
      const stackIds = stack.map((tech) => tech.id);
      localStorage.setItem(STACK_STORAGE_KEY, JSON.stringify(stackIds));
    } catch (error) {
      console.error("Failed to save stack to localStorage:", error);
    }
  }, [stack, isReady]);

  const handleSelectTech = (tech: Tech) => {
    if (selectedTech?.id === tech.id) {
      setSelectedTech(null);
      return;
    }

    setSelectedTech(tech);
  };

  const handleAddToStack = (tech: Tech) => {
    if (stack.find((t) => t.id === tech.id)) {
      return setStack(stack.filter((t) => t.id !== tech.id));
    }

    setStack([...stack, tech]);
  };

  const handleRemoveFromStack = (techId: string) => {
    setStack(stack.filter((tech) => tech.id !== techId));
  };

  const handleDragStart = (tech: Tech) => {
    setDraggedTech(tech);
  };

  const handleDragEnd = () => {
    setDraggedTech(null);
  };

  const handleDrop = () => {
    if (draggedTech && !stack.some((t) => t.id === draggedTech.id)) {
      setStack([...stack, draggedTech]);
    }
  };

  const clearStack = () => {
    setStack([]);
  };

  return (
    <div className="w-screen h-full mb-15 px-4 overflow-y-auto text-white">
      <SectionTitle title={t("skills.selectTech")} />
      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <TechGrid
        techs={techs}
        searchQuery={searchQuery}
        selectedTech={selectedTech}
        stack={stack}
        isReady={isReady}
        onSelectTech={handleSelectTech}
        onAddToStack={handleAddToStack}
        onRemoveFromStack={handleRemoveFromStack}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
      <AnimatePresence>
        {selectedTech && (
          <TechDetail
            tech={selectedTech}
            isInStack={stack.some((t) => t.id === selectedTech.id)}
            onClose={() => setSelectedTech(null)}
            onAddToStack={handleAddToStack}
          />
        )}
      </AnimatePresence>

      <StackBuilder
        stack={stack}
        onStackChange={setStack}
        onRemoveFromStack={handleRemoveFromStack}
        onClearStack={clearStack}
        onDrop={handleDrop}
      />
    </div>
  );
}
