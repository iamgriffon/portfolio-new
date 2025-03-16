import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-6xl font-bold text-white">404</h1>
      <h2 className="text-2xl font-semibold mt-4 text-white">Page Not Found</h2>
      <p className="mt-4 text-gray-400 max-w-lg">
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>
      <Link 
        href="/"
        className="mt-8 px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-md transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
} 