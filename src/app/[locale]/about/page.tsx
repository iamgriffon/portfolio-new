"use client";

import { SectionTitle } from "@/components/ui";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { FaBook, FaCode, FaUsers, FaGamepad } from "react-icons/fa";
import { useMemo } from "react";

export default function About() {
  const t = useTranslations("main");
  const sections = useMemo(() => [
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
  ], [t]);

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
              <motion.div
                key={index}
                className="group bg-slate-800/80 border-2 border-white rounded-lg overflow-hidden"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
                  borderColor: "#4ade80",
                }}
              >
                <Link
                  href={`/${t("language.current")}${section.path}`}
                  className="block"
                  title={section.title}
                >
                  <div className="px-6 py-5 flex items-center">
                    <div
                      className={`group-hover:bg-white/10 group-hover:border-green-400 transition-all duration-500 delay-200 w-10 h-10 flex-shrink-0 border-2 border-white/50 rounded-full flex items-center justify-center mr-4 font-bold`}
                    >
                      {section.icon}
                    </div>
                    <div className="flex-grow">
                      <h3
                        className="group-hover:text-green-400 transition-all duration-500 delay-200 text-2xl font-bold tracking-wide text-white"
                        style={{
                          textShadow: "0 0 8px rgba(34, 211, 238, 0.6)",
                        }}
                      >
                        {section.title.toUpperCase()}
                      </h3>
                      <p className="text-gray-300 mt-1 font-mono text-sm">
                        {section.desc}
                      </p>
                    </div>
                    <div className="text-green-400 text-2xl">➔</div>
                  </div>
                </Link>
              </motion.div>
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
  