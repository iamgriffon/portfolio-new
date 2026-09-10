import { deepStrictEqual } from "node:assert";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { techs } from "./data/techs";

if (!process.env.CONVEX_DEPLOY_KEY) throw new Error("Set CONVEX_DEPLOY_KEY in .env.local");
if (!process.env.NEXT_PUBLIC_CONVEX_URL) throw new Error("Set NEXT_PUBLIC_CONVEX_URL");

const child = Bun.spawn([
  "bunx", "convex", "run", "migrations:importTechs", JSON.stringify({ techs }),
], { stdout: "inherit", stderr: "inherit" });
const exitCode = await child.exited;
if (exitCode !== 0) process.exit(exitCode);

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
deepStrictEqual(await client.query(api.portfolio.techs, {}), techs);
console.log(`${techs.length} technologies verified: same fields, IDs, order and icons`);
