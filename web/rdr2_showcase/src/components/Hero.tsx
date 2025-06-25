import React, { useEffect, useId, useMemo, useRef } from "react";
import { FadeLayerProps } from "./Layer";
import { getSinWave } from "../utils";
import { heroMaskBg, heroMaskVisiblePath } from "../constants";

interface HeroProps extends FadeLayerProps {
  releaseLogoRef: React.RefObject<HTMLImageElement | null>;
}

export const Hero: React.FC<HeroProps> = ({
  releaseLogoRef,
  yBounds,
  yOffset,
}) => {
  const scaleMin = 0.9;
  const maskRef = useRef<SVGPathElement>(null);
  const scale = useMemo(() => {
    const norm = getSinWave(yBounds, yOffset);
    return Math.max(scaleMin, norm);
  }, [scaleMin, yOffset]);

  const logoOpacity = useMemo(() => {
    const offset = scale - scaleMin;
    return offset * 10;
  }, [scale, scaleMin]);

  const maskId = useId();
  const logoMaskId = useId();

  const logoScale = useMemo(() => {
    const norm = getSinWave(yBounds, yOffset);
    return Math.max(1, 175 * norm);
  }, [yOffset, yBounds]);

  useEffect(() => {
    if (!maskRef.current || !releaseLogoRef.current) {
      return;
    }
    const logoMask = maskRef.current;
    const releaseLogo = releaseLogoRef.current;
    const logoDimensions = releaseLogo.getBoundingClientRect();
    const logoBoundingBox = logoMask.getBBox();
    const horizontalScale = logoDimensions.width / logoBoundingBox.width;
    const verticalScale = logoDimensions.height / logoBoundingBox.height;
    const scaleFactor = Math.min(horizontalScale, verticalScale) * logoScale;
    const horizontalPosition =
      logoDimensions.left +
      (logoDimensions.width - logoBoundingBox.width * scaleFactor) / 2 -
      logoBoundingBox.x * scaleFactor;
    const verticalPosition =
      logoDimensions.top +
      (logoDimensions.height - logoBoundingBox.height * scaleFactor) / 2 -
      logoBoundingBox.y * scaleFactor;
    logoMask.setAttribute(
      "transform",
      `
      translate(${horizontalPosition}, ${verticalPosition})
      scale(${scaleFactor})
    `
    );
  }, [logoScale]);
  return (
    <div
      style={{
        opacity: yOffset < yBounds[0] || yOffset > yBounds[1] + 1000 ? 0 : 1,
      }}
    >
      <div
        className={`
          absolute
          inset-0
        `}
        style={{
          maskImage: `url(#${maskId})`,
        }}
      >
        {/* Background */}
        <img
          src={"/rdr2_showcase/hero_background.png"}
          className={`
            absolute
            inset-0
            object-cover
            h-full
            w-full
            scale-110
            will-change-transform
          `}
          style={{
            transform: `scale(${scale})`,
          }}
        />
        {/* Logo */}
        <img
          src="/rdr2_showcase/logo.png"
          className={`
              z-10 
              absolute 
              w-4/12 
              left-6/12 
              -translate-x-6/12 
              top-4/12
              md:top-2/12
              lg:top-1/12 
              object-cover 
              origin-bottom
              `}
          style={{
            transform: `scale(${scale})`,
            opacity: logoOpacity,
          }}
        />
        {/* Foreground */}
        <img
          src="/rdr2_showcase/hero_foreground.png"
          className={`
              z-20
              absolute
              w-6/12
              left-6/12
              bottom-2/12
              xl:bottom-1/12
              -translate-x-6/12
              scale-[250%]
              sm:scale-200
              lg:scale-150
              2xl:scale-125
              object-cover`}
          style={{
            transform: `scale(${scale})`,
          }}
        />
        <div
          className="absolute inset-0 bg-white z-30"
          style={{ opacity: 0.9 - getSinWave(yBounds, yOffset) }}
        />
      </div>
      {/* Mask */}
      <svg width={"100%"} height={"100%"}>
        <defs>
          <mask id={maskId}>
            <rect width={"100%"} height={"100%"} fill="black" />
            <g ref={maskRef}>
              <path id={logoMaskId} fill={"white"} d={heroMaskVisiblePath} />
              <path fill="black" d={heroMaskBg} />
            </g>
          </mask>
        </defs>
        <rect width={"100%"} height={"100%"} fill="transparent" mask={maskId} />
      </svg>
    </div>
  );
};
