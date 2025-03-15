"use client";

import { useEffect, useRef, ReactNode, useState } from "react";
import Image from "next/image";
import { cn } from "@/app/utils/cn";
import { useBackgroundState } from "./pixel-art-background-provider";
import { SpritePosition } from "./pixel-art-background.types";
import { sprites as defaultSprites } from "./pixel-art-background-sprites";

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
    SpritePosition[]
  >([]);

  const effectiveSpritePositions =
    spritePositions.length > 0 ? spritePositions : localSpritePositions;

  // Function to update sprite positions in both local and global state
  const updateSpritePositions = (
    updater: SpritePosition[] | ((prev: SpritePosition[]) => SpritePosition[])
  ) => {
    if (typeof updater === "function") {
      const newPositions = updater(effectiveSpritePositions);
      setLocalSpritePositions(newPositions);
      setSpritePositions(newPositions);
    } else {
      setLocalSpritePositions(updater);
      setSpritePositions(updater);
    }
  };

  const mousePosition = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const isAnimating = useRef(false);
  const lastUpdateTime = useRef<number>(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // If no sprites are provided, use the default sprites
  const spriteImages =
    sprites.length > 0 ? sprites : defaultSprites.map((sprite) => sprite.path);

  // Update container size when window size changes
  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const newWidth = rect.width;
        const newHeight = rect.height;
        
        // Only update if there's a significant change to avoid unnecessary re-renders
        if (Math.abs(newWidth - containerSize.width) > 5 || Math.abs(newHeight - containerSize.height) > 5) {
          setContainerSize({
            width: newWidth,
            height: newHeight,
          });
          
          // When container size changes, adjust sprite positions to stay within bounds
          if (effectiveSpritePositions.length > 0 && (newWidth > 0 && newHeight > 0)) {
            updateSpritePositions((prevPositions) => {
              return prevPositions.map(sprite => {
                // Calculate the new position to keep sprites in bounds
                const newX = Math.min(Math.max(0, sprite.x), newWidth - sprite.width);
                const newY = Math.min(Math.max(0, sprite.y), newHeight - sprite.height);
                
                return {
                  ...sprite,
                  x: newX,
                  y: newY
                };
              });
            });
          }
        }
      }
    };

    // Initial size update
    updateSize();
    
    // Update on resize
    window.addEventListener("resize", updateSize);
    
    // Clean up
    return () => window.removeEventListener("resize", updateSize);
  }, [containerSize.width, containerSize.height, effectiveSpritePositions.length]);

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

    // Limit the number of sprites based on available sprites
    const actualNumberOfSprites = Math.min(
      numberOfSprites,
      spriteImages.length
    );

    const initialPositions: SpritePosition[] = Array.from({
      length: actualNumberOfSprites,
    }).map((_, index) => {
      // Generate random position and velocity
      const randomVelocityX =
        (Math.random() * (maxVelocity - minVelocity) + minVelocity) *
        (Math.random() > 0.5 ? 1 : -1);
      const randomVelocityY =
        (Math.random() * (maxVelocity - minVelocity) + minVelocity) *
        (Math.random() > 0.5 ? 1 : -1);

      return {
        id: index,
        x: Math.random() * (containerSize.width - spriteSize),
        y: Math.random() * (containerSize.height - spriteSize),
        velocityX: randomVelocityX,
        velocityY: randomVelocityY,
        width: defaultSprites[index].width,
        height: defaultSprites[index].height,
        spritePath: spriteImages[index % spriteImages.length],
        scale: defaultSprites[index].displaySize,
        name: defaultSprites[index].name,
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
  ]);

  // Helper function to detect collision between two sprites
  const detectCollision = (
    spriteA: SpritePosition,
    spriteB: SpritePosition
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
    spriteA: SpritePosition,
    spriteB: SpritePosition
  ): void => {
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

    // Move sprites in opposite directions
    spriteA.x -= (normalizedDirX * overlap) / 2;
    spriteA.y -= (normalizedDirY * overlap) / 2;
    spriteB.x += (normalizedDirX * overlap) / 2;
    spriteB.y += (normalizedDirY * overlap) / 2;

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

    // Using restitution coefficient of 0.8 for moderate bounce
    const restitution = 0.8;
    let impulse = -(1 + restitution) * velocityAlongNormal;
    impulse /= 2; // Equal mass assumption

    // Apply impulse
    spriteA.velocityX -= impulse * nx;
    spriteA.velocityY -= impulse * ny;
    spriteB.velocityX += impulse * nx;
    spriteB.velocityY += impulse * ny;

    // Ensure velocities stay moderate
    const enforceModerateVelocity = (sprite: SpritePosition) => {
      const speed = Math.sqrt(
        sprite.velocityX * sprite.velocityX +
          sprite.velocityY * sprite.velocityY
      );
      if (speed < minVelocity) {
        const factor = minVelocity / speed;
        sprite.velocityX *= factor;
        sprite.velocityY *= factor;
      } else if (speed > maxVelocity) {
        const factor = maxVelocity / speed;
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

    const updatePositions = (timestamp: number) => {
      if (!lastUpdateTime.current) {
        lastUpdateTime.current = timestamp;
      }

      const deltaTime = Math.min(timestamp - lastUpdateTime.current, 100);
      lastUpdateTime.current = timestamp;

      // Skip updating if container width or height is 0
      if (currentContainerWidth <= 0 || currentContainerHeight <= 0) {
        if (isAnimating.current) {
          animationRef.current = requestAnimationFrame(updatePositions);
        }
        return;
      }

      currentUpdateSpritePositions((prevPositions: SpritePosition[]) => {
        const newPositions = [...prevPositions];

        for (let i = 0; i < newPositions.length; i++) {
          const sprite = newPositions[i];

          sprite.x += (sprite.velocityX * deltaTime) / 16;
          sprite.y += (sprite.velocityY * deltaTime) / 16;

          const maxSpeed = currentMaxVelocity * 1.5;
          if (Math.abs(sprite.velocityX) > maxSpeed) {
            sprite.velocityX = maxSpeed * Math.sign(sprite.velocityX);
          }

          if (Math.abs(sprite.velocityY) > maxSpeed) {
            sprite.velocityY = maxSpeed * Math.sign(sprite.velocityY);
          }

          if (sprite.x <= 0) {
            sprite.x = 0;
            sprite.velocityX = Math.min(
              Math.abs(sprite.velocityX) * 0.8 + currentMinVelocity,
              currentMaxVelocity
            );
          } else if (sprite.x + sprite.width >= currentContainerWidth) {
            sprite.x = currentContainerWidth - sprite.width;
            sprite.velocityX = -Math.min(
              Math.abs(sprite.velocityX) * 0.8 + currentMinVelocity,
              currentMaxVelocity
            );
          }

          if (sprite.y <= 0) {
            sprite.y = 0;
            sprite.velocityY = Math.min(
              Math.abs(sprite.velocityY) * 0.8 + currentMinVelocity,
              currentMaxVelocity
            );
          } else if (sprite.y + sprite.height >= currentContainerHeight) {
            sprite.y = currentContainerHeight - sprite.height;
            sprite.velocityY = -Math.min(
              Math.abs(sprite.velocityY) * 0.8 + currentMinVelocity,
              currentMaxVelocity
            );
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

    // Cleanup function
    return () => {
      isAnimating.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [effectiveSpritePositions.length, withoutAnimation, withoutBouncing]);

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
                key={`bouncing-sprite-${sprite.id}`}
                className="absolute will-change-transform"
                style={{
                  width: `${sprite.width}px`,
                  height: `${sprite.height}px`,
                  transform: `translate(${sprite.x}px, ${sprite.y}px)`,
                  filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))",
                }}
              >
                <Image
                  src={sprite.spritePath}
                  alt={sprite.name}
                  width={sprite.width}
                  height={sprite.height}
                  className={`w-full scale-[${sprite.scale}] h-full [image-rendering:pixelated] select-none`}
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
