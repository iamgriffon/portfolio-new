"use client";

import React from "react";
import { motion } from "framer-motion";
import { BrowserSupportAlert } from "@/components/doom/browser-support-alert";
import { GameCard } from "@/components/doom/game-card";
import { GameControls } from "@/components/doom/game-controls";

export default function DoomPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="font-mono"
    >
      <main className="container mx-auto px-4 pb-40 md:px-6">
        <div className="max-w-7xl mx-auto">
          <BrowserSupportAlert />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <GameCard />
            <GameControls />
          </div>
        </div>
      </main>
    </motion.div>
  );
}
