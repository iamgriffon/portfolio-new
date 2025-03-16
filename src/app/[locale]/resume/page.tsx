import { Suspense } from 'react';
import { getJobHistory, getEducation } from '@/db/supabase';
import ResumeClient from './client';

export default async function ResumePage() {
  try {
    // Fetch resume data from Supabase
    const jobHistory = await getJobHistory();
    const education = await getEducation();
    
    return (
      <Suspense fallback={<div className="flex justify-center items-center h-screen z-20">Loading resume data...</div>}>
        <ResumeClient jobHistory={jobHistory} education={education} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error loading resume data:', error);
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h2 className="text-xl font-bold mb-2">Failed to load resume data</h2>
        <p>Please try refreshing the page</p>
      </div>
    );
  }
} 