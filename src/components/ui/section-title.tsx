"use client";

import { ReactNode } from "react";

interface SectionTitleProps {
  title: ReactNode;
  animate?: boolean;
  className?: string;
}

/**
 * A reusable section title component with the signature glowing green style.
 * Used throughout the application for consistent heading styling.
 */
export const SectionTitle = ({
  title,
  animate = true,
  className = "",
}: SectionTitleProps) => {
  return (
    <section className="text-center mb-8">
      <h2
        className={`text-3xl font-bold mb-4 text-green-400 tracking-wider ${
          animate ? "animate-bounce duration-500" : ""
        } ${className}`}
        style={{
          textShadow:
            "0 0 10px rgba(74, 222, 128, 0.5), 0 0 20px rgba(74, 222, 128, 0.3)",
        }}
      >
        {title}
      </h2>
      <div className="h-2 w-32 bg-green-500 mx-auto rounded-full"></div>
    </section>
  );
}; 