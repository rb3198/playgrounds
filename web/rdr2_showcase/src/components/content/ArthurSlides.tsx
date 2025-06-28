import React, { useMemo } from "react";
import { FadeLayerProps } from "../Layer";
import { SlideShow } from "../SlideShow";
import { isWithinBounds } from "../../utils";
import { ScrollVideo } from "../ScrollVideo";
import { Subscribe, Unsubscribe } from "../../types";

interface ArthurSlidesProps extends FadeLayerProps {
  subscribe: Subscribe;
  unsubscribe: Unsubscribe;
  canvasHeight: number;
  canvasWidth: number;
}

export const ArthurSlides: React.FC<ArthurSlidesProps> = ({
  yOffset,
  yBounds,
  canvasHeight,
  canvasWidth,
  subscribe,
  unsubscribe,
}) => {
  const [yMin, yMax] = yBounds;
  const range = yMax - yMin;
  const offset = yOffset - yMin;
  const unit = range / 28; // divide the range into 28 parts
  const badSlideshowBounds = [0, 12 * unit] as [number, number];
  const intervalBounds = [6 * unit, 18 * unit] as [number, number];
  const goodSlideshowBounds = [14 * unit, 24 * unit] as [number, number];
  const closingBounds = [19 * unit, 28 * unit] as [number, number];
  const footerBounds = [26 * unit, 28 * unit] as [number, number];
  const badDesc = `Loyal yet conflicted, brutal yet reflective, Arthur is not your
          typical outlaw. He’s a gunslinger with a conscience, a man who can rob
          a train at sunrise and sketch a quiet sunrise by evening. Raised in
          the Van der Linde gang, Arthur has lived a life of violence, but deep
          down, he’s searching for something more — redemption, meaning, maybe
          even peace.`;
  const goodDesc = `Arthur is brutal when he needs to be — but there's a man trying to outrun the past buried under the blood and grit. 
  As deepening internal divisions threaten to tear the gang apart, Arthur faces a constant battle between his conscience and loyalty.
  `;
  const opacity = useMemo(() => {
    if (offset < 0) {
      return 0;
    }
    const badSlideShowMid = 3 * unit;
    if (offset <= badSlideShowMid) {
      return Math.sin((offset * Math.PI) / (2 * badSlideShowMid));
    }
    const [intervalMin, intervalMax] = intervalBounds;
    if (isWithinBounds(offset, intervalBounds)) {
      const intervalMid = (intervalMin + intervalMax) / 2;
      if (offset <= intervalMid) {
        const newOffset = offset - intervalMin;
        const range = intervalMid - intervalMin;
        return Math.cos((newOffset * Math.PI) / (2 * range));
      }
      const appearStart = (intervalMid + intervalMax) / 2;
      if (offset >= appearStart) {
        const newOffset = offset - appearStart;
        const range = intervalMax - appearStart;
        return Math.sin((newOffset * Math.PI) / (2 * range));
      }
      return 0;
    }
    const [closingMin, closingMax] = closingBounds;
    const closingMid = (closingMin + closingMax) / 2;
    if (offset >= closingMin) {
      if (offset <= closingMid) {
        const newOffset = offset - closingMin;
        const range = closingMax - closingMin;
        return Math.cos((newOffset * Math.PI) / (2 * range));
      } else {
        return 0;
      }
    }
    return 1;
  }, [offset, unit, badSlideshowBounds, intervalBounds, closingBounds]);
  return (
    <div className="absolute inset-0 z-10">
      {/* Bad slideshow */}
      <div
        className="absolute inset-0 z-10 bg-orange-950"
        style={{ opacity }}
      ></div>
      <div className="absolute inset-0 z-20">
        <SlideShow
          title="Meet Arthur Morgan"
          desc={badDesc}
          gallery={[
            "/rdr2_showcase/arthur_smoking.jpg",
            "/rdr2_showcase/arthur_guns.webp",
            "/rdr2_showcase/arthur_masked.jpg",
            "/rdr2_showcase/arthur_punching.jpg",
          ]}
          yBounds={badSlideshowBounds}
          yOffset={offset}
        />
      </div>
      {/* Interval */}
      <ScrollVideo
        subscribe={subscribe}
        canvasHeight={canvasHeight}
        canvasWidth={canvasWidth}
        unsubscribe={unsubscribe}
        videoAddress="/rdr2_showcase/interval.mp4"
        yBounds={[11625, 18735]}
        visible={isWithinBounds(offset, intervalBounds)}
      />
      {/* Good slideshow */}
      <div className="absolute inset-0 z-20">
        <SlideShow
          title="Crime and Compassion"
          desc={goodDesc}
          yBounds={goodSlideshowBounds}
          yOffset={offset}
          gallery={[
            "/rdr2_showcase/arthur_hugging.jpg",
            "/rdr2_showcase/arthur_smiling.avif",
            "/rdr2_showcase/arthur_reading.jpg",
            "/rdr2_showcase/arthur_emo.jpg",
          ]}
        />
      </div>
      {/* Closing */}
      <ScrollVideo
        subscribe={subscribe}
        canvasHeight={canvasHeight}
        canvasWidth={canvasWidth}
        unsubscribe={unsubscribe}
        videoAddress="/rdr2_showcase/closing.mp4"
        yBounds={[19500, 24000]}
        visible={isWithinBounds(offset, closingBounds)}
      />
    </div>
  );
};
