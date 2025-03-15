"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

interface LanguageSwitcherProps {
  currentPath?: string;
}

export function LanguageSwitcher({ currentPath = "" }: LanguageSwitcherProps) {
  const t = useTranslations("language");
  const pathname = usePathname();
  
  // Process pathname to get the current path without locale
  const path = currentPath || pathname.split("/").slice(2).join("/");
  
  return (
    <div className="flex gap-2 items-center">
      <Link 
        href={`/en/${path}`}
        className={`text-white hover:text-blue-300 transition px-2 py-1 ${t('current') === 'en' ? 'font-bold underline' : ''}`}
      >
        {t('en')}
      </Link>
      <span className="text-white">|</span>
      <Link 
        href={`/pt-BR/${path}`}
        className={`text-white hover:text-blue-300 transition px-2 py-1 ${t('current') === 'pt-BR' ? 'font-bold underline' : ''}`}
      >
        {t('pt-BR')}
      </Link>
      <span className="text-white">|</span>
      <Link 
        href={`/zh/${path}`}
        className={`text-white hover:text-blue-300 transition px-2 py-1 ${t('current') === 'zh' ? 'font-bold underline' : ''}`}
      >
        {t('zh')}
      </Link>
    </div>
  );
} 