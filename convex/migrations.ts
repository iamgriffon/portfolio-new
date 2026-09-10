import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { educationFields, jobHistoryFields, socialFields } from "./schema";

// Only callable with admin credentials through the CLI, never by site visitors.
// All three tables are restored atomically. An exact repeat is a no-op;
// existing data that differs from the backup is never overwritten.
export const importPortfolio = internalMutation({
  args: {
    job_history: v.array(v.object(jobHistoryFields)),
    education: v.array(v.object(educationFields)),
    socials: v.array(v.object(socialFields)),
  },
  handler: async (ctx, snapshot) => {
    const counts: Record<string, number> = {};
    for (const table of ["job_history", "education", "socials"] as const) {
      const incoming = snapshot[table];
      const ids = new Set(incoming.map((row) => row.id));
      if (ids.size !== incoming.length || incoming.some((row) => !Number.isSafeInteger(row.id))) {
        throw new Error(`Invalid or duplicate legacy IDs: ${table}`);
      }
      const existing = await ctx.db.query(table).collect();
      if (existing.length > 0) {
        const byId = new Map(existing.map((row) => [row.id, row]));
        const matches = existing.length === incoming.length && byId.size === existing.length &&
          incoming.every((row) => {
            const stored = byId.get(row.id);
            return stored && Object.entries(row).every(([key, value]) =>
              stored[key as keyof typeof stored] === value,
            );
          });
        if (!matches) throw new Error(`Existing data differs from backup: ${table}`);
      } else {
        for (const row of incoming) await ctx.db.insert(table, row);
      }
      counts[table] = incoming.length;
    }
    return counts;
  },
});
