import { describe, expect, test } from "bun:test";
import { calculateStackScore } from "./stack-score";
import { techs } from "../../scripts/data/techs";

function select(...ids: string[]) {
  return ids.map(id => {
    const tech = techs.find(tech => tech.id === id);
    if (!tech) throw new Error(`Unknown skill: ${id}`);
    return tech;
  });
}

describe("portfolio stack assessment", () => {
  test("empty stacks start at zero; scores stay within 0–100", () => {
    expect(calculateStackScore([])).toBe(0);
    expect(calculateStackScore([{ id: "react", level: 200, years: 20 }])).toBe(100);
    expect(calculateStackScore([{ id: "aws", level: -10, years: -2 }])).toBe(0);
  });

  test("foundations alone do not establish seniority", () => {
    expect(calculateStackScore(select("html", "css", "git"))).toBe(75);
    expect(calculateStackScore(select("react"))).toBeGreaterThan(75);
  });

  test("production experience contributes more than an equally proficient foundation", () => {
    const skill = { level: 80, years: 3 };
    expect(calculateStackScore([{ ...skill, id: "kubernetes" }]))
      .toBeGreaterThan(calculateStackScore([{ ...skill, id: "html" }]));
  });

  test("complementary skills never lower the specialization score", () => {
    const core = select("react");
    for (const tech of techs) {
      expect(calculateStackScore([...core, tech])).toBeGreaterThanOrEqual(calculateStackScore(core));
    }
    expect(calculateStackScore([...core, ...select("kubernetes")]))
      .toBeGreaterThan(calculateStackScore(core));
  });

  test("similar tools and duplicate selections cannot farm area bonuses", () => {
    const cloud = select("react", "aws");
    expect(calculateStackScore([...cloud, ...select("cloudflare")])).toBe(calculateStackScore(cloud));
    const monitoring = select("react", "grafana");
    expect(calculateStackScore([...monitoring, ...select("datadog")])).toBe(calculateStackScore(monitoring));
    expect(calculateStackScore([...techs, ...techs])).toBe(calculateStackScore(techs));
    expect(calculateStackScore([...techs].reverse())).toBe(calculateStackScore(techs));
  });

  test("different areas add credit, bounded to twelve points", () => {
    const core = select("react");
    const cloud = [...core, ...select("aws")];
    const broad = [...cloud, ...select("ci-cd", "grafana", "sentry", "claude")];
    expect(calculateStackScore(broad)).toBeGreaterThan(calculateStackScore(cloud));
    expect(calculateStackScore(broad) - calculateStackScore(core)).toBeLessThanOrEqual(12);
  });

  test("integration experience does not imply contract design or full production maturity", () => {
    const core = select("react");
    expect(calculateStackScore([...core, ...select("web3-crypto")]) - calculateStackScore(core))
      .toBeLessThanOrEqual(1);
    expect(calculateStackScore([...core, { id: "aws", level: 80, years: 0 }]))
      .toBe(calculateStackScore(core));
  });

  test("frontend frameworks share credit rather than accumulating it", () => {
    const frontend = select("react");
    expect(calculateStackScore([...frontend, ...select("nextjs", "angular", "vue", "jquery")]))
      .toBe(calculateStackScore(frontend));
  });

  test("Node backend frameworks share credit, independently of frontend", () => {
    const backend = select("express");
    expect(calculateStackScore([...backend, ...select("node", "nest")]))
      .toBe(calculateStackScore(backend));
    expect(calculateStackScore(select("nextjs", "nest")))
      .toBeGreaterThan(calculateStackScore(select("nextjs")));
  });

  test("shared languages do not imply frontend or backend breadth", () => {
    const languages = select("javascript", "typescript");
    expect(calculateStackScore(languages)).toBe(calculateStackScore(select("typescript")));
    expect(calculateStackScore(select("react", "javascript", "typescript", "html", "css")))
      .toBe(calculateStackScore(select("react")));
    expect(calculateStackScore([...languages, ...select("react", "node")]))
      .toBeGreaterThan(calculateStackScore([...languages, ...select("react")]));
  });

  test("mobile is complementary to web despite sharing React", () => {
    expect(calculateStackScore(select("react", "react-native")))
      .toBeGreaterThan(calculateStackScore(select("react")));
  });

  test("equivalent frameworks receive equal credit at equal proficiency and experience", () => {
    const skill = { level: 80, years: 3 };
    const reference = calculateStackScore([{ ...skill, id: "react" }]);
    for (const id of ["nextjs", "angular", "vue", "node", "nest", "express"]) {
      expect(calculateStackScore([{ ...skill, id }])).toBe(reference);
    }
  });
});
