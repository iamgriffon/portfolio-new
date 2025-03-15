'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PixelItem, Star, SpritePosition } from './pixel-art-background.types';
import { sprites } from './pixel-art-background-sprites';
import { usePathname } from 'next/navigation';

// Define context type
interface BackgroundStateContextType {
  items: PixelItem[];
  setItems: React.Dispatch<React.SetStateAction<PixelItem[]>>;
  stars: Star[];
  isInitialized: boolean;
  hasVisitedProjects: boolean;
  setHasVisitedProjects: (value: boolean) => void;
  spritePositions: SpritePosition[];
  setSpritePositions: (positions: SpritePosition[]) => void;
  windowSize: { width: number; height: number };
  resetSprites: () => void;
}

// Create context with default values
const BackgroundStateContext = createContext<BackgroundStateContextType | undefined>(undefined);

// Hook to use the context
export const useBackgroundState = () => {
  const context = useContext(BackgroundStateContext);
  if (!context) {
    throw new Error('useBackgroundState must be used within a BackgroundStateProvider');
  }
  return context;
};

// Create a stable reference that persists across page navigations
const globalBackgroundState: {
  items: PixelItem[];
  stars: Star[];
  initialized: boolean;
  spritePositions: SpritePosition[];
  lastPathname: string;
} = {
  items: [],
  stars: [],
  initialized: false,
  spritePositions: [],
  lastPathname: ''
};

export const BackgroundStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<PixelItem[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasVisitedProjects, setHasVisitedProjects] = useState(false);
  const [spritePositions, setSpritePositions] = useState<SpritePosition[]>([]);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const pathname = usePathname();

  // Reset sprites to a valid state
  const resetSprites = () => {
    if (spritePositions.length === 0) return;
    
    // Get current window dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Reset sprite positions to be within bounds and with reasonable velocities
    const resetPositions = spritePositions.map((sprite) => {
      // Ensure position is within screen bounds
      const newX = Math.min(Math.max(0, sprite.x), width - sprite.width);
      const newY = Math.min(Math.max(0, sprite.y), height - sprite.height);
      
      // Reset velocities to reasonable values
      const randomVelocityX = (Math.random() * 2 + 1) * (Math.random() > 0.5 ? 1 : -1);
      const randomVelocityY = (Math.random() * 2 + 1) * (Math.random() > 0.5 ? 1 : -1);
      
      return {
        ...sprite,
        x: newX,
        y: newY,
        velocityX: randomVelocityX,
        velocityY: randomVelocityY
      };
    });
    
    setSpritePositions(resetPositions);
    globalBackgroundState.spritePositions = resetPositions;
  };

  // Track page changes
  useEffect(() => {
    // If we detect a page change (especially returning from projects)
    if (pathname && globalBackgroundState.lastPathname !== pathname) {
      // Give the DOM time to update before adjusting sprites
      setTimeout(resetSprites, 50);
      globalBackgroundState.lastPathname = pathname;
    }
  }, [pathname]);

  // Get window dimensions
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize once or load from global state
  useEffect(() => {
    if (globalBackgroundState.initialized) {
      // If already initialized globally, use that state
      setItems(globalBackgroundState.items);
      setStars(globalBackgroundState.stars);
      
      // Load sprite positions from global state if they exist
      if (globalBackgroundState.spritePositions.length > 0) {
        setSpritePositions(globalBackgroundState.spritePositions);
      }
    } else {
      // Initial setup code for sprites and stars
      // ...your existing initialization logic
      
      globalBackgroundState.initialized = true;
      globalBackgroundState.lastPathname = pathname || '';
    }
  }, []);
  
  // Keep global state updated
  useEffect(() => {
    if (items.length > 0) {
      globalBackgroundState.items = items;
    }
  }, [items]);
  
  useEffect(() => {
    if (stars.length > 0) {
      globalBackgroundState.stars = stars;
    }
  }, [stars]);
  
  // Update global sprite positions with throttling for performance
  useEffect(() => {
    if (spritePositions.length === 0) return;
    
    // Throttle updates to global state to improve performance
    const updateTimeout = setTimeout(() => {
      globalBackgroundState.spritePositions = spritePositions;
    }, 500);
    
    return () => clearTimeout(updateTimeout);
  }, [spritePositions]);

  // Initialize stars and sprites once on client-side
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isInitialized) return;

    const generatedStars = Array.from({ length: 200 }, (_, i) => ({
      id: i,
      size: Math.random() * 2 + 2, // Size between 2-4px
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 2}s`,
      opacity: Math.random() * 0.7 + 0.3,
      twinkle: Math.random() > 0.3, // 70% of stars will twinkle
      twinkleSpeed: `${Math.random() * 3 + 1}s`, // Random twinkling speed
      twinkleIntensity: Math.random() * 0.5 + 0.5, // How much the opacity varies
    }));
    setStars(generatedStars);

    // Initialize sprites with random positions
    const { width, height } = windowSize;

    const initializedItems = sprites.map((item) => {
      // Ensure we don't position sprites outside the viewport
      const x = Math.min(Math.random() * (width - item.displaySize), width - item.displaySize);
      const y = Math.min(Math.random() * (height - item.displaySize), height - item.displaySize);
      
      return {
        ...item,
        x: Math.max(0, x),
        y: Math.max(0, y),
        rotation: 0,
        scale: 1,
        speedX: (Math.random() - 0.5) * 1.0, // Reduced speed slightly
        speedY: (Math.random() - 0.5) * 1.0,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
      };
    });
    
    setItems(initializedItems);
    setIsInitialized(true);
    console.log("Background initialized with", initializedItems.length, "sprites and", generatedStars.length, "stars");
  }, [isInitialized, windowSize]);

  return (
    <BackgroundStateContext.Provider 
      value={{ 
        items, 
        setItems, 
        stars, 
        isInitialized, 
        hasVisitedProjects, 
        setHasVisitedProjects,
        spritePositions,
        setSpritePositions,
        windowSize,
        resetSprites
      }}
    >
      {children}
    </BackgroundStateContext.Provider>
  );
}; 