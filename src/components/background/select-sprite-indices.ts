export function selectSpriteIndices(
  available: number,
  requested: number,
  isMobile: boolean,
  random: () => number = Math.random,
): number[] {
  const limit = isMobile ? Math.max(1, Math.floor(available * 0.8)) : available;
  const count = Math.max(0, Math.min(Math.floor(requested), limit, available));
  const indices = Array.from({ length: available }, (_, index) => index);

  // Randomize only a reduced selection so every sprite can appear on mobile.
  if (count < available) {
    for (let index = indices.length - 1; index > 0; index--) {
      const other = Math.floor(random() * (index + 1));
      [indices[index], indices[other]] = [indices[other], indices[index]];
    }
  }

  return indices.slice(0, count);
}
