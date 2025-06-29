import React from "react";
import { FadeLayerProps } from "./Layer";
import {
  FFMPEG,
  HAILUO_AI,
  PORTFOLIO_SITE,
  PR_ADDRESS,
  WALLPAPER_ATTRIBUTION,
} from "../constants/addresses";

interface FooterProps extends FadeLayerProps {}
const Footer: React.FC<FooterProps> = ({ yBounds, yOffset }) => {
  const [yMin, yMax] = yBounds;
  const yMid = (yMin + yMax) / 2;
  const offset = yOffset - yMin;
  const opacity =
    yOffset < yMin
      ? 0
      : yOffset < yMid
      ? Math.sin((offset * Math.PI) / (2 * (yMid - yMin)))
      : 1;
  const linkClasses = "underline cursor-pointer";
  const liClasses = "italic text-lg md:text-xl text-justify";
  const linkProps = {
    target: "_blank",
    className: linkClasses,
  };
  return (
    <div
      className="text-white flex flex-col absolute inset-0 justify-center items-center text-xl p-4 md:p-8 gap-4 z-30"
      style={{ opacity }}
    >
      <ul className="list-none flex flex-col gap-8">
        <li className={liClasses}>
          Created with a lot of fandom by{" "}
          <a href={PORTFOLIO_SITE} {...linkProps}>
            Ronit Bhatia
          </a>{" "}
          using React, TypeScript, and SVG Masks. No other libraries used. Open
          sourced on{" "}
          <a href={PR_ADDRESS} {...linkProps}>
            GitHub
          </a>
          .
        </li>
        <li className={liClasses}>
          Red Dead Redemption 2™ and all related marks and media are property of
          Rockstar Games.
          <br /> This is a fan-made site and is not affiliated with or endorsed
          by Rockstar Games.
        </li>
        <li className={liClasses}>
          Videos generated using free tools from{" "}
          <a href={HAILUO_AI} {...linkProps}>
            HailuoAI
          </a>{" "}
          and then processed via{" "}
          <a href={FFMPEG} {...linkProps}>
            FFMPEG
          </a>
          .
        </li>
        <li className={liClasses}>
          Hero wallpaper created by{" "}
          <a href={WALLPAPER_ATTRIBUTION} {...linkProps}>
            ursula.mcentee @ Wallpapers.com
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
