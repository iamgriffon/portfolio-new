"use client";

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
import { DoomIframe } from "@/components/doom/doom-iframe";
import { TVWrapper } from "@/components/doom/tv-wrapper";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { FaInfoCircle } from "react-icons/fa";

export default function DoomPage() {
  const t = useTranslations("main.doom");

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="font-mono"
      >
        <main className="container mx-auto pt-8 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Alert className="bg-destructive/20 border-destructive/30 mb-6">
                <FaInfoCircle className="h-4 w-4 text-white fill-white" />
                <AlertDescription className="text-white font-medium tracking-wide">
                  {t("browserSupport")}
                </AlertDescription>
              </Alert>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <motion.div
                className="col-span-1 md:col-span-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <Card className="overflow border-muted backdrop-blur-sm bg-card/60">
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
                    <div className="text-sm text-gray-50 uppercase tracking-wide">
                      {t("poweredBy")}
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
              <motion.div
                className="col-span-1 rounded-lg"
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
                  borderColor: "#4ade80",
                }}
              >
                <Card className="backdrop-blur-sm bg-slate-600/60 border-muted h-full">
                  <section className="flex flex-col gap-2 py-1 items-center bg-slate-600/60 border-b border-border m-0">
                    <CardTitle className="text-xl font-bold tracking-wide">
                      {t("gameControls")}
                    </CardTitle>
                    <CardDescription className="text-gray-50 font-medium tracking-wide p-2 text-center">
                      {t("controlsDescription")}
                    </CardDescription>
                  </section>
                  <CardContent className="overflow-y-auto max-h-[350px] md:max-h-none">
                    <div className="space-y-5 py-2">
                      <div className="border-l-2 border-primary bg-muted/20 p-3">
                        <h3 className="font-bold mb-2 text-primary uppercase tracking-wide text-sm">
                          {t("movement")}
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex justify-between items-center">
                            <span className="bg-muted px-3 py-1 rounded text-xs min-w-[80px] text-primary">
                              W / ↑
                            </span>
                            <span className="text-gray-50 text-sm flex-1 ml-3">
                              {t("moveForward")}
                            </span>
                          </li>
                          <li className="flex justify-between items-center">
                            <span className="bg-muted px-3 py-1 rounded text-xs min-w-[80px] text-primary">
                              S / ↓
                            </span>
                            <span className="text-gray-50 text-sm flex-1 ml-3">
                              {t("moveBackward")}
                            </span>
                          </li>
                          <li className="flex justify-between items-center">
                            <span className="bg-muted px-3 py-1 rounded text-xs min-w-[80px] text-primary">
                              A / ←
                            </span>
                            <span className="text-gray-50 text-sm flex-1 ml-3">
                              {t("strafeLeft")}
                            </span>
                          </li>
                          <li className="flex justify-between items-center">
                            <span className="bg-muted px-3 py-1 rounded text-xs min-w-[80px] text-primary">
                              D / →
                            </span>
                            <span className="text-gray-50 text-sm flex-1 ml-3">
                              {t("strafeRight")}
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="border-l-2 border-primary bg-muted/20 p-3">
                        <h3 className="font-bold mb-2 text-primary uppercase tracking-wide text-sm">
                          {t("actions")}
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex justify-between items-center">
                            <span className="bg-muted px-3 py-1 rounded text-xs font-mono min-w-[80px] text-primary">
                              Mouse
                            </span>
                            <span className="text-gray-50 text-sm flex-1 ml-3">
                              {t("mouseAim")}
                            </span>
                          </li>
                          <li className="flex justify-between items-center">
                            <span className="bg-muted px-3 py-1 rounded text-xs font-mono min-w-[80px] text-primary">
                              Left Click
                            </span>
                            <span className="text-gray-50 text-sm flex-1 ml-3">
                              {t("leftClickShoot")}
                            </span>
                          </li>
                          <li className="flex justify-between items-center">
                            <span className="bg-muted px-3 py-1 rounded text-xs font-mono min-w-[80px] text-primary">
                              Space
                            </span>
                            <span className="text-gray-50 text-sm flex-1 ml-3">
                              {t("useAction")}
                            </span>
                          </li>
                          <li className="flex justify-between items-center">
                            <span className="bg-muted px-3 py-1 rounded text-xs font-mono min-w-[80px] text-primary">
                              1-9
                            </span>
                            <span className="text-gray-50 text-sm flex-1 ml-3">
                              {t("weaponSelect")}
                            </span>
                          </li>
                          <li className="flex justify-between items-center">
                            <span className="bg-muted px-3 py-1 rounded text-xs font-mono min-w-[80px] text-primary">
                              Ctrl
                            </span>
                            <span className="text-gray-50 text-sm flex-1 ml-3">
                              {t("fire")}
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="border-l-2 border-primary bg-muted/20 p-3">
                        <h3 className="font-bold mb-2 text-primary uppercase tracking-wide text-sm">
                          {t("gameOptions")}
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex justify-between items-center">
                            <span className="bg-muted px-3 py-1 rounded text-xs font-mono min-w-[80px] text-primary">
                              Esc
                            </span>
                            <span className="text-gray-50 text-sm flex-1 ml-3">
                              {t("menu")}
                            </span>
                          </li>
                          <li className="flex justify-between items-center">
                            <span className="bg-muted px-3 py-1 rounded text-xs font-mono min-w-[80px] text-primary">
                              F1
                            </span>
                            <span className="text-gray-50 text-sm flex-1 ml-3">
                              {t("help")}
                            </span>
                          </li>
                          <li className="flex justify-between items-center">
                            <span className="bg-muted px-3 py-1 rounded text-xs font-mono min-w-[80px] text-primary">
                              F2
                            </span>
                            <span className="text-gray-50 text-sm flex-1 ml-3">
                              {t("save")}
                            </span>
                          </li>
                          <li className="flex justify-between items-center">
                            <span className="bg-muted px-3 py-1 rounded text-xs font-mono min-w-[80px] text-primary">
                              F10
                            </span>
                            <span className="text-gray-50 text-sm flex-1 ml-3">
                              {t("quit")}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-border bg-muted/20 px-6 py-3 flex flex-col items-start">
                    <p className="text-sm text-gray-50 mb-3 font-mono uppercase tracking-wide">
                      {t("troubleshooting")}
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="font-medium"
                      onClick={() => {
                        const iframe = document.querySelector(
                          "iframe"
                        ) as HTMLIFrameElement;
                        if (iframe) {
                          iframe.src = iframe.src; // Reload the iframe
                        }
                      }}
                    >
                      {t("refreshGame")}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </div>
        </main>
      </motion.div>
    </>
  );
}
