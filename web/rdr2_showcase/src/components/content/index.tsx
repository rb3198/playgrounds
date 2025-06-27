import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { FadeLayerProps } from "./../Layer";
import { Description } from "./Description";
import { ScrollVideo } from "../ScrollVideo";
import { Subscribe, Unsubscribe } from "../../types";
import { getArthurVideoByViewport, isWithinBounds } from "../../utils";

interface ContentProps extends FadeLayerProps {
  subscribe: Subscribe;
  unsubscribe: Unsubscribe;
}

export const Content: React.FC<ContentProps> = ({
  yOffset,
  yBounds,
  subscribe,
  unsubscribe,
}) => {
  const [canvasDims, setCanvasDims] = useState({ width: 0, height: 0 });
  const { clientWidth, clientHeight } = document.documentElement;
  const [arthurIntroVideoSrc, setArthurIntroVideoSrc] = useState(
    getArthurVideoByViewport(clientWidth, clientHeight)
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [yMin, yMax] = yBounds;
  const range = yMax - yMin;
  const offset = yOffset - yMin;
  const unit = range / 24; // divide the range into 24 parts.
  const descriptionBounds = [0, 4 * unit] as [number, number]; // 4 parts for description
  // 2 (semi-transparent 2 -> 4) + 6 (fully visible 4 -> 10) + 2 (semi-transparent 10 -> 12) parts for arthur intro video
  const introVideoBounds = useMemo(
    () => [4 * unit, 5 * unit] as [number, number],
    [unit]
  );
  const descriptionMid = (descriptionBounds[0] + descriptionBounds[1]) / 2;
  /**
   * Renders the solid background with variable opacity.
   *
   * Becomes transparent when out of bounds, or a video is fully visible.
   */
  const renderBackground = () => {
    if (offset < 0) {
      return null;
    }
    let opacity = 0;
    if (offset < descriptionMid) {
      opacity = 1;
    } else if (offset < introVideoBounds[0]) {
      opacity = Math.cos(
        ((offset - descriptionMid) * Math.PI) /
          2 /
          (introVideoBounds[0] - descriptionMid)
      );
    }
    opacity = Math.max(0, Math.min(1, opacity));
    return (
      <div
        className="z-10 bg-orange-950 absolute inset-0"
        style={{ opacity }}
      ></div>
    );
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries.length) {
        return;
      }
      const { width, height } = entries[0].contentRect;
      setCanvasDims({ width, height });
      setArthurIntroVideoSrc(getArthurVideoByViewport(width, height));
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      containerRef.current && resizeObserver.unobserve(containerRef.current);
      resizeObserver.disconnect();
    };
  }, []);

  const arthurVideoBounds = useMemo(
    () =>
      [descriptionMid + yMin, introVideoBounds[1] + yMin] as [number, number],
    [descriptionMid, yMin, yMax]
  );
  return (
    <div className="absolute inset-0" ref={containerRef}>
      <Description yBounds={descriptionBounds} yOffset={offset} />
      {renderBackground()}
      <ScrollVideo
        subscribe={subscribe}
        canvasHeight={canvasDims.height}
        canvasWidth={canvasDims.width}
        yBounds={arthurVideoBounds}
        visible={isWithinBounds(offset, [descriptionMid, introVideoBounds[1]])}
        canvasClasses="absolute inset-0 z-0 h-full w-full"
        videoAddress={arthurIntroVideoSrc}
        unsubscribe={unsubscribe}
      />
    </div>
  );
};
