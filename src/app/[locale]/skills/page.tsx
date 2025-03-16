import { techs } from "./techs";
import TechSelection from "./client";

export default function SkillsPage() {
  return <TechSelection techs={techs} />;
}
