import 'server-only';
import { fetchQuery } from 'convex/nextjs';
import { api } from '../../convex/_generated/api';
import { createCache, createQueryKey } from '@/lib/cache-utils';

export type SocialLink = {
  social_media: string;
  user_name: string;
  profile_url: string;
};

async function fetchSocialLinks(): Promise<SocialLink[]> {
  return fetchQuery(api.portfolio.socialLinks, {});
}

// Include the backend URL so a deployment switch cannot reuse Supabase data.
const cacheScope = { backend: 'convex', url: process.env.NEXT_PUBLIC_CONVEX_URL };

export const getSocialLinks = createCache(
  fetchSocialLinks,
  createQueryKey('socialLinks', cacheScope),
  { revalidate: 3600, tags: ['socialLinks'] },
);
