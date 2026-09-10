import { preloadQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import LiveTechSelection from "./live";

export default async function SkillsPage() {
  const techs = await preloadQuery(api.portfolio.techs, {});
  return <LiveTechSelection techs={techs} />;
}
