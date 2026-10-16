import { describe, expect, test } from "bun:test";
import { prepareResume, resumeLocale, type ResumeInput } from "./resume-data";
import type { Id } from "../../convex/_generated/dataModel";

const job: ResumeInput["jobs"][number] = {
  _id: "test-job" as Id<"job_history">, _creationTime: 0, id: 5, created_at: "2025-04-01", order_index: 0,
  company: "Ticketbolt", en_position: "Software Engineer", ptbr_position: "Engenheiro de Software", es_position: "Ingeniero de Software", zh_position: "软件工程师",
  start_date: "2025-04", end_date: null, technologies: "React, Convex", image_url: null, url: null, achievements: null,
};
const input: ResumeInput = { jobs: [job], education: [], contacts: [
  { social_media: "Email", user_name: "Test", profile_url: "test@example.com" },
  { social_media: "GitHub", user_name: "test", profile_url: "javascript:alert(1)" },
  { social_media: "LinkedIn", user_name: "test", profile_url: "https://linkedin.com/in/test" },
  { social_media: "Discord", user_name: "test", profile_url: "https://discord.com/users/test" },
] };

describe("resume content", () => {
  test.each(["en", "pt-BR", "es", "zh"])("uses locale %s and sourced achievements", (locale) => {
    const supportedLocale = resumeLocale(locale);
    const data = prepareResume(input, supportedLocale, "NOW");
    expect(data.locale).toBe(locale);
    expect(data.jobs[0].dates).toEndWith(" - NOW");
    expect(data.jobs[0].bullets).toHaveLength(5);
    expect(data.jobs[0].title).toBe({ en: job.en_position, "pt-BR": job.ptbr_position, es: job.es_position, zh: job.zh_position }[supportedLocale]);
  });
  test("includes current study with confirmed enrollment and no invented graduation date", () => {
    const data = prepareResume(input, "pt-BR", "Presente");
    expect(data.education[0].organization).toBe("uniPDS");
    expect(data.education[0].dates).toBe("fev. de 2026 - Em andamento");
    expect(data.education[0].bullets[0]).toStartWith("Fundamentos de IA e LLMs");
  });
  test("prefers the database record when the same course is stored there", () => {
    const education: ResumeInput["education"] = [{
      _id: "test-education" as Id<"education">, _creationTime: 0, id: 4,
      created_at: "2026-01-01", order_index: 0, institution: "uniPDS",
      en_degree: "Postgraduate Program in Applied AI Engineering",
      ptbr_degree: "Pós-Graduação em Engenharia de IA Aplicada",
      es_degree: null, zh_degree: "应用人工智能工程研究生进修课程",
      start_date: "2026-01", end_date: null, technologies: null,
      en_achievements: null, ptbr_achievements: null, es_achievements: null, zh_achievements: null,
      image_url: null, url: null, degree_url: null,
    }];
    const data = prepareResume({ ...input, education }, "en", "Present");
    expect(data.education).toHaveLength(1);
    expect(data.education[0].dates).toBe("Jan 2026 - Present");
  });
  test("keeps only safe professional contacts", () => {
    const data = prepareResume(input, "en", "Present");
    expect(data.contacts.map((c) => c.href)).toEqual(["mailto:test@example.com", "https://linkedin.com/in/test"]);
  });
  test("does not invent accomplishments or silently translate legacy text", () => {
    const data = prepareResume({ ...input, jobs: [{ ...job, company: "Other", achievements: "unlocalized content" }] }, "en", "Present");
    expect(data.jobs[0].bullets).toEqual([]);
  });
  test("uses current data, including end dates and position updates", () => {
    const data = prepareResume({ ...input, jobs: [{ ...job, end_date: "2026-10", en_position: "Updated title" }] }, "en", "Present");
    expect(data.jobs[0].title).toBe("Updated title");
    expect(data.jobs[0].dates).toBe("Apr 2025 - Oct 2026");
  });
  test("rejects empty data, malformed dates and unsupported locales", () => {
    expect(() => prepareResume({ jobs: [], education: [], contacts: [] }, "en", "Present")).toThrow("Empty resume");
    expect(() => prepareResume({ ...input, jobs: [{ ...job, start_date: "2025-13" }] }, "en", "Present")).toThrow("Invalid resume date");
    expect(() => resumeLocale("xx")).toThrow("Unsupported resume locale");
  });
  test("falls back for a missing translated title and omits missing optional fields", () => {
    const data = prepareResume({ ...input, jobs: [{ ...job, es_position: null, technologies: null }] }, "es", "Actualidad");
    expect(data.jobs[0].title).toBe(job.en_position);
    expect(data.jobs[0].technologies).toBe("");
  });
});
