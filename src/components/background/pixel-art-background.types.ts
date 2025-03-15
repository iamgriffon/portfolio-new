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

export interface Sprite {
  id: number;
  size: number;
  top: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
  opacity: number;
  checkBoundary?: (boundaryRect: DOMRect | null) => void;
}

export interface SpritePosition {
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

export interface PixelArtBackgroundProps {
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

export type { PixelItem, Star };
