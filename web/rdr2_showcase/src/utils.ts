import { AspectRatios } from "./types/enum/aspect_ratios";

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
  return Math.sin(wave);
};

export const isWithinBounds = (yOffset: number, yBounds: [number, number]) => {
  return yOffset >= yBounds[0] && yOffset <= yBounds[1];
};

export const getArthurVideoByViewport = (
  viewportWidth: number,
  viewportHeight: number
) => {
  const aspectRatio = viewportWidth / viewportHeight;
  if (aspectRatio >= AspectRatios.Desktop) {
    return "/rdr2_showcase/arthur_intro_desktop.mp4";
  }
  if (aspectRatio >= AspectRatios.Tablet) {
    return "/rdr2_showcase/arthur_intro_tab.mp4";
  }

  return "/rdr2_showcase/arthur_intro_mobile.mp4";
};
