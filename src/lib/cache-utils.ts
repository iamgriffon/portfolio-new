import 'server-only';
import { unstable_cache } from 'next/cache';

// Cache configuration types
export type CacheOptions = {
  revalidate?: number; // Time in seconds
  tags?: string[];     // Cache tags for manual revalidation
};

// Default cache options
const defaultCacheOptions: CacheOptions = {
  revalidate: 3600,    // Default revalidation time: 1 hour
  tags: ['supabase'],  // Default tag for all Supabase data
};

/**
 * Creates a cached version of an async function with configurable revalidation
 * @param fn The async function to cache
 * @param keyParts Parts to include in the cache key
 * @param options Cache options (revalidate time and tags)
 * @returns A cached version of the function
 */
export function createCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyParts: string[],
  options: CacheOptions = {}
): T {
  const cacheOptions = {
    ...defaultCacheOptions,
    ...options,
  };
  
  return unstable_cache(
    fn,
    [...keyParts],
    {
      revalidate: cacheOptions.revalidate,
      tags: cacheOptions.tags,
    }
  ) as T;
}

/**
 * Utility function to generate a queryKey for caching
 * @param prefix The prefix for the key
 * @param params Additional parameters to include in the key
 * @returns A formatted cache key
 */
export function createQueryKey(prefix: string, params: Record<string, any> = {}): string[] {
  const keyParts = [prefix];
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      keyParts.push(`${key}:${JSON.stringify(value)}`);
    }
  });
  
  return keyParts;
} 