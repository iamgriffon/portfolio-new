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
  
  // Transform the data to match JobHistoryItem interface
  return (data || []).map(job => ({
    ...job,
    position: job.en_position // Set default position to English for backward compatibility
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
  
  // Transform the data to match EducationItem interface
  return (data || []).map(edu => ({
    ...edu,
    field: '', // Add missing field property
    en_description: edu.en_achievements || '',
    ptbr_description: edu.ptbr_achievements || '',
    zh_description: edu.zh_achievements || '',
    achievements: edu.en_achievements // Set achievements to English for backward compatibility
  })) as EducationItem[];
} 