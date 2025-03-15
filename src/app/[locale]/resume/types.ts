export interface JobHistoryItem {
  id: number;
  company: string;
  position: string;
  start_date: string;
  end_date: string | null;
  en_position: string;
  ptbr_position: string;
  zh_position: string;
  technologies: string | null;
  achievements: string | null;
  url: string | null;
  order_index: number;
  image_url: string | null;
}

export interface EducationItem {
  id: number;
  institution: string;
  en_degree: string;
  ptbr_degree: string;
  zh_degree: string;
  field: string;
  start_date: string;
  end_date: string | null;
  en_description: string;
  ptbr_description: string;
  zh_description: string;
  achievements: string | null;
  url: string | null;
  order_index: number;
  image_url: string | null;
  technologies: string | null;
}
