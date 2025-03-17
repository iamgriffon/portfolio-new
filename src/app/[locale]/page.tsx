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

// Animation props type
type AnimationProps = {
  initial: { opacity: number; y?: number };
  animate: { opacity: number; y?: number };
  transition: { duration: number; delay?: number };
};

// Menu option type
type MenuOption = {
  title: string;
  icon: React.ReactNode;
  action: string;
};

// Header component with user info and language switcher
const Header = () => (
  <section className="flex w-full pt-10 justify-end items-center gap-2 container h-auto pb-2 z-20">
    <LanguageSwitcher />
  </section>
);

// Profile avatar component
const ProfileAvatar = ({ animationProps }: { animationProps: AnimationProps }) => (
  <a href="https://github.com/iamgriffon" target="_blank" className="z-10">
    <motion.img
      src="https://github.com/iamgriffon.png"
      alt="logo"
      className="w-24 h-24 z-10 rounded-full"
      {...animationProps}
    />
  </a>
);

// Description component
const Description = ({ 
  header, 
  description1, 
  description2, 
  getAnimationProps 
}: { 
  header: string; 
  description1: string; 
  description2: string; 
  getAnimationProps: (delay: number) => AnimationProps 
}) => (
  <>
    <motion.h1
      className="text-4xl m-4 font-bold"
      {...getAnimationProps(0)}
    >
      {header}
    </motion.h1>
    <p className="flex flex-col text-center gap-2 z-10">
      <motion.span
        className="text-base font-bold font-mono"
        {...getAnimationProps(2)}
      >
        {description1}
      </motion.span>
      <motion.span
        className="text-base z-10 font-bold font-mono"
        {...getAnimationProps(4)}
      >
        {description2}
      </motion.span>
    </p>
  </>
);

// Menu component
const Menu = ({ 
  menuOptions, 
  handleMenuOptionClick, 
  menuAnimationProps, 
  menuRef, 
  menuTitle 
}: { 
  menuOptions: MenuOption[]; 
  handleMenuOptionClick: (action: string) => void; 
  menuAnimationProps: AnimationProps; 
  menuRef: React.RefObject<HTMLDivElement | null>; 
  menuTitle: string; 
}) => (
  <motion.div
    className="mt-8 flex flex-col items-center"
    {...menuAnimationProps}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    ref={menuRef}
  >
    <div className="max-w-md w-full min-w-96 z-10">
      <SectionTitle title={menuTitle} className="text-white" />
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
);

export default function Home() {
  const t = useTranslations("main");
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
  const spritePaths = sprites.map((sprite) => sprite.path);

  // Handle animation timing based on project visits
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

  // Reset item properties when coming back from projects
  useEffect(() => {
    if (!hasVisitedProjects || items.length === 0 || hasResetRef.current) {
      return;
    }
    
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

  // Set intro animation timeout
  useEffect(() => {
    if (hasAnimated || skippedIntro) {
      return;
    }
    
    timeoutRef.current = setTimeout(() => {
      setHasAnimated(true);
    }, 5000);
    
    return () => clearTimeout(timeoutRef.current);
  }, [hasAnimated, skippedIntro]);

  // Get animation properties based on animation state
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

  // Get menu animation properties
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

  // Handle menu option clicks
  const handleMenuOptionClick = (action: string) => {
    if (action === "start") {
      return router.push(`/${params.locale}/about`);
    }
    
    if (action === "hide") {
      return setShowMenu(false);
    }
  };

  // Handle skip intro button click
  const handleSkipIntro = () => {
    clearTimeout(timeoutRef.current);
    setHasAnimated(true);
    setSkippedIntro(true);
  };

  // Generate key based on animation state
  const getAnimationKey = (prefix: string) => 
    `${prefix}-${hasAnimated || skippedIntro ? "skipped" : "animated"}`;

  // Render content based on state
  const renderContent = () => {
    if (!hasAnimated) {
      return <ProgressBar complete={skippedIntro} duration={5} />;
    }
    
    if (!showMenu) {
      return (
        <MenuItem
          onClick={() => setShowMenu(true)}
          title={t("menu.showMenu")}
          icon={<FaEyeSlash />}
          index={0}
          interactive={true}
          withArrow={false}
        />
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
    <div className="flex flex-col w-screen h-screen text-white z-20 overflow-hidden">
      <PixelArtBackground
        sprites={spritePaths}
        numberOfSprites={8}
        minVelocity={1.0}
        maxVelocity={2.5}
        withoutBouncing={false}
      >
        <Header />
        <div className="w-full h-full flex flex-col z-10 gap-4 items-center justify-center pointer-events-auto">
          <ProfileAvatar 
            animationProps={getAnimationProps(0)} 
          />
          
          {!hasAnimated && !skippedIntro && (
            <SkipIntroButton
              onSkip={handleSkipIntro}
              skipText={t("skipIntro")}
            />
          )}
          
          <Description 
            header={t("header")}
            description1={t("description1")}
            description2={t("description2")}
            getAnimationProps={getAnimationProps}
          />
          
          {renderContent()}
        </div>
      </PixelArtBackground>
    </div>
  );
}
