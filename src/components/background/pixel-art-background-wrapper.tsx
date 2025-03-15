'use client';

import dynamic from 'next/dynamic';
import { ReactNode, useEffect } from 'react';
import { useBackgroundState } from './pixel-art-background-provider';
import { usePathname } from 'next/navigation';

// Import the PixelArtBackground component with no SSR to avoid hydration errors
const PixelArtBackground = dynamic(
  () => import('@/components/background/pixel-art-background'),
  { ssr: false }
);

export default function BackgroundWrapper({ children }: { children: ReactNode }) {
  const { resetSprites } = useBackgroundState();
  const pathname = usePathname();
  
  // Handle page transitions and ensure sprites are reset when needed
  useEffect(() => {
    // Small delay to ensure the DOM has updated
    const timeoutId = setTimeout(() => {
      resetSprites();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [pathname, resetSprites]);
  
  return <PixelArtBackground>{children}</PixelArtBackground>;
} 