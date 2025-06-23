/**
 * Returns a sin wave given a range.
 * @param yBounds Bounds of the section
 * @param yOffset Current Y offset
 * @returns
 */
export const getSinWave = (yBounds: [number, number], yOffset: number) => {
  const [yMin, yMax] = yBounds;
  const offset = yOffset - yMin;
  const range = yMax - yMin;
  const wave = (offset * Math.PI) / range;
  return wave;
};
