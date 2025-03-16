'use client';

import dynamic from 'next/dynamic';
import { ReactNode, useEffect } from 'react';
import { useBackgroundState } from './pixel-art-background-provider';
import { usePathname } from 'next/navigation';

const PixelArtBackground = dynamic(
  () => import('@/components/background/pixel-art-background'),
  { ssr: false }
);

export default function BackgroundWrapper({ children }: { children: ReactNode }) {
  const { resetSprites } = useBackgroundState();
  const pathname = usePathname();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      resetSprites();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [pathname, resetSprites]);
  
  return <PixelArtBackground>{children}</PixelArtBackground>;
} 