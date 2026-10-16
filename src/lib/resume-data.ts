import { additionalResumeEducation } from "./resume-education";
import { resumeAchievements } from "./resume-achievements";
import type { FunctionReturnType } from "convex/server";
import type { api } from "../../convex/_generated/api";

export type ResumeLocale = "en" | "pt-BR" | "es" | "zh";
export type ResumeInput = {
  jobs: FunctionReturnType<typeof api.portfolio.jobHistory>;
  education: FunctionReturnType<typeof api.portfolio.education>;
  contacts: FunctionReturnType<typeof api.portfolio.socialLinks>;
};
export type ResumeEntry = {
  title: string;
  organization: string;
  dates: string;
  technologies: string;
  bullets: string[];
};
export type ResumeData = {
  locale: ResumeLocale;
  name: string;
  contacts: { text: string; href: string }[];
  jobs: ResumeEntry[];
  education: ResumeEntry[];
};

export function resumeLocale(locale: string): ResumeLocale {
  if (locale === "en" || locale === "pt-BR" || locale === "es" || locale === "zh") return locale;
  throw new Error("Unsupported resume locale");
}

function date(value: string, locale: ResumeLocale): string {
  const match = /^(\d{4})-(0[1-9]|1[0-2])(?:-\d{2})?$/.exec(value);
  if (!match) throw new Error("Invalid resume date");
  return new Intl.DateTimeFormat(locale, { month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1)));
}

export function prepareResume(input: ResumeInput, locale: ResumeLocale, present: string): ResumeData {
  if (!input.jobs.length && !input.education.length) throw new Error("Empty resume");
  const field = locale === "pt-BR" ? "ptbr" : locale;
  const dates = (start: string, end: string | null) => `${date(start, locale)} - ${end ? date(end, locale) : present}`;
  return {
    locale,
    name: "Gustavo Dupin",
    contacts: input.contacts.flatMap((contact) => {
      const kind = contact.social_media.toLowerCase();
      if (!["email", "linkedin", "github"].includes(kind)) return [];
      if (kind === "email") {
        const email = contact.profile_url.replace(/^mailto:/i, "").trim();
        return /^[^\s@?]+@[^\s@?]+\.[^\s@?]+$/.test(email) ? [{ text: email, href: `mailto:${email}` }] : [];
      }
      try {
        const url = new URL(contact.profile_url);
        return ["https:", "http:"].includes(url.protocol)
          ? [{ text: url.href.replace(/^https?:\/\//, "").replace(/\/$/, ""), href: url.href }] : [];
      } catch { return []; }
    }),
    jobs: input.jobs.map((job) => ({
      title: job[`${field}_position`]?.trim() || job.en_position,
      organization: job.company,
      dates: dates(job.start_date, job.end_date),
      technologies: job.technologies?.trim() || "",
      // Legacy achievements have no locale contract; use sourced translations.
      bullets: resumeAchievements(job.company, locale),
    })),
    education: [...additionalResumeEducation(input.education, locale), ...input.education.map((entry) => ({
      title: entry[`${field}_degree`]?.trim() || entry.en_degree,
      organization: entry.institution,
      dates: dates(entry.start_date, entry.end_date),
      technologies: entry.technologies?.trim() || "",
      bullets: (entry[`${field}_achievements`] || "").split(/\n+/).map((line) => line.trim()).filter(Boolean),
    }))],
  };
}
