import { gunzipSync } from "node:zlib";
import { readFile } from "node:fs/promises";
import { parseBackup } from "./convert-backup";

const [input] = process.argv.slice(2);
if (!input) throw new Error("Usage: bun run backup:import <dump.backup.gz>");
if (!process.env.CONVEX_DEPLOY_KEY) throw new Error("Set CONVEX_DEPLOY_KEY in .env.local");
const snapshot = parseBackup(gunzipSync(await readFile(input)).toString("utf8"));
// Pass JSON as an argument, not shell source; never pass the deploy key in argv.
const child = Bun.spawn([
  "bunx", "convex", "run", "migrations:importPortfolio", JSON.stringify(snapshot),
], { stdout: "inherit", stderr: "inherit" });
process.exit(await child.exited);
