import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const nullableString = v.union(v.string(), v.null());
const commonFields = {
  id: v.number(),
  created_at: v.string(),
  order_index: v.union(v.number(), v.null()),
};

export const jobHistoryFields = {
  ...commonFields,
  company: v.string(),
  en_position: v.string(),
  ptbr_position: v.string(),
  zh_position: v.string(),
  es_position: nullableString,
  start_date: v.string(),
  end_date: nullableString,
  image_url: nullableString,
  technologies: nullableString,
  achievements: nullableString,
  url: nullableString,
};

export const educationFields = {
  ...commonFields,
  institution: v.string(),
  en_degree: v.string(),
  ptbr_degree: v.string(),
  zh_degree: v.string(),
  es_degree: nullableString,
  start_date: v.string(),
  end_date: nullableString,
  image_url: nullableString,
  en_achievements: nullableString,
  ptbr_achievements: nullableString,
  zh_achievements: nullableString,
  es_achievements: nullableString,
  technologies: nullableString,
  url: nullableString,
  degree_url: nullableString,
};

export const socialFields = {
  ...commonFields,
  social_media: nullableString,
  user_name: nullableString,
  profile_url: nullableString,
};

export default defineSchema({
  job_history: defineTable(jobHistoryFields).index("by_order", ["order_index"]),
  education: defineTable(educationFields).index("by_order", ["order_index"]),
  socials: defineTable(socialFields).index("by_order", ["order_index"]),
});
