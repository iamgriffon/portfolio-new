import { techs } from "./techs";
import TechSelection from "./client";

export default function SkillsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <TechSelection techs={techs} />
    </div>
  );
}
