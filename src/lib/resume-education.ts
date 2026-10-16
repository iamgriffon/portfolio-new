import type { ResumeEntry, ResumeInput, ResumeLocale } from "./resume-data";

// Enrollment confirmed by the owner; curriculum from the official uniPDS page and topics/technologies confirmed by the owner.
// Enrollment began on 2026-02-20; no graduation date is assumed.
// See docs/resume-cv.md.
const unipds: Record<ResumeLocale, Pick<ResumeEntry, "title" | "dates" | "bullets">> = {
  "pt-BR": {
    title: "Pós-Graduação em Engenharia de IA Aplicada",
    dates: "Em andamento",
    bullets: ["Fundamentos de IA e LLMs, APIs de IA Generativa, Prompt Engineering, MCP, Agentes Autônomos, Arquitetura de Sistemas com IA, Fine-Tuning, Segurança e Governança em IA, RAG, Redes Neurais, Banco de Dados Vetorial."],
  },
  en: {
    title: "Postgraduate Program in Applied AI Engineering",
    dates: "In progress",
    bullets: ["AI and LLM Fundamentals, Generative AI APIs, Prompt Engineering, MCP, Autonomous Agents, AI System Architecture, Fine-Tuning, AI Security and Governance, RAG, Neural Networks, Vector Databases."],
  },
  es: {
    title: "Posgrado en Ingeniería de IA Aplicada",
    dates: "En curso",
    bullets: ["Fundamentos de IA y LLM, APIs de IA Generativa, Prompt Engineering, MCP, Agentes Autónomos, Arquitectura de Sistemas con IA, Fine-Tuning, Seguridad y Gobernanza de IA, RAG, Redes Neuronales, Bases de Datos Vectoriales."],
  },
  zh: {
    title: "应用人工智能工程研究生进修课程",
    dates: "在读",
    bullets: ["AI 与 LLM 基础、生成式 AI API、提示工程、MCP、\n自主智能体、AI 系统架构、微调、AI 安全与治理、\nRAG、神经网络、向量数据库。"],
  },
};

export function additionalResumeEducation(
  education: ResumeInput["education"],
  locale: ResumeLocale,
): ResumeEntry[] {
  // Prefer the database record if this same course is added there later.
  const alreadyStored = education.some((entry) =>
    entry.institution.trim().toLowerCase() === "unipds" &&
    entry.ptbr_degree.trim() === unipds["pt-BR"].title,
  );
  return alreadyStored ? [] : [{
    ...unipds[locale],
    organization: "uniPDS",
    dates: `${new Intl.DateTimeFormat(locale, { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date("2026-02-20T00:00:00Z"))} - ${unipds[locale].dates}`,
    technologies: "TensorFlow, Python, MCP, Neo4j, PostgreSQL, Markdown",
    bullets: [...unipds[locale].bullets],
  }];
}
