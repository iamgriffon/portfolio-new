import { Suspense } from 'react';
import { getJobHistory, getEducation } from '@/db/schema';
import ResumeClient from './client';

export default async function ResumePage() {
  const jobHistory = await getJobHistory();
  const education = await getEducation();
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading resume data...</div>}>
      <ResumeClient jobHistory={jobHistory} education={education} />
    </Suspense>
  );
} 