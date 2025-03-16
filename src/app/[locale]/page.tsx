"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useAnimationState } from "@/components/background/animation-state-provider";
import { useRouter, useParams } from "next/navigation";
import { useBackgroundState } from "@/components/background/pixel-art-background-provider";
import { sprites } from "@/components/background/pixel-art-background-sprites";
import PixelArtBackground from "@/components/background/pixel-art-background";
import { FaPlay, FaEyeSlash } from "react-icons/fa";
import {
  MenuItem,
  SectionTitle,
  ProgressBar,
  SkipIntroButton,
} from "@/components/ui";
import LanguageSwitcher from "@/components/ui/common/language-switcher";
export default function Home() {
  const t = useTranslations("main");
  const menuOptions = [
    { title: t("menu.start"), icon: <FaPlay />, action: "start" },
    { title: t("menu.hideMenu"), icon: <FaEyeSlash />, action: "hide" },
  ];
  const [showMenu, setShowMenu] = useState(true);
  const { hasAnimated, setHasAnimated } = useAnimationState();
  const { items, setItems, hasVisitedProjects } = useBackgroundState();
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const hasResetRef = useRef(false);
  const spritePaths = sprites.map((sprite) => sprite.path);
  const [skippedIntro, setSkippedIntro] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>(setTimeout(() => {}, 0));

  useEffect(() => {
    if (hasVisitedProjects) {
      setHasAnimated(true);
    } else {
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

  useEffect(() => {
    if (!hasAnimated && !skippedIntro) {
      timeoutRef.current = setTimeout(() => {
        setHasAnimated(true);
      }, 5000);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [hasAnimated, skippedIntro]);

  const getAnimationProps = (delay: number) => {
    if (hasAnimated || skippedIntro) {
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
    if (hasAnimated || skippedIntro) {
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

  const handleSkipIntro = () => {
    clearTimeout(timeoutRef.current);
    setHasAnimated(true);
    setSkippedIntro(true);
  };

  return (
    <div className="flex flex-col w-screen h-screen text-white z-20 overflow-hidden">
      <PixelArtBackground
        sprites={spritePaths}
        numberOfSprites={8}
        minVelocity={1.0}
        maxVelocity={2.5}
        withoutBouncing={false}
      >
        <section className="flex w-full pt-10 justify-end items-center gap-2 container h-auto pb-2 z-20">
          <LanguageSwitcher />
        </section>
        <div className="w-full h-full flex flex-col z-10 gap-4 items-center justify-center pointer-events-auto">
          <a
            href="https://github.com/iamgriffon"
            target="_blank"
            className="z-10"
          >
            <motion.img
              key={`logo-${
                hasAnimated || skippedIntro ? "skipped" : "animated"
              }`}
              src="https://github.com/iamgriffon.png"
              alt="logo"
              className="w-24 h-24 z-10 rounded-full"
              {...getAnimationProps(0)}
            />
          </a>
          {!hasAnimated && !skippedIntro && (
            <SkipIntroButton
              onSkip={handleSkipIntro}
              skipText={t("skipIntro")}
            />
          )}
          <motion.h1
            key={`header-${
              hasAnimated || skippedIntro ? "skipped" : "animated"
            }`}
            className="text-4xl m-4 font-bold"
            {...getAnimationProps(0)}
          >
            {t("header")}
          </motion.h1>
          <p className="flex flex-col text-center gap-2 z-10">
            <motion.span
              key={`desc1-${
                hasAnimated || skippedIntro ? "skipped" : "animated"
              }`}
              className="text-base font-bold font-mono"
              {...getAnimationProps(2)}
            >
              {t("description1")}
            </motion.span>
            <motion.span
              key={`desc2-${
                hasAnimated || skippedIntro ? "skipped" : "animated"
              }`}
              className="text-base z-10 font-bold font-mono"
              {...getAnimationProps(4)}
            >
              {t("description2")}
            </motion.span>
          </p>
          {hasAnimated ? (
            showMenu ? (
              <motion.div
                key={`menu-${
                  hasAnimated || skippedIntro ? "skipped" : "animated"
                }`}
                className="mt-8 flex flex-col items-center"
                {...getMenuAnimationProps()}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                ref={menuRef}
              >
                <div className="max-w-md w-full min-w-96 z-10">
                  <SectionTitle
                    title={t("menu.title")}
                    className="text-white"
                  />

                  <section className="space-y-4">
                    {menuOptions.map((option, index) => (
                      <MenuItem
                        key={index}
                        title={option.title}
                        icon={option.icon}
                        onClick={() => handleMenuOptionClick(option.action)}
                        index={index}
                        interactive={true}
                      />
                    ))}
                  </section>
                </div>
              </motion.div>
            ) : (
              <MenuItem
                onClick={() => setShowMenu(true)}
                title={t("menu.showMenu")}
                icon={<FaEyeSlash />}
                index={0}
                interactive={true}
                withArrow={false}
              />
            )
          ) : (
            <ProgressBar complete={skippedIntro} duration={5} />
          )}
        </div>
      </PixelArtBackground>
    </div>
  );
}
