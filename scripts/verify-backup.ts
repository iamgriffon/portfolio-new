import { deepStrictEqual } from "node:assert";
import { readFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { parseBackup } from "./convert-backup";

const [input] = process.argv.slice(2);
if (!input) throw new Error("Usage: bun run backup:verify <dump.backup.gz>");
if (!process.env.NEXT_PUBLIC_CONVEX_URL) throw new Error("Set NEXT_PUBLIC_CONVEX_URL");
const snapshot = parseBackup(gunzipSync(await readFile(input)).toString("utf8"));

for (const table of ["job_history", "education", "socials"] as const) {
  const child = Bun.spawn(["bunx", "convex", "data", table, "--format", "json", "--limit", String(snapshot[table].length + 1)], {
    stdout: "pipe", stderr: "inherit",
  });
  const output = await new Response(child.stdout).text();
  if (await child.exited !== 0) throw new Error(`Failed to read ${table}`);
  const rows = JSON.parse(output).map(({ _id, _creationTime, ...row }: Record<string, unknown>) => row);
  const byId = (a: { id: number }, b: { id: number }) => a.id - b.id;
  deepStrictEqual(rows.sort(byId), [...snapshot[table]].sort((a, b) => Number(a.id) - Number(b.id)));
  console.log(`${table}: ${rows.length} records match the backup, field for field`);
}

// No admin key is set on this client: verify the reads used by the public site.
const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
const [jobs, education, socials] = await Promise.all([
  client.query(api.portfolio.jobHistory, {}),
  client.query(api.portfolio.education, {}),
  client.query(api.portfolio.socialLinks, {}),
]);
const ordered = (table: string) => [...snapshot[table]].sort((a, b) =>
  (a.order_index === null ? Infinity : Number(a.order_index)) -
  (b.order_index === null ? Infinity : Number(b.order_index)),
);
deepStrictEqual(jobs.map((row) => row.id), ordered("job_history").map((row) => row.id));
deepStrictEqual(education.map((row) => row.id), ordered("education").map((row) => row.id));
deepStrictEqual(socials, ordered("socials").flatMap(({ social_media, user_name, profile_url }) =>
  social_media && user_name && profile_url ? [{ social_media, user_name, profile_url }] : [],
));
console.log("Public queries return the expected content in display order");
