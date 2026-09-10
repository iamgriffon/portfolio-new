"use client";

import { usePreloadedQuery, type Preloaded } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import TechSelection from "./client";

export default function LiveTechSelection({ techs }: {
  techs: Preloaded<typeof api.portfolio.techs>;
}) {
  const technologies = usePreloadedQuery(techs);
  return <TechSelection techs={technologies} />;
}
