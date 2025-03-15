interface PixelItem {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  speedX: number;
  speedY: number;
  rotationSpeed: number;
  path: string;
  name: string;
  width: number;
  height: number;
  displaySize: number;
  targetX?: number;
  targetY?: number;
  targetScale?: number;
}

interface Star {
  id: number;
  size: number;
  top: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
  opacity: number;
  twinkle: boolean;
  twinkleSpeed: string;
  twinkleIntensity: number;
}

interface Sprite {
  id: number;
  size: number;
  top: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
  opacity: number;
  checkBoundary?: (boundaryRect: DOMRect | null) => void;
}

interface SpritePosition {
  id: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  width: number;
  height: number;
  spritePath: string;
  name: string;
  scale: number;
}

interface PixelArtBackgroundProps {
  sprites?: string[];
  spriteSize?: number;
  numberOfSprites?: number;
  minVelocity?: number;
  maxVelocity?: number;
  withoutBouncing?: boolean;
  withoutSprites?: boolean;
  withoutStars?: boolean;
  withoutAnimation?: boolean;
  withoutInteraction?: boolean;
}

interface AnimationStateContextType {
  hasAnimated: boolean;
  setHasAnimated: (value: boolean) => void;
}

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

export type {
  PixelItem,
  Star,
  Sprite,
  SpritePosition,
  PixelArtBackgroundProps,
  AnimationStateContextType,
  BackgroundStateContextType,
};
