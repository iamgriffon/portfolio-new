"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TVWrapperProps {
  children: ReactNode;
  className?: string;
}

export function TVWrapper({ children, className }: TVWrapperProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-b from-gray-400 to-white shadow-xl border-t border-gray-700 p-2 md:p-5">
        <div className="bg-black rounded-md overflow-hidden relative w-full">
          <div className="absolute inset-0 pointer-events-none z-[1] bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px]"></div>
          <div className="absolute inset-0 pointer-events-none z-[1] bg-[radial-gradient(ellipse_at_top_right,rgba(200,200,255,0.15),transparent_70%)]"></div>
          <div className="relative z-[2] w-full h-full">{children}</div>
        </div>

        <div className="absolute bottom-1 right-2 flex space-x-1">
          <div className="w-3 h-3 rounded-full bg-red-600"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>

        <div className="absolute bottom-1 left-2 text-gray-500 font-bold text-xs">
          DOOM-TV
        </div>
      </div>

      <div className="h-4 mx-auto w-1/3 bg-gradient-to-b from-gray-400 to-white rounded-b-lg"></div>
    </div>
  );
}
