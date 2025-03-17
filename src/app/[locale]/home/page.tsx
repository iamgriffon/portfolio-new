"use client";

import { AnimationProps } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useAnimationState } from "@/components/background/animation-state-provider";
import { useRouter, useParams } from "next/navigation";
import { useBackgroundState } from "@/components/background/pixel-art-background-provider";
import { FaPlay, FaEyeSlash } from "react-icons/fa";
import { MenuItem, ProgressBar } from "@/components/ui";
import {
  Menu,
  Description,
  ProfileAvatar,
  SkipIntroButton,
} from "@/components/home";

export default function Home() {
  const t = useTranslations("main.home");
  const menuOptions = [
    { title: t("menu.start"), icon: <FaPlay />, action: "start" },
    { title: t("menu.hideMenu"), icon: <FaEyeSlash />, action: "hide" },
  ];

  const [showMenu, setShowMenu] = useState(true);
  const [skippedIntro, setSkippedIntro] = useState(false);

  const { hasAnimated, setHasAnimated } = useAnimationState();
  const { items, setItems, hasVisitedProjects } = useBackgroundState();

  const menuRef = useRef<HTMLDivElement | null>(null);
  const hasResetRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>(setTimeout(() => {}, 0));

  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (hasVisitedProjects) {
      setHasAnimated(true);
      return;
    }
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [setHasAnimated, hasVisitedProjects]);

  useEffect(() => {
    if (!hasVisitedProjects || items.length === 0 || hasResetRef.current) return;
    hasResetRef.current = true;
    setItems(
      items.map((item) => ({
        ...item,
        scale: 1,
        speedX: (Math.random() - 0.5) * 2.0,
        speedY: (Math.random() - 0.5) * 2.0,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        targetX: undefined,
        targetY: undefined,
        targetScale: undefined,
      }))
    );

    return () => {
      hasResetRef.current = false;
    };
  }, [hasVisitedProjects, setItems, items]);

  useEffect(() => {
    if (hasAnimated || skippedIntro) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setHasAnimated(true);
    }, 5000);

    return () => clearTimeout(timeoutRef.current);
  }, [hasAnimated, skippedIntro]);

  const getAnimationProps = (delay: number): AnimationProps => {
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

  const getMenuAnimationProps = (): AnimationProps => {
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

  const renderContent = () => {
    if (!hasAnimated) {
      return <ProgressBar complete={skippedIntro} duration={5} />;
    }

    if (!showMenu) {
      return (
        <div className="pt-10">
          <MenuItem
            onClick={() => setShowMenu(true)}
            title={t("menu.showMenu")}
            icon={<FaEyeSlash />}
            index={0}
            interactive={true}
            withArrow={false}
          />
        </div>
      );
    }

    return (
      <Menu
        menuOptions={menuOptions}
        handleMenuOptionClick={handleMenuOptionClick}
        menuAnimationProps={getMenuAnimationProps()}
        menuRef={menuRef}
        menuTitle={t("menu.title")}
      />
    );
  };

  return (
    <div className="flex flex-col text-white z-20 overflow-hidden py-2">
      <div className="w-full h-full flex flex-col z-10 gap-4 items-center justify-center pointer-events-auto">
        <ProfileAvatar animationProps={getAnimationProps(0)} />

        {!hasAnimated && !skippedIntro && (
          <SkipIntroButton onSkip={handleSkipIntro} skipText={t("skipIntro")} />
        )}

        <Description
          header={t("header")}
          description1={t("description1")}
          description2={t("description2")}
          getAnimationProps={getAnimationProps}
        />

        {renderContent()}
      </div>
    </div>
  );
}
