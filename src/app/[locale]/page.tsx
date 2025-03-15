"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useAnimationState } from "@/components/ui/animation-state-provider";
import { useRouter, useParams } from "next/navigation";
import { useBackgroundState } from "@/components/background/pixel-art-background-provider";
import { sprites } from "@/components/background/pixel-art-background-sprites";
import PixelArtBackground from "@/components/background/pixel-art-background";
import { FaPlay, FaEye, FaEyeSlash } from "react-icons/fa";

// Add a MenuStar type
interface MenuStar {
  id: number;
  size: number;
  top: string;
  left: string;
  opacity: number;
  animationDuration: string;
}

const SPARKLE_COUNT = 10;

interface Sparkle {
  id: number;
  size: number;
  left: string;
  top: string;
  animation: string;
}

export default function Home() {
  const t = useTranslations("main");
  const menuOptions = [
    { title: t("menu.start"), icon: <FaPlay />, action: "start" },
    { title: t("menu.hideMenu"), icon: <FaEyeSlash />, action: "hide" }
  ];
  const [showMenu, setShowMenu] = useState(true);
  const { hasAnimated, setHasAnimated } = useAnimationState();
  const { items, setItems, hasVisitedProjects } = useBackgroundState();
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const hasResetRef = useRef(false);
  const spritePaths = sprites.map((sprite) => sprite.path);

  useEffect(() => {
    if (hasVisitedProjects) {
      setHasAnimated(true);
    } else {
      // Normal animation timing for first visit
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [setHasAnimated, hasVisitedProjects]);

  useEffect(() => {
    if (hasVisitedProjects && items.length > 0 && !hasResetRef.current) {
      hasResetRef.current = true;
      setItems(
        items.map((item) => {
          return {
            ...item,
            scale: 1,
            speedX: (Math.random() - 0.5) * 2.0,
            speedY: (Math.random() - 0.5) * 2.0,
            rotationSpeed: (Math.random() - 0.5) * 0.2,
            targetX: undefined,
            targetY: undefined,
            targetScale: undefined,
          };
        })
      );
    }

    return () => {
      hasResetRef.current = false;
    };
  }, [hasVisitedProjects, setItems]);

  const getAnimationProps = (delay: number) => {
    if (hasAnimated) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        transition: { duration: 0 },
      };
    }

    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 2, delay },
    };
  };

  const getMenuAnimationProps = () => {
    if (hasAnimated) {
      return {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0 },
      };
    }

    return {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 1, delay: 6 },
    };
  };

  const handleMenuOptionClick = (action: string) => {
    if (action === "start") {
      return router.push(`/${params.locale}/about`);
    }
    if (action === "hide") {
      return setShowMenu(false);
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen text-white p-6 z-10">
      <PixelArtBackground
        sprites={spritePaths}
        numberOfSprites={8}
        minVelocity={1.0}
        maxVelocity={3.0}
        withoutBouncing={false}
      >
        <div className="w-full h-full flex flex-col z-10 gap-4 items-center justify-center">
          <a
            href="https://github.com/iamgriffon"
            target="_blank"
            className="z-10"
          >
            <motion.img
              src="https://github.com/iamgriffon.png"
              alt="logo"
              className="w-24 h-24 z-10 rounded-full"
              {...getAnimationProps(0)}
            />
          </a>
          <motion.h1
            className="text-4xl m-4 font-bold"
            {...getAnimationProps(0)}
          >
            {t("header")}
          </motion.h1>
          <p className="flex flex-col text-center gap-2 z-10 shadow-sm">
            <motion.span
              className="text-base font-bold font-mono"
              {...getAnimationProps(2)}
            >
              {t("description1")}
            </motion.span>
            <motion.span
              className="text-base z-10 font-bold font-mono"
              {...getAnimationProps(4)}
            >
              {t("description2")}
            </motion.span>
          </p>
          {showMenu ? (
            <motion.div
              className="mt-8 flex flex-col items-center"
              {...getMenuAnimationProps()}
              ref={menuRef}
            >
              <div className="max-w-md w-full z-10">
                <section className="text-center mb-8">
                  <h2 
                    className="text-3xl font-bold mb-4 text-green-400 tracking-wider animate-bounce duration-500"
                    style={{ textShadow: "0 0 10px rgba(74, 222, 128, 0.5), 0 0 20px rgba(74, 222, 128, 0.3)" }}
                  >
                    {t("menu.title")}
                  </h2>
                  <div className="h-2 w-32 bg-green-500 mx-auto rounded-full"></div>
                </section>
                
                <section className="space-y-4">
                  {menuOptions.map((option, index) => (
                    <motion.div
                      key={index}
                      className="group bg-slate-800/80 border-2 border-white rounded-lg overflow-hidden duration-[1500ms]"
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 * index }}
                      whileHover={{
                        scale: 1.03, 
                        boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
                        borderColor: "#4ade80",
                      }}
                    >
                      <button 
                        onClick={() => handleMenuOptionClick(option.action)}
                        className="w-full text-left block cursor-pointer"
                        title={option.title}
                      >
                        <div className="px-6 py-5 flex items-center">
                          <div
                            className="group-hover:bg-white/10 group-hover:border-green-400 transition-all duration-500 delay-200 w-10 h-10 flex-shrink-0 border-2 border-white/50 rounded-full flex items-center justify-center mr-4 font-bold"
                          >
                            {option.icon}
                          </div>
                          <div className="flex-grow">
                            <h3
                              className="group-hover:text-green-400 transition-all duration-500 delay-200 text-2xl font-bold tracking-wide text-white"
                              style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.6)" }}
                            >
                              {option.title}
                            </h3>
                          </div>
                          <div className="text-green-400 text-2xl">➔</div>
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </section>
                
                <footer className="text-center mt-10 text-sm font-mono text-gray-400">
                  PRESS ENTER TO SELECT · ESC TO CANCEL
                </footer>
              </div>
            </motion.div>
          ) : (
            <motion.button
              className="group mt-8 bg-slate-800/80 border-2 border-white rounded-lg px-6 py-3 overflow-hidden z-10"
              {...getMenuAnimationProps()}
              onClick={() => setShowMenu(true)}
              whileHover={{
                scale: 1.05, 
                boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
                borderColor: "#4ade80"
              }}
              title={t("menu.showMenu")}
            >
              <div className="flex items-center">
                <div
                  className="group-hover:bg-white/10 group-hover:border-green-400 transition-all duration-500 delay-200 w-8 h-8 flex-shrink-0 border-2 border-white/50 rounded-full flex items-center justify-center mr-3 font-bold"
                >
                  <FaEye />
                </div>
                <span className="group-hover:text-green-400 transition-all duration-300 font-mono">
                  {t("menu.showMenu")}
                </span>
              </div>
            </motion.button>
          )}
        </div>
      </PixelArtBackground>
    </div>
  );
}
