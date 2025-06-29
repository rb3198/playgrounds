import React, { useId } from "react";
import { FadeLayerProps } from "./Layer";

interface ReleaseProps extends FadeLayerProps {
  releaseLogoRef: React.RefObject<HTMLImageElement | null>;
}

export const Release: React.FC<ReleaseProps> = ({
  releaseLogoRef,
  yOffset,
  yBounds,
}) => {
  const [yMin, yMax] = yBounds;
  const range = yMax - yMin;
  const mid = range / 2;
  const offset = yOffset - yMin;
  const maskId = useId();
  const gradientId = useId();
  const whiteOffset = (Math.abs(mid - offset) * 100) / mid;
  const blackOffset = Math.max(0, whiteOffset - 15);
  return (
    <>
      <svg className="absolute w-full h-full">
        <defs>
          <linearGradient
            id={gradientId}
            x1="0"
            y1={offset < mid ? 0 : 1}
            x2="0"
            y2={offset < mid ? 1 : 0}
          >
            <stop offset="0%" stopColor="black" />
            <stop offset={`${blackOffset}%`} stopColor="black" />
            <stop offset={`${whiteOffset}%`} stopColor="white" />
            <stop offset="100%" stopColor="white" />
          </linearGradient>
          <mask
            id={maskId}
            x="0"
            y="0"
            width="100%"
            height="100%"
            maskUnits="userSpaceOnUse"
            maskContentUnits="userSpaceOnUse"
          >
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill={`url(#${gradientId})`}
            />
          </mask>
        </defs>
      </svg>
      <div
        className="absolute inset-0 bg-orange-950"
        style={{ opacity: offset > mid && offset <= range ? 1 : 0 }}
      />
      <div
        className={`
          grid
          grid-cols-12
          gap-x-0
          grid-rows-12
          gap-y-0
          font-rdr
          fixed inset-0
          text-center
          text-gray-300
        `}
        style={{
          mask: `url(#${maskId})`,
          WebkitMask: `url(#${maskId})`,
          maskType: "luminance",
        }}
      >
        <img
          src="/rdr2_showcase/logo.png"
          className={`
            col-start-4
            col-end-10
            row-start-4
            row-end-6
            lg:row-start-2
            lg:row-end-4
            w-full
            h-full
            object-contain
          `}
          ref={releaseLogoRef}
        />
        <div
          className={`
            col-start-2
            col-end-12
            lg:col-start-4
            lg:col-end-10
            row-start-5
            row-end-12
            bg-[url(/rdr2_showcase/chalkboard.png)]
            bg-no-repeat
            bg-contain
            bg-center
            flex
            justify-center
            items-center
          `}
        >
          <h1
            className={`
              z-20
              absolute
              top-8/12
              left-6/12
              -translate-6/12
              w-max
              text-3xl
              md:text-6xl
              text-center
              text-gray-300
              -translate-y-10/12 
              bg-clip-text
            `}
          >
            Released <br />
            <br />
            October 26, 2018.
          </h1>
        </div>
      </div>
    </>
  );
};
