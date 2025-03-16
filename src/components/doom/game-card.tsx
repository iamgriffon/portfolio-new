import React from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { DoomIframe } from "@/components/doom/doom-iframe";
import { TVWrapper } from "@/components/doom/tv-wrapper";
import { motion } from "framer-motion";

export function GameCard() {
  const t = useTranslations("main.doom");

  return (
    <motion.div
      className="col-span-1 md:col-span-2"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.4 }}
    >
      <Card className="overflow border-muted backdrop-blur-sm">
        <CardContent className="flex justify-center p-0">
          <TVWrapper className="p-3 w-full">
            <DoomIframe
              width="100%"
              height="450px"
              className="overflow-hidden md:h-[500px] lg:h-[550px]"
            />
          </TVWrapper>
        </CardContent>
        <CardFooter className="border-t border-border bg-muted/20 px-6 py-3">
          <a
            href="https://github.com/thedoggybrad/doom_on_js-dos"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:text-gray-50 hover:underline text-gray-50 uppercase tracking-wide"
          >
            {t("poweredBy")}
          </a>
        </CardFooter>
      </Card>
    </motion.div>
  );
} 