import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { ControlSectionProps } from "./types";

function ControlSection({
  title,
  controls,
  noBorder = false,
}: ControlSectionProps) {
  return (
    <div className={`${!noBorder ? "border-b-2 border-gray-50" : ""} p-3`}>
      <h3 className="font-bold text-gray-50 mb-2 uppercase tracking-wide text-sm">
        {title}
      </h3>
      <ul className="space-y-2 pb-4">
        {controls.map((control, index) => (
          <li key={index} className="flex justify-between items-center">
            <span className="bg-muted px-3 py-1 rounded text-xs min-w-[80px] text-primary">
              {control.key}
            </span>
            <span className="text-gray-50 text-sm flex-1 ml-3">
              {control.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GameControls() {
  const t = useTranslations("main.doom");

  return (
    <motion.div
      className="col-span-1 rounded-lg"
      whileHover={{
        boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
        borderColor: "#4ade80",
      }}
    >
      <Card className="backdrop-blur-sm border-muted h-full">
        <section className="flex flex-col gap-2 py-1 items-center border-b pb-4 border-border m-0">
          <CardTitle className="text-xl text-gray-50 font-bold tracking-wide">
            {t("gameControls")}
          </CardTitle>
          <CardDescription className="text-gray-50 font-medium tracking-wide p-2 px-4 text-center">
            {t("controlsDescription")}
          </CardDescription>
        </section>
        <CardContent className="overflow-y-auto max-h-[350px] md:max-h-none">
          <div className="space-y-5 py-2">
            <ControlSection
              title={t("movement")}
              controls={[
                { key: "W / ↑", description: t("moveForward") },
                { key: "S / ↓", description: t("moveBackward") },
                { key: "A / ←", description: t("strafeLeft") },
                { key: "D / →", description: t("strafeRight") },
              ]}
            />

            <ControlSection
              title={t("actions")}
              controls={[
                { key: "Mouse", description: t("mouseAim") },
                { key: "Left Click", description: t("leftClickShoot") },
                { key: "Space", description: t("useAction") },
                { key: "1-9", description: t("weaponSelect") },
                { key: "Ctrl", description: t("fire") },
              ]}
            />

            <ControlSection
              title={t("gameOptions")}
              controls={[
                { key: "Esc", description: t("menu") },
                { key: "F1", description: t("help") },
                { key: "F2", description: t("save") },
                { key: "F10", description: t("quit") },
              ]}
              noBorder
            />
          </div>
        </CardContent>
        <CardFooter className="border-t border-border bg-muted/20 px-6 py-3 flex flex-col items-start">
          <p className="text-sm text-gray-50 mb-3 font-mono uppercase tracking-wide">
            {t("troubleshooting")}
          </p>
          <Button
            variant="destructive"
            size="sm"
            className="font-medium cursor-pointer hover:bg-destructive/80 hover:scale-105 transition-all duration-300"
            onClick={() => {
              const iframe = document.querySelector(
                "iframe"
              ) as HTMLIFrameElement;
              if (iframe) {
                iframe.src = iframe.src;
              }
            }}
          >
            {t("refreshGame")}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
