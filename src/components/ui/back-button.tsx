"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export default function BackButton() {
  const router = useRouter();
  const t = useTranslations("main.home");
  const pathname = usePathname();

  const handleBack = () => {
    const pathParts = pathname.split("/");
    const currentLanguage = pathParts[1];
    const absoluteCurrentPath = pathParts[2] || "";

    const routeWithPrefix = (route: Routes) => `/${currentLanguage}/${route}`;

    if (absoluteCurrentPath === Routes.ABOUT) {
      return router.push(routeWithPrefix(Routes.HOME));
    }

    const deepRoutes = Object.values(Routes)
      .filter((route) => route !== Routes.HOME && route !== Routes.ABOUT) as Routes[];

    if (deepRoutes.includes(absoluteCurrentPath as Routes)) {
      return router.push(routeWithPrefix(Routes.ABOUT));
    }

    return router.push(routeWithPrefix(Routes.HOME));
  };

  return (
    <button
      onClick={handleBack}
      className={cn(
        "flex-shrink-0 cursor-pointer px-2 sm:px-4 py-1 sm:py-2 bg-slate-800 border border-white rounded-md text-white hover:bg-slate-700 transition-colors text-xs sm:text-sm whitespace-nowrap",
        pathname.includes(Routes.HOME) && "invisible"
      )}
      title={t("back")}
    >
      ← {t("back")}
    </button>
  );
}
