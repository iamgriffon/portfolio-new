"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRef } from "react";

export default function BackButton() {
  const router = useRouter();
  const t = useTranslations("main");
  const pathname = usePathname();

  const previousPath = useRef<string | null>(document.referrer || null);

  const handleBack = () => {
    const lastPath = previousPath.current;
    const absoluteCurrentPath = pathname.split("/")[2];
    const currentLanguage = pathname.split("/")[1];
    const deepRoutes = ["resume", "skills", "socials", "doom"];
    if (absoluteCurrentPath === "about")
      return router.push(`/${currentLanguage}/`);

    if (!lastPath) {
      if (!deepRoutes.includes(absoluteCurrentPath)) {
        return router.push(`/${currentLanguage}/about`);
      }
    }

    if (lastPath && deepRoutes.includes(absoluteCurrentPath)) {
      return router.push(`/${currentLanguage}/about`);
    }

    const isSameLang = lastPath?.split("/")[1] === currentLanguage;
    const absoluteLastPath = lastPath?.split("/")[2];

    if (isSameLang) {
      if (absoluteLastPath === absoluteCurrentPath) return;
    }
    return router.back();
  };

  return (
    <button
      onClick={handleBack}
      className="cursor-pointer px-4 py-2 bg-slate-800 border border-white rounded-md text-white hover:bg-slate-700 transition-colors"
      title={t("back")}
    >
      ← {t("back")}
    </button>
  );
}
