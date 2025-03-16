'use client';

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { SectionTitle } from "./section-title";
import BackButton from "../back-button";

export function TitleAndBackButton({ initialPathname }: { initialPathname: string }) {
  const pathname = usePathname()?.replace("/", "").split("/")[1] || initialPathname;
  const t = useTranslations("main");
  
  if (!pathname.trim()) {
    return null;
  }
  
  return (
    <section className="flex w-full max-w-7xl items-center justify-between relative">
      <SectionTitle
        title={t(`${pathname}.title`)}
        animate={false}
        withoutBar
      />
      <BackButton />
    </section>
  );
} 