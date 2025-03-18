"use client";

import { Routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";

// User profile component
export const UserProfile = () => {
  const pathname = usePathname();
  const currentLocale = useLocale();
  const shouldHide = pathname.includes(Routes.HOME) || pathname === `/${currentLocale}`;
  return (
    <a
      href="https://github.com/iamgriffon"
      className={cn(
        "flex items-center gap-2 sm:gap-3 cursor-pointer",
        shouldHide && "invisible"
      )}
      target="_blank"
    >
      <Image
        src="https://github.com/iamgriffon.png"
        alt="Logo"
        width={32}
        height={32}
        className="rounded-full w-7 h-7 sm:w-8 sm:h-8"
      />
      <span className="font-bold text-sm sm:text-lg text-white">Gustavo</span>
    </a>
  );
};
