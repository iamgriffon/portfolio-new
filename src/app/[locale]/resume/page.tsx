import { Suspense } from 'react';
import { preloadQuery } from 'convex/nextjs';
import { api } from '../../../../convex/_generated/api';
import { getSocialLinks } from '@/db/convex';
import ResumeClient from './client';

export default async function ResumePage() {
  try {
    const [jobHistory, education, contacts] = await Promise.all([
      preloadQuery(api.portfolio.jobHistory, {}),
      preloadQuery(api.portfolio.education, {}),
      getSocialLinks(),
    ]);
    
    return (
      <Suspense fallback={<div className="flex justify-center items-center h-screen z-20">Loading resume data...</div>}>
        <ResumeClient jobHistory={jobHistory} education={education} contacts={contacts} />
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
