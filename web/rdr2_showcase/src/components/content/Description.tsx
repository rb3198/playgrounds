import React, { useId } from "react";
import { FadeLayerProps } from "../Layer";

interface DescriptionProps extends FadeLayerProps {}

export const Description: React.FC<DescriptionProps> = ({
  yOffset,
  yBounds,
}) => {
  const [yMin, yMax] = yBounds;
  const mid = (yMax - yMin) / 2;
  const offset = yOffset - yMin;
  const maskId = useId();
  const gradientId = useId();
  const whiteOffset = (Math.abs(mid - offset) * 100) / mid;
  const blackOffset = Math.max(0, whiteOffset - 15);
  if (yOffset > yMax) {
    return null;
  }
  return (
    <>
      <svg className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient
            id={gradientId}
            x1={0}
            x2={0}
            y1={offset > mid ? 1 : 0}
            y2={offset > mid ? 0 : 1}
          >
            <stop offset={"0%"} stopColor="black" />
            <stop offset={`${blackOffset}%`} stopColor="black" />
            <stop offset={`${whiteOffset}%`} stopColor="white" />
            <stop offset={"100%"} stopColor="white" />
          </linearGradient>
          <mask id={maskId} x={0} y={0} height={"100%"} width={"100%"}>
            <rect
              fill={`url(#${gradientId})`}
              x={0}
              y={0}
              width={"100%"}
              height={"100%"}
            />
          </mask>
        </defs>
      </svg>
      <div
        className="absolute inset-0 flex flex-col justify-center items-center p-8 md:p-16 xl:p-24 z-20"
        style={{
          maskImage: `url(#${maskId})`,
          WebkitMaskImage: `url(#${maskId})`,
        }}
      >
        <div className="w-full xl:w-7/12 flex flex-col justify-center items-center gap-12 md:gap-18 xl:gap-24">
          <h1 className="text-3xl md:text-5xl xl:text-6xl font-rdr text-white">
            The Wild West, 1899
          </h1>
          <p className="text-sm md:text-lg xl:text-xl text-justify text-amber-100">
            Arthur Morgan and the Van der Linde gang have always lived by their
            own rules on the frontier, robbing and stealing their way across the
            American heartland. But as civilization closes in and the age of
            outlaws draws to a bloody close, they find themselves hunted by
            federal agents and bounty hunters across the untamed wilderness of
            America. <br />
            <br />
            Caught between the relentless pursuit of the law and their
            unwavering loyalty to each other, the gang must navigate a world
            that no longer has a place for them — forced to choose between
            survival and honor, between family and freedom, as their outlaw way
            of life crumbles around them and the wild west fades into history.
          </p>
        </div>
      </div>
    </>
  );
};
