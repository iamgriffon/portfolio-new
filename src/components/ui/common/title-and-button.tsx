"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { SectionTitle } from "./section-title";
import BackButton from "../back-button";
import { Routes } from "@/lib/routes";

export function TitleAndBackButton({
  initialPathname,
}: {
  initialPathname: string;
}) {
  const pathname =
    usePathname()?.replace("/", "").split("/")[1] || initialPathname;
  const t = useTranslations("main");

  if (!pathname.trim()) {
    return null;
  }

  return (
    <section className="flex w-full max-w-7xl items-center justify-between relative px-3 sm:px-6">
      <SectionTitle
        title={pathname === Routes.HOME ? "" : t(`${pathname}.title`)}
        animate={false}
        withoutBar
        className="text-lg sm:text-xl md:text-3xl truncate pr-2"
      />
      <BackButton />
    </section>
  );
}
