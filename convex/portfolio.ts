import { query } from "./_generated/server";

// PostgreSQL sorts NULL last in ascending order; Convex sorts it first.
function nullsLast<T extends { order_index: number | null }>(rows: T[]): T[] {
  return rows.filter((row) => row.order_index !== null).concat(
    rows.filter((row) => row.order_index === null),
  );
}

// Portfolio content is public. Writes are restricted to the dashboard/CLI.
export const jobHistory = query({
  args: {},
  handler: async (ctx) =>
    nullsLast(await ctx.db.query("job_history").withIndex("by_order").collect()),
});

export const education = query({
  args: {},
  handler: async (ctx) =>
    nullsLast(await ctx.db.query("education").withIndex("by_order").collect()),
});

export const socialLinks = query({
  args: {},
  handler: async (ctx) => {
    const rows = nullsLast(await ctx.db.query("socials").withIndex("by_order").collect());
    return rows.flatMap(({ social_media, user_name, profile_url }) =>
      social_media && user_name && profile_url
        ? [{ social_media, user_name, profile_url }]
        : [],
    );
  },
});
