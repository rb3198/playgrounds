import React, { useMemo } from "react";
import { FadeLayer, FadeLayerProps } from "./Layer";
import { getSinWave } from "../utils";

interface HeroProps extends FadeLayerProps {}

export const Hero: React.FC<HeroProps> = ({ yBounds, yOffset }) => {
  const scaleMin = 0.9;
  const scale = useMemo(() => {
    const norm = getSinWave(yBounds, yOffset);
    return Math.max(scaleMin, Math.sin(norm));
  }, [scaleMin, yOffset]);

  const logoOpacity = useMemo(() => {
    const offset = scale - scaleMin;
    return offset * 10;
  }, [scale, scaleMin]);
  return (
    <FadeLayer yOffset={yOffset} yBounds={yBounds}>
      {/* Background */}
      <img
        src={"/rdr2_showcase/hero_background.png"}
        className="absolute inset-0 object-cover h-full w-full scale-110 will-change-transform"
        style={{ transform: `scale(${scale})` }}
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
        style={{ transform: `scale(${scale})` }}
      />
    </FadeLayer>
  );
};
