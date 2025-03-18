"use client";
import { SectionTitleProps } from "../types";

/**
 * A reusable section title component with the signature glowing green style.
 * Used throughout the application for consistent heading styling.
 */
export const SectionTitle = ({
  title,
  animate = true,
  className = "",
  withoutBar = false,
}: SectionTitleProps) => {
  if (!title) {
    return null;
  }
  
  return (
    <section className="text-center flex flex-col items-center">
      <h2
        className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-wider ${
          animate ? "animate-bounce duration-500 pt-2" : ""
        } ${className}`}
        style={{
          textShadow:
            "0 0 10px rgba(74, 222, 128, 0.5), 0 0 20px rgba(74, 222, 128, 0.3)",
        }}
      >
        {String(title)?.toUpperCase()}
      </h2>
      {!withoutBar && (
        <div className="h-1 sm:h-2 w-16 sm:w-20 md:w-32 mt-2 sm:mt-4 bg-green-500 mx-auto rounded-full border-2 border-white mb-4 sm:mb-6 md:mb-10"></div>
      )}
    </section>
  );
};
