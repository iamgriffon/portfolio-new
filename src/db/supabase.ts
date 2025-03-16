import { createClient } from '@supabase/supabase-js';
import { JobHistoryItem, EducationItem } from '@/app/[locale]/resume/types';

export type JobHistory = {
  id: number;
  company: string;
  en_position: string;
  ptbr_position: string;
  zh_position: string;
  start_date: string;
  end_date: string | null;
  technologies: string;
  url: string;
  order_index: number;
  image_url: string | null;
};

export type Education = {
  id: number;
  institution: string;
  en_degree: string;
  ptbr_degree: string;
  zh_degree: string;
  start_date: string;
  end_date: string | null;
  en_achievements: string | null;
  ptbr_achievements: string | null;
  zh_achievements: string | null;
  url: string;
  order_index: number;
  degree_url: string | null;
  technologies: string | null;
};

export type SocialLink = {
  social_media: string;
  user_name: string;
  profile_url: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Check your .env.local file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We don't need auth persistence for our portfolio
  },
});

export async function getJobHistory(): Promise<JobHistoryItem[]> {
  const { data, error } = await supabase
    .from('job_history')
    .select('*')
    .order('order_index', { ascending: true });
  
  if (error) {
    console.error('Error fetching job history:', error);
    throw error;
  }
  console.log({data})
  return (data || []).map(job => ({
    ...job,
  })) as JobHistoryItem[];
}

export async function getEducation(): Promise<EducationItem[]> {
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .order('order_index', { ascending: true });
  
  if (error) {
    console.error('Error fetching education:', error);
    throw error;
  }
  
  return (data || []).map(edu => ({
    ...edu,
    en_description: edu.en_achievements || '',
    ptbr_description: edu.ptbr_achievements || '',
    zh_description: edu.zh_achievements || '',
  })) as EducationItem[];
} 

export async function getSocialLinks(): Promise<SocialLink[]> {
  const { data, error } = await supabase
    .from('socials')
    .select('social_media, user_name, profile_url')
    .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching social links:', error);
      throw error;
    }

    return (data || []).map(link => ({
      ...link,
    })) as SocialLink[];
}
