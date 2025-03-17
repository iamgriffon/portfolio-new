"use client";

import { MenuItem, SectionTitle } from "@/components/ui";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FaBook, FaCode, FaUsers, FaGamepad } from "react-icons/fa";
import { useMemo } from "react";

export default function About() {
  const t = useTranslations("main");
  const sections = useMemo(
    () => [
      {
        title: t("about.resume.title"),
        path: "/resume",
        desc: t("about.resume.desc"),
        icon: <FaBook />,
      },
      {
        title: t("about.skills.title"),
        path: "/skills",
        desc: t("about.skills.desc"),
        icon: <FaCode />,
      },
      {
        title: t("about.socials.title"),
        path: "/socials",
        desc: t("about.socials.desc"),
        icon: <FaUsers />,
      },
      {
        title: t("about.doom.title"),
        path: "/doom",
        desc: t("about.doom.desc"),
        icon: <FaGamepad />,
      },
    ],
    [t]
  );

  return (
    <div className="flex flex-col text-white">
      <main className="w-full h-full">
        <motion.div
          className="max-w-4xl mx-auto mb-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <section className="text-center mb-12">
            <SectionTitle title={t("about.subtitle")} />
          </section>

          <section className="space-y-8">
            {sections.map((section, index) => (
              <MenuItem
                key={`${section.title}-${index}`}
                title={section.title}
                icon={section.icon}
                href={`/${t("language.current")}${section.path}`}
                withArrow={true}
                description={section.desc}
                index={index}
              />
            ))}
          </section>

          <footer className="text-center text-sm mt-16 font-mono text-gray-50 select-none">
            {t("about.footer")}
          </footer>
        </motion.div>
      </main>
    </div>
  );
}
