"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { FaBook, FaCode, FaUsers } from "react-icons/fa";

export default function About() {
  const t = useTranslations("main");

  return (
    <div className="relative flex flex-col min-h-screen text-white">
      <header className="w-full pt-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <motion.h1
              className="text-4xl font-bold text-white text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {t("about.title").toUpperCase()}
            </motion.h1>

            <Link
              href={`/${t("language.current")}`}
              className="px-4 py-2 bg-slate-800 border border-white rounded-md text-white hover:bg-slate-700 transition-colors"
              title={t("back")}
            >
              ← {t("back")}
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full">
        <motion.div
          className="max-w-4xl mx-auto mt-16 mb-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <section className="text-center mb-12">
            <h2
              className="text-3xl font-bold mb-4 text-white tracking-wider animate-bounce duration-500"
            >
              {t("about.subtitle").toUpperCase()}
            </h2>
            <div className="h-2 w-32 bg-green-500 border-2 border-white mx-auto rounded-full" />
          </section>

          <section className="space-y-8">
            {[
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
            ].map((mode, index) => (
              <motion.div
                key={index}
                className="group bg-slate-800/80 border-2 border-white rounded-lg overflow-hidden"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
                  borderColor: "#4ade80"
                }}
              >
                <Link
                  href={`/${t("language.current")}${mode.path}`}
                  className="block"
                  title={mode.title}
                >
                  <div className="px-6 py-5 flex items-center">
                    <div
                      className={`group-hover:bg-white/10 group-hover:border-green-400 transition-all duration-500 delay-200 w-10 h-10 flex-shrink-0 border-2 border-white/50 rounded-full flex items-center justify-center mr-4 font-bold`}
                    >
                      {mode.icon}
                    </div>
                    <div className="flex-grow">
                      <h3
                        className="group-hover:text-green-400 transition-all duration-500 delay-200 text-2xl font-bold tracking-wide text-white"
                        style={{
                          textShadow: "0 0 8px rgba(34, 211, 238, 0.6)",
                        }}
                      >
                        {mode.title}
                      </h3>
                      <p className="text-gray-300 mt-1 font-mono text-sm">
                        {mode.desc}
                      </p>
                    </div>
                    <div className="text-green-400 text-2xl">➔</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </section>

          <footer className="text-center mt-16 text-sm font-mono text-gray-400">
            {t("about.footer")}
          </footer>
        </motion.div>
      </main>
    </div>
  );
}
