"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaDiscord,
  FaSteam,
  FaEnvelope,
} from "react-icons/fa";
import { SocialMediaCardProps } from "./social-media-card-types";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { BiSolidCopy } from "react-icons/bi";

export default function SocialMediaCard({ social }: SocialMediaCardProps) {
  const t = useTranslations("main.socials");
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(social.profile_url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [social.profile_url]);

  const styles = {
    email: {
      icon: <FaEnvelope className="h-8 w-8" />,
      color: "#FEE2E2", // bg-red-200/80
    },
    linkedin: {
      icon: <FaLinkedin className="h-8 w-8" />,
      color: "#BFDBFE", // bg-blue-200/80
    },
    github: {
      icon: <FaGithub className="h-8 w-8" />,
      color: "#FFFFFF", // bg-white/80
    },
    instagram: {
      icon: <FaInstagram className="h-8 w-8" />,
      color: "#FBCFE8", // bg-pink-200/80
    },
    discord: {
      icon: <FaDiscord className="h-8 w-8" />,
      color: "#E0F2FE", // bg-indigo-200/80
    },
    steam: {
      icon: <FaSteam className="h-8 w-8" />,
      color: "#E5E7EB", // bg-gray-200/80
    },
  };

  const withHover = (className: string) =>
    cn(className, "transition-all duration-300", {
      "group-hover:text-red-600":
        social.social_media.toLowerCase() === "email",
      "group-hover:text-blue-700":
        social.social_media.toLowerCase() === "linkedin",
      "group-hover:text-gray-900":
        social.social_media.toLowerCase() === "github" ||
        social.social_media.toLowerCase() === "steam",
      "group-hover:text-pink-600":
        social.social_media.toLowerCase() === "instagram",
      "group-hover:text-indigo-600":
        social.social_media.toLowerCase() === "discord",
    });

  return (
    <motion.div
      whileHover={{
        scale: 1.03,
        boxShadow: "0 0 20px rgba(74, 222, 128, 0.2)",
        backgroundColor: styles[social.social_media.toLowerCase() as keyof typeof styles].color,
        opacity: 0.8
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full group rounded-2xl"
    >
      <Card
        className={withHover(
          `group h-full backdrop-blur-sm bg-inheritborder-[1px] border-white/20
          hover:${styles[social.social_media.toLowerCase() as keyof typeof styles].color}`
        )}
        title={social.social_media}
      >
        <CardHeader className="flex flex-row items-center gap-4 pb-2 px-6 pt-5">
          <div
            className={withHover(
              "p-2.5 border border-white/20 rounded-md group-hover:border-black/30 bg-slate-700/50 group-hover:bg-transparent flex items-center justify-center"
            )}
          >
            {
              styles[social.social_media.toLowerCase() as keyof typeof styles]
                .icon
            }
          </div>
          <CardTitle
            className={withHover(
              "text-xl font-bold tracking-wide text-gray-50 select-none"
            )}
          >
            {social.social_media}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-3">
          <CardDescription
            className={withHover(
              "cursor-pointer flex items-center gap-2 text-base text-gray-50 font-mono"
            )}
            onClick={handleCopy}
          >
            {copied ? (
              <span className="text-inherit hover">{t("copied")}</span>
            ) : (
              <>
                <span className="hover:underline hover:text-inherit">
                  {social.user_name}
                </span>
                <BiSolidCopy className="cursor-pointer text-current hover:text-inherit" />
              </>
            )}
          </CardDescription>
        </CardContent>
        <CardFooter className="px-6 pb-5">
          <a
            href={
              social.social_media === "Email"
                ? `mailto:${social.user_name}`
                : social.profile_url
            }
            key={social.social_media}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-sm text-gray-100 group-hover:text-gray-700 hover:text-green-600 flex items-center gap-2 font-mono">
              <span className="hover:underline">
                {t("visitProfile")}
              </span>
              <span className="text-current text-lg">→</span>
            </p>
          </a>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
