"use client";

import { useMemo } from "react";
import TechCard, { type Tech } from "./tech-card";

interface TechGridProps {
  techs: Tech[];
  searchQuery: string;
  selectedTech: Tech | null;
  stack: Tech[];
  isReady: boolean;
  onSelectTech: (tech: Tech) => void;
  onAddToStack: (tech: Tech) => void;
  onRemoveFromStack: (techId: string) => void;
  onDragStart: (tech: Tech) => void;
  onDragEnd: () => void;
}

export default function TechGrid({
  techs,
  searchQuery,
  selectedTech,
  stack,
  isReady,
  onSelectTech,
  onAddToStack,
  onRemoveFromStack,
  onDragStart,
  onDragEnd,
}: TechGridProps) {
  // Filter techs based on search query
  const filteredTechs = useMemo(() => {
    if (!searchQuery.trim()) return techs;

    const query = searchQuery.toLowerCase();
    return techs.filter(
      (tech) =>
        tech.name.toLowerCase().includes(query) ||
        tech.id.toLowerCase().includes(query) ||
        stack.find((t) => t.id === tech.id)
    );
  }, [techs, searchQuery, stack]);

  return (
    <div className="mb-10 relative">
      <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <div className="grid grid-rows-2 grid-flow-col gap-4 min-w-full w-max p-4">
          {filteredTechs.map((tech, index) => (
            <TechCard
              key={tech.id}
              tech={tech}
              index={index}
              isSelected={selectedTech?.id === tech.id}
              isInStack={stack.some((t) => t.id === tech.id)}
              isReady={isReady}
              onSelect={onSelectTech}
              onAddToStack={onAddToStack}
              onRemoveFromStack={onRemoveFromStack}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))}
        </div>
      </div>
      {filteredTechs.length >= 10 && (
        <>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-gray-900 to-transparent w-12 h-full pointer-events-none" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-gray-900 to-transparent w-12 h-full pointer-events-none" />
        </>
      )}
    </div>
  );
} 