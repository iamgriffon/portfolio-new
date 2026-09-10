import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { educationFields, jobHistoryFields, socialFields, techFields } from "./schema";

// Seeds only an empty table; a repeat must match exactly to avoid overwriting edits.
export const importTechs = internalMutation({
  args: { techs: v.array(v.object(techFields)) },
  returns: v.number(),
  handler: async (ctx, { techs }) => {
    if (techs.length > 1000 || new Set(techs.map((tech) => tech.id)).size !== techs.length) {
      throw new Error("Expected at most 1000 technologies with unique IDs");
    }
    const existing = await ctx.db.query("techs").withIndex("by_order_index").take(1001);
    if (existing.length > 0) {
      const matches = existing.length === techs.length && techs.every((tech, index) => {
        const stored = existing[index];
        return stored.order_index === index && stored.id === tech.id &&
          stored.name === tech.name && stored.icon === tech.icon &&
          stored.level === tech.level && stored.years === tech.years;
      });
      if (!matches) throw new Error("Existing technologies differ from seed; refusing to overwrite");
    } else {
      for (const [order_index, tech] of techs.entries()) {
        await ctx.db.insert("techs", { ...tech, order_index });
      }
    }
    return techs.length;
  },
});

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
