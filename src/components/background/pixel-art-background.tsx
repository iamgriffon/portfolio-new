import { useEffect, useRef, ReactNode, useState, useLayoutEffect } from "react";
import Image from "next/image";
import { cn } from "@/app/utils/cn";
import { useBackgroundState } from "./pixel-art-background-provider";
import { SpritePosition } from "./pixel-art-background.types";
import { sprites as defaultSprites } from "./pixel-art-background-sprites";

// Extend the SpritePosition type to include original dimensions and scale
interface EnhancedSpritePosition extends SpritePosition {
  originalWidth?: number;
  originalHeight?: number;
  originalScale?: number;
}

export default function PixelArtBackground({
  className,
  children,
  withoutSprites = false,
  withoutStars = false,
  withoutAnimation = false,
  withoutBouncing = false,
  sprites = [],
  spriteSize = 128,
  numberOfSprites = 12,
  minVelocity = 2.0,
  maxVelocity = 4.0,
}: {
  className?: string;
  children?: ReactNode;
  withoutSprites?: boolean;
  withoutStars?: boolean;
  withoutAnimation?: boolean;
  withoutInteraction?: boolean;
  withoutBouncing?: boolean;
  sprites?: string[];
  spriteSize?: number;
  numberOfSprites?: number;
  minVelocity?: number;
  maxVelocity?: number;
}) {
  // Get state from context
  const {
    items,
    stars,
    spritePositions,
    setSpritePositions,
  } = useBackgroundState();

  const [localSpritePositions, setLocalSpritePositions] = useState<
    EnhancedSpritePosition[]
  >([]);

  const effectiveSpritePositions =
    spritePositions.length > 0 ? spritePositions as EnhancedSpritePosition[] : localSpritePositions;

  // Function to update sprite positions in both local and global state
  const updateSpritePositions = (
    updater: EnhancedSpritePosition[] | ((prev: EnhancedSpritePosition[]) => EnhancedSpritePosition[])
  ) => {
    if (typeof updater === "function") {
      const newPositions = updater(effectiveSpritePositions);
      setLocalSpritePositions(newPositions);
      setSpritePositions(newPositions as SpritePosition[]);
    } else {
      setLocalSpritePositions(updater);
      setSpritePositions(updater as SpritePosition[]);
    }
  };

  const mousePosition = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const isAnimating = useRef(false);
  const lastUpdateTime = useRef<number>(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // If no sprites are provided, use the default sprites
  const spriteImages =
    sprites.length > 0 ? sprites : defaultSprites.map((sprite) => sprite.path);

  // Update container size and check if mobile when window size changes
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        
        // Update mobile state immediately
        setIsMobile(newWidth < 640);
        
        // Always update container size to ensure we have the latest dimensions
        setContainerSize({
          width: newWidth,
          height: newHeight,
        });
      }
    };

    // Initial size update
    updateSize();
    
    // Update on resize
    window.addEventListener("resize", updateSize);
    
    // Clean up
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Update sprite positions and sizes when container size changes
  useEffect(() => {
    if (
      effectiveSpritePositions.length === 0 || 
      containerSize.width <= 0 || 
      containerSize.height <= 0
    ) {
      return;
    }
    
    // Mobile sprites are 60% of desktop size
    const mobileSizeFactor = 0.6;
    
    const newSpriteArray = effectiveSpritePositions.map(sprite => {
      const originalWidth = sprite.originalWidth || sprite.width;
      const originalHeight = sprite.originalHeight || sprite.height;
      const originalScale = sprite.originalScale || sprite.scale;
      
      // Calculate new dimensions based on current screen size
      const newScale = isMobile ? originalScale * mobileSizeFactor : originalScale;
      const newWidth = isMobile ? Math.round(originalWidth * mobileSizeFactor) : originalWidth;
      const newHeight = isMobile ? Math.round(originalHeight * mobileSizeFactor) : originalHeight;
      
      const relativeX = containerSize.width > sprite.width ?
        sprite.x / (containerSize.width - sprite.width) : 0.5;
      const relativeY = containerSize.height > sprite.height ?
        sprite.y / (containerSize.height - sprite.height) : 0.5;
      
      // Clamp relative position to valid range
      const clampedRelX = Math.min(Math.max(0, relativeX), 1);
      const clampedRelY = Math.min(Math.max(0, relativeY), 1);
      
      // Calculate new position ensuring sprite stays within bounds
      const maxX = Math.max(0, containerSize.width - newWidth);
      const maxY = Math.max(0, containerSize.height - newHeight);
      
      const newX = clampedRelX * maxX;
      const newY = clampedRelY * maxY;
      
      // Create a completely new sprite object
      return {
        id: sprite.id,
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
        scale: newScale,
        velocityX: sprite.velocityX,
        velocityY: sprite.velocityY,
        spritePath: sprite.spritePath,
        name: sprite.name,
        originalWidth: originalWidth,
        originalHeight: originalHeight,
        originalScale: originalScale,
        // Add a timestamp to force React to recognize this as a new object
        _lastResized: Date.now()
      };
    });
    
    // Directly set the new sprite array rather than updating existing one
    setLocalSpritePositions(newSpriteArray);
    setSpritePositions(newSpriteArray as SpritePosition[]);
    
  }, [containerSize.width, containerSize.height, isMobile, effectiveSpritePositions.length]);

  // Add a layout effect that runs before the render phase to ensure sprite dimensions
  // are updated immediately when screen size changes
  useLayoutEffect(() => {
    // Skip if we already checked in the regular useEffect
    if (
      effectiveSpritePositions.length === 0 || 
      containerSize.width <= 0 || 
      containerSize.height <= 0
    ) {
      return;
    }
    
    // This is the same logic as the resize effect, but in a layout effect
    // which runs synchronously before browser paint
    const mobileSizeFactor = 0.6;
    
    const updateDimensions = () => {
      setLocalSpritePositions(prev => 
        prev.map(sprite => {
          const originalWidth = sprite.originalWidth || sprite.width;
          const originalHeight = sprite.originalHeight || sprite.height;
          
          const newWidth = isMobile ? 
            Math.round(originalWidth * mobileSizeFactor) : 
            originalWidth;
          const newHeight = isMobile ? 
            Math.round(originalHeight * mobileSizeFactor) : 
            originalHeight;
          
          return { 
            ...sprite, 
            width: newWidth, 
            height: newHeight,
            _lastResized: Date.now() 
          };
        })
      );
    };
    
    // Run the dimension update immediately
    updateDimensions();
  }, [isMobile]);

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mousePosition.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Initialize sprite positions with random locations and velocities
  useEffect(() => {
    // Skip if container size is not set, no sprites, or sprites are disabled
    if (
      containerSize.width === 0 ||
      containerSize.height === 0 ||
      spriteImages.length === 0 ||
      withoutSprites ||
      withoutBouncing
    )
      return;

    // If we already have sprite positions in global state, use those
    if (spritePositions.length > 0) return;

    // If we already have local sprite positions, don't reinitialize
    if (localSpritePositions.length > 0) return;
    
    // Adjust sprite size for mobile screens - make them significantly smaller
    const mobileSizeFactor = 0.5; // 60% of original size on mobile
    
    // Limit the number of sprites based on available sprites
    const actualNumberOfSprites = Math.min(
       numberOfSprites,
      isMobile ? spriteImages.length * 0.8 : spriteImages.length
    );

    const initialPositions: EnhancedSpritePosition[] = Array.from({
      length: actualNumberOfSprites,
    }).map((_, index) => {
      // Generate random position and velocity
      const randomVelocityX =
        (Math.random() * (maxVelocity - minVelocity) + minVelocity) *
        (Math.random() > 0.5 ? 1 : -1);
      const randomVelocityY =
        (Math.random() * (maxVelocity - minVelocity) + minVelocity) *
        (Math.random() > 0.5 ? 1 : -1);
      
      // Convert displaySize to proper scale factor (divide by 100)
      let spriteScale = defaultSprites[index].displaySize / 100;
      
      // Further reduce sprite scale on mobile
      if (isMobile) {
        spriteScale *= mobileSizeFactor;
      }
      
      // Calculate actual width and height based on scale
      const scaledWidth = isMobile 
        ? Math.round(defaultSprites[index].width * mobileSizeFactor)
        : defaultSprites[index].width;
        
      const scaledHeight = isMobile
        ? Math.round(defaultSprites[index].height * mobileSizeFactor)
        : defaultSprites[index].height;

      return {
        id: index,
        x: Math.random() * (containerSize.width - scaledWidth),
        y: Math.random() * (containerSize.height - scaledHeight),
        velocityX: randomVelocityX,
        velocityY: randomVelocityY,
        width: scaledWidth,
        height: scaledHeight,
        spritePath: spriteImages[index % spriteImages.length],
        scale: spriteScale,
        name: defaultSprites[index].name,
        // Store original dimensions for resizing
        originalWidth: defaultSprites[index].width,
        originalHeight: defaultSprites[index].height,
        originalScale: defaultSprites[index].displaySize / 100
      };
    });

    updateSpritePositions(initialPositions);
  }, [
    containerSize,
    spriteImages,
    numberOfSprites,
    spriteSize,
    minVelocity,
    maxVelocity,
    withoutSprites,
    withoutBouncing,
    spritePositions.length,
    localSpritePositions.length,
    setSpritePositions,
    isMobile,
  ]);

  // Helper function to detect collision between two sprites
  const detectCollision = (
    spriteA: EnhancedSpritePosition,
    spriteB: EnhancedSpritePosition
  ): boolean => {
    return (
      spriteA.x < spriteB.x + spriteB.width &&
      spriteA.x + spriteA.width > spriteB.x &&
      spriteA.y < spriteB.y + spriteB.height &&
      spriteA.y + spriteA.height > spriteB.y
    );
  };

  // Helper function to resolve collision with improved physics
  const resolveCollision = (
    spriteA: EnhancedSpritePosition,
    spriteB: EnhancedSpritePosition
  ): void => {
    // Detect if we're on a mobile device for collision adjustment
    const isMobileView = containerSize.width < 640;
    
    // Calculate center points of each sprite
    const centerAX = spriteA.x + spriteA.width / 2;
    const centerAY = spriteA.y + spriteA.height / 2;
    const centerBX = spriteB.x + spriteB.width / 2;
    const centerBY = spriteB.y + spriteB.height / 2;

    // Calculate direction vector between centers
    const directionX = centerBX - centerAX;
    const directionY = centerBY - centerAY;

    // Normalize direction vector
    const length = Math.sqrt(directionX * directionX + directionY * directionY);
    if (length === 0) return;

    const normalizedDirX = directionX / length;
    const normalizedDirY = directionY / length;

    // Calculate overlap - slightly move sprites apart
    const overlap = (spriteA.width + spriteB.width) / 2 - length;
    if (overlap <= 0) return;

    // Move sprites in opposite directions - proportionally less on mobile
    const repositionFactor = isMobileView ? 0.6 : 0.5; // Less aggressive movement on mobile
    spriteA.x -= (normalizedDirX * overlap) * repositionFactor;
    spriteA.y -= (normalizedDirY * overlap) * repositionFactor;
    spriteB.x += (normalizedDirX * overlap) * repositionFactor;
    spriteB.y += (normalizedDirY * overlap) * repositionFactor;

    // Calculate new velocities based on elastic collision
    // Create a normalized collision vector
    const vCollisionX = centerBX - centerAX;
    const vCollisionY = centerBY - centerAY;
    const distance = Math.sqrt(
      vCollisionX * vCollisionX + vCollisionY * vCollisionY
    );
    const nx = vCollisionX / distance;
    const ny = vCollisionY / distance;

    // Calculate relative velocity
    const dvx = spriteB.velocityX - spriteA.velocityX;
    const dvy = spriteB.velocityY - spriteA.velocityY;

    // Calculate velocity along the collision normal
    const velocityAlongNormal = dvx * nx + dvy * ny;

    // Don't proceed if objects are moving away from each other
    if (velocityAlongNormal > 0) return;

    // Use a lower restitution coefficient on mobile for gentler bounces
    const restitution = isMobileView ? 0.65 : 0.8;
    let impulse = -(1 + restitution) * velocityAlongNormal;
    impulse /= 2; // Equal mass assumption
    
    // Reduce impulse slightly on mobile for more stable collisions
    if (isMobileView) {
      impulse *= 0.85;
    }

    // Apply impulse
    spriteA.velocityX -= impulse * nx;
    spriteA.velocityY -= impulse * ny;
    spriteB.velocityX += impulse * nx;
    spriteB.velocityY += impulse * ny;

    // Add slight random perturbation on mobile to avoid sprites getting stuck
    if (isMobileView) {
      const jitter = 0.2;
      spriteA.velocityX += (Math.random() - 0.5) * jitter;
      spriteA.velocityY += (Math.random() - 0.5) * jitter;
      spriteB.velocityX += (Math.random() - 0.5) * jitter;
      spriteB.velocityY += (Math.random() - 0.5) * jitter;
    }

    // Ensure velocities stay moderate
    const enforceModerateVelocity = (sprite: EnhancedSpritePosition) => {
      const speed = Math.sqrt(
        sprite.velocityX * sprite.velocityX +
          sprite.velocityY * sprite.velocityY
      );
      
      // Use more moderate min/max velocities on mobile devices
      const effectiveMinVelocity = isMobileView ? minVelocity * 0.8 : minVelocity;
      const effectiveMaxVelocity = isMobileView ? maxVelocity * 0.9 : maxVelocity;
      
      if (speed < effectiveMinVelocity) {
        const factor = effectiveMinVelocity / (speed || 0.001); // Avoid division by zero
        sprite.velocityX *= factor;
        sprite.velocityY *= factor;
      } else if (speed > effectiveMaxVelocity) {
        const factor = effectiveMaxVelocity / speed;
        sprite.velocityX *= factor;
        sprite.velocityY *= factor;
      }
    };

    enforceModerateVelocity(spriteA);
    enforceModerateVelocity(spriteB);
  };

  // Animation loop for moving sprites
  useEffect(() => {
    if (
      effectiveSpritePositions.length === 0 ||
      withoutAnimation ||
      withoutBouncing
    )
      return;

    // Reset animation if it's already running
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = 0;
    }

    // Reset the last update time
    lastUpdateTime.current = 0;
    
    // Set animation flag to true
    isAnimating.current = true;

    const currentUpdateSpritePositions = updateSpritePositions;
    const currentResolveCollision = resolveCollision;
    const currentDetectCollision = detectCollision;
    const currentMinVelocity = minVelocity;
    const currentMaxVelocity = maxVelocity;
    const currentContainerWidth = containerSize.width;
    const currentContainerHeight = containerSize.height;
    const currentIsMobile = isMobile;

    const updatePositions = (timestamp: number) => {
      if (!lastUpdateTime.current) {
        lastUpdateTime.current = timestamp;
      }

      // Limit delta time to avoid large jumps during slowdowns or tab switching
      const deltaTime = Math.min(timestamp - lastUpdateTime.current, 30);
      lastUpdateTime.current = timestamp;

      // Skip updating if container width or height is 0
      if (currentContainerWidth <= 0 || currentContainerHeight <= 0) {
        if (isAnimating.current) {
          animationRef.current = requestAnimationFrame(updatePositions);
        }
        return;
      }

      // Adjust physics parameters based on screen size
      const isMobileView = currentIsMobile;
      
      // Mobile-specific physics adjustments
      const velocityFactor = isMobileView ? 0.85 : 1.0;
      
      // More forgiving physics for mobile
      const bounceElasticity = isMobileView ? 0.7 : 0.9;
      const frictionFactor = isMobileView ? 0.98 : 0.995; // Slightly more friction on mobile
      
      currentUpdateSpritePositions((prevPositions: EnhancedSpritePosition[]) => {
        const newPositions = [...prevPositions];
        for (let i = 0; i < newPositions.length; i++) {
          const sprite = newPositions[i];

          // Store original properties if not already set
          // This preserves dimensions during animation
          if (!sprite.originalWidth) sprite.originalWidth = sprite.width;
          if (!sprite.originalHeight) sprite.originalHeight = sprite.height;
          if (!sprite.originalScale) sprite.originalScale = sprite.scale;

          // Preserve current dimensions based on isMobile state
          // This ensures animation loop doesn't undo our resize effect
          const mobileSizeFactor = 0.6;
          const expectedWidth = isMobileView ? 
            Math.round((sprite.originalWidth || sprite.width) * mobileSizeFactor) : 
            (sprite.originalWidth || sprite.width);
          const expectedHeight = isMobileView ? 
            Math.round((sprite.originalHeight || sprite.height) * mobileSizeFactor) : 
            (sprite.originalHeight || sprite.height);
          
          // Only update position, not dimensions
          sprite.width = expectedWidth;
          sprite.height = expectedHeight;

          // Apply slight friction to velocity for more controlled movement on mobile
          sprite.velocityX *= frictionFactor;
          sprite.velocityY *= frictionFactor;

          // Use smoother motion calculation with fixed timestep
          const speedFactor = deltaTime / 16;
          
          // Apply velocity with size-based adjustment
          sprite.x += sprite.velocityX * speedFactor * velocityFactor;
          sprite.y += sprite.velocityY * speedFactor * velocityFactor;

          // Cap maximum velocity - lower on mobile
          const maxSpeed = isMobileView ? currentMaxVelocity * 0.9 : currentMaxVelocity * 1.2;
          
          if (Math.abs(sprite.velocityX) > maxSpeed) {
            sprite.velocityX = maxSpeed * Math.sign(sprite.velocityX);
          }

          if (Math.abs(sprite.velocityY) > maxSpeed) {
            sprite.velocityY = maxSpeed * Math.sign(sprite.velocityY);
          }

          // Apply minimum velocity to ensure movement
          const minSpeed = isMobileView ? currentMinVelocity * 0.8 : currentMinVelocity;
          const currentSpeed = Math.sqrt(sprite.velocityX * sprite.velocityX + sprite.velocityY * sprite.velocityY);
          
          if (currentSpeed < minSpeed) {
            // If speed is too low, boost it
            const factor = minSpeed / (currentSpeed || 0.001); // Avoid division by zero
            sprite.velocityX *= factor;
            sprite.velocityY *= factor;
          }

          // Boundary collisions with bounce
          if (sprite.x <= 0) {
            sprite.x = 0;
            sprite.velocityX = Math.abs(sprite.velocityX) * bounceElasticity;
          } else if (sprite.x + sprite.width >= currentContainerWidth) {
            sprite.x = currentContainerWidth - sprite.width;
            sprite.velocityX = -Math.abs(sprite.velocityX) * bounceElasticity;
          }

          if (sprite.y <= 0) {
            sprite.y = 0;
            sprite.velocityY = Math.abs(sprite.velocityY) * bounceElasticity;
          } else if (sprite.y + sprite.height >= currentContainerHeight) {
            sprite.y = currentContainerHeight - sprite.height;
            sprite.velocityY = -Math.abs(sprite.velocityY) * bounceElasticity;
          }
        }

        // Check collisions between sprites
        for (let i = 0; i < newPositions.length; i++) {
          for (let j = i + 1; j < newPositions.length; j++) {
            const spriteA = newPositions[i];
            const spriteB = newPositions[j];

            if (currentDetectCollision(spriteA, spriteB)) {
              currentResolveCollision(spriteA, spriteB);
            }
          }
        }

        return newPositions;
      });

      if (!isAnimating.current) return;

      animationRef.current = requestAnimationFrame(updatePositions);
    };

    animationRef.current = requestAnimationFrame(updatePositions);

    return () => {
      isAnimating.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [effectiveSpritePositions.length, withoutAnimation, withoutBouncing, isMobile, containerSize.width, containerSize.height]);

  if (withoutAnimation) {
    return (
      <div
        ref={containerRef}
        className={cn(
          "fixed top-0 left-0 w-full h-full flex justify-center pb-10 -z-10 overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800",
          className
        )}
      >
        {items.map((item) => (
          <div key={item.id}>
            <Image
              src={item.path}
              alt={item.name}
              width={item.width}
              height={item.height}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed top-0 left-0 w-screen h-screen overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800",
        className
      )}
      style={{
        perspective: "1000px",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden"
      }}
    >
      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: var(--base-opacity, 0.5);
            transform: scale(var(--min-scale, 0.7));
          }
          50% {
            opacity: 1;
            transform: scale(var(--max-scale, 1.25));
          }
        }

        .bg-star {
          position: absolute;
          border-radius: 50%;
          background-color: white;
          pointer-events: none;
        }

        .twinkle-star {
          animation: twinkle var(--twinkle-speed, 3s) infinite;
          animation-timing-function: ease-in-out;
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none">
        {!withoutStars &&
          stars.map((star) => (
            <div
              key={`star-${star.id}`}
              className={`bg-star ${star.twinkle ? "twinkle-star" : ""}`}
              style={
                {
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  top: star.top,
                  left: star.left,
                  opacity: star.opacity,
                  animationDuration: !star.twinkle
                    ? star.animationDuration
                    : undefined,
                  animationDelay: !star.twinkle
                    ? star.animationDelay
                    : undefined,
                  "--base-opacity": star.opacity,
                  "--twinkle-speed": star.twinkleSpeed,
                  "--min-scale": star.twinkle ? "0.8" : "1",
                  "--max-scale": star.twinkle
                    ? `${1 + star.twinkleIntensity}`
                    : "1",
                } as React.CSSProperties
              }
            />
          ))}
      </div>

      {!withoutSprites && (
        <>
          {!withoutBouncing &&
            effectiveSpritePositions.map((sprite) => (
              <div
                key={`bouncing-sprite-${sprite.id}-${Math.random()}`}
                className="absolute will-change-transform"
                style={{
                  width: `${sprite.width}px`,
                  height: `${sprite.height}px`,
                  transform: `translate3d(${sprite.x}px, ${sprite.y}px, 0) scale(${isMobile ? 0.6 : 1})`,
                  transformOrigin: "center",
                  filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))",
                  pointerEvents: "none"
                }}
              >
                <img
                  key={`sprite-img-${sprite.id}-${Math.random()}`}
                  src={sprite.spritePath}
                  alt={sprite.name || "pixel sprite"}
                  width={sprite.originalWidth}
                  height={sprite.originalHeight}
                  className={cn(
                    "w-full h-full [image-rendering:pixelated] select-none object-contain"
                  )}
                  draggable={false}
                />
              </div>
            ))}
        </>
      )}
      {children}
    </div>
  );
}
