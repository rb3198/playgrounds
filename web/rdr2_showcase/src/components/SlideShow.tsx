import React, { useEffect, useMemo, useState } from "react";
import { FadeLayerProps } from "./Layer";

interface SlideShowProps extends FadeLayerProps {
  title: string;
  desc: string;
  gallery: string[];
}

export const SlideShow: React.FC<SlideShowProps> = ({
  yBounds,
  yOffset,
  title,
  desc,
  gallery,
}) => {
  const [isMobile, setIsMobile] = useState(
    document.documentElement.clientWidth < 768
  );
  const imgClasses =
    "box-border hover:border-8 border-amber-200 transition-all";
  const [yMin, yMax] = yBounds;
  const offset = yOffset - yMin;
  const range = yMax - yMin;
  const unit = range / 12; // Divide range into 12 parts.
  const fullFocusBreakpoint = 4 * unit;

  const { emptyHeight, fastHeight } = useMemo(() => {
    const slowDownFactor = isMobile ? 0 : 1.1;
    if (offset <= fullFocusBreakpoint) {
      const fullFocusProgress = (offset * 100) / fullFocusBreakpoint;
      const emptyHeight = `${100 - fullFocusProgress}%`;
      const fastHeight = `${(100 - fullFocusProgress) * slowDownFactor}%`;
      return { emptyHeight, fastHeight };
    }
    const postOffset = offset - fullFocusBreakpoint;
    const range = 12 * unit - fullFocusBreakpoint;
    return {
      emptyHeight: `-${(postOffset * 100) / range}%`,
      fastHeight: `-${(postOffset * 100 * slowDownFactor) / range}%`,
    };
  }, [offset, fullFocusBreakpoint, isMobile]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { contentRect } = entries[0];
        const { width } = contentRect;
        if (width < 768) {
          setIsMobile(true);
        } else {
          setIsMobile(false);
        }
      }
    });
    resizeObserver.observe(document.documentElement);
    return () => {
      resizeObserver.unobserve(document.documentElement);
      resizeObserver.disconnect();
    };
  }, []);

  if (gallery.length < 4) {
    return null;
  }
  return (
    <div
      className="absolute inset-0 h-max"
      style={{
        opacity: yOffset >= yMin ? 1 : 0,
        transform: isMobile ? `translateY(${emptyHeight})` : undefined,
      }}
    >
      <div className="flex flex-col md:flex-row w-full pl-4 md:pl-8 pr-4 md:pr-8 justify-between gap-5 md:gap-10 min-h-max">
        <div
          className="w-full grow flex flex-col gap-5 md:gap-10 min-h-max"
          style={{
            transform: !isMobile ? `translateY(${emptyHeight})` : undefined,
          }}
        >
          <h1 className="text-3xl md:text-4xl xl:text-6xl font-rdr text-amber-400 text-justify">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 text-justify font-semibold">
            {desc}
          </p>
          <img src={gallery[0]} className={imgClasses} />
        </div>
        <div
          className="w-full grow flex flex-col gap-5 md:gap-10 md:pt-36 min-h-max"
          style={{ transform: `translateY(${fastHeight})` }}
        >
          <img src={gallery[1]} className={`w-full ${imgClasses}`} />
          <div className="flex gap-5 flex-col 2xl:flex-row">
            <img src={gallery[2]} className={imgClasses} width={400} />
            <img src={gallery[3]} className={`${imgClasses} self-end`} />
          </div>
        </div>
      </div>
    </div>
  );
};
