import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { projects } from "@/lib/projects";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "main.projects" });

  return (
    <section className="relative z-10 mx-auto mb-24 max-w-6xl px-2 text-white sm:px-4" aria-label={t("title")}>
      <p className="mx-auto mb-8 max-w-2xl text-center text-gray-300">
        {t("intro")}
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, index) => (
          <article
            key={project.id}
            className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-600 bg-slate-900/95 shadow-xl"
          >
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("openProject", { name: project.name })}
              className="group block overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-green-400"
            >
              <Image
                src={project.image}
                alt={t(`${project.id}.thumbnail`)}
                width={1280}
                height={800}
                priority={index === 0}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="aspect-[8/5] w-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.03]"
              />
            </a>
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <h2 className="text-xl font-bold text-green-400">{project.name}</h2>
              <p className="mt-3 leading-relaxed text-gray-300">
                {t(`${project.id}.description`)}
              </p>
              <ul className="my-5 flex flex-wrap gap-2" aria-label={t("technologies")}>
                {project.technologies.map((technology) => (
                  <li key={technology} className="rounded-full border border-slate-600 bg-slate-800 px-3 py-1 text-xs text-gray-200">
                    {technology}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap gap-3 pt-2">
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("openProject", { name: project.name })}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-green-400 px-4 py-2 font-semibold text-slate-950 transition-colors hover:bg-green-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-400"
                >
                  <FaExternalLinkAlt aria-hidden="true" /> {t("demo")}
                </a>
                <a
                  href={project.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("openRepository", { name: project.name })}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-500 px-4 py-2 font-semibold transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-400"
                >
                  <FaGithub aria-hidden="true" /> GitHub
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
