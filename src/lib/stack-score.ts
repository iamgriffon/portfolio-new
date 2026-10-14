type Skill = { id: string; level: number; years: number };
type Area = "frontend" | "backend" | "mobile" | "infrastructure" | "delivery" | "observability" | "integration" | "automation";

// Portfolio-specific calibration based on reported hands-on work, not a
// universal ranking of technologies. Related tools share the same area cap.
const experience: Record<string, Partial<Record<Area, number>>> = {
  // Frameworks share their execution domain; Next.js alone does not imply
  // separate backend experience. React Native represents mobile delivery.
  react: { frontend: 2 },
  nextjs: { frontend: 2 },
  angular: { frontend: 2 },
  vue: { frontend: 2 },
  jquery: { frontend: 1 },
  node: { backend: 2 },
  express: { backend: 2 },
  nest: { backend: 2 },
  "react-native": { mobile: 2 },
  // JS/TS are shared language foundations: they affect depth, but cannot
  // independently claim frontend AND backend breadth. HTML/CSS stay depth-only.
  docker: { infrastructure: 3, delivery: 2 }, // Compose and cloud production deploys.
  kubernetes: { infrastructure: 4, delivery: 2 }, // Helm, replication and redundancy.
  aws: { infrastructure: 4 }, // Cloud services and CDK; excludes Bedrock learning.
  cloudflare: { infrastructure: 4 }, // Workers, storage, networking and security.
  "ci-cd": { delivery: 3 }, // E2E, releases, private packages and feature flags.
  grafana: { observability: 3 }, // Cluster monitoring and k6 stress testing.
  sentry: { observability: 3, integration: 1 }, // Production alerts and web/mobile integration.
  datadog: { observability: 2 }, // Debugging and log streams.
  "web3-crypto": { integration: 1 }, // Wallet/contract integration, not contract design.
  claude: { automation: 1 }, // MCP, orchestration, subagents and skills.
};

const foundations = new Set(["html", "css", "git"]);

export function calculateStackScore(stack: readonly Skill[]): number {
  let depth = 0;
  const areas: Partial<Record<Area, number>> = {};

  for (const tech of stack) {
    const level = Math.max(0, Math.min(tech.level, 100));
    const years = Math.max(0, tech.years);
    const skillScore = level * 0.6 + Math.min(years * 10, 100) * 0.4;
    // Anchor the assessment in the strongest specialization so adding a
    // complementary, newer skill does not lower demonstrated experience.
    depth = Math.max(depth, foundations.has(tech.id) ? Math.min(skillScore, 75) : skillScore);

    // Full area credit requires both proficiency and sustained experience.
    const maturity = Math.min(level / 80, 1) * Math.min(years / 3, 1);
    const contributions = experience[tech.id] ?? {};
    for (const area of Object.keys(contributions) as Area[]) {
      areas[area] = Math.max(areas[area] ?? 0, (contributions[area] ?? 0) * maturity);
    }
  }

  const breadth = Math.min(12, Object.values(areas).reduce((sum, bonus) => sum + bonus, 0));
  return Math.min(100, Math.round(depth + breadth));
}
