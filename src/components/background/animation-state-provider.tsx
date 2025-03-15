'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AnimationStateContextType {
  hasAnimated: boolean;
  setHasAnimated: (value: boolean) => void;
}

const AnimationStateContext = createContext<AnimationStateContextType>({
  hasAnimated: false,
  setHasAnimated: () => {},
});

export const useAnimationState = () => useContext(AnimationStateContext);

export function AnimationStateProvider({ children }: { children: ReactNode }) {
  const [hasAnimated, setHasAnimated] = useState(false);

  return (
    <AnimationStateContext.Provider value={{ hasAnimated, setHasAnimated }}>
      {children}
    </AnimationStateContext.Provider>
  );
} 