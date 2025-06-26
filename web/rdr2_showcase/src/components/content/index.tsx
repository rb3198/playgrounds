import React, { useId } from "react";
import { FadeLayerProps } from "./../Layer";
import { Description } from "./Description";

interface ContentProps extends FadeLayerProps {}

export const Content: React.FC<ContentProps> = ({ yOffset, yBounds }) => {
  const [yMin, yMax] = yBounds;
  const range = yMax - yMin;
  const offset = yOffset - yMin;
  const unit = range / 24; // divide the range into 24 parts.
  const descriptionBounds = [0, 4 * unit] as [number, number]; // 4 parts for description
  // 2 (semi-transparent 2 -> 4) + 6 (fully visible 4 -> 10) + 2 (semi-transparent 10 -> 12) parts for arthur intro video
  const introVideoBounds = [4 * unit, 12 * unit];

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
    const descriptionMid = (descriptionBounds[0] + descriptionBounds[1]) / 2;
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
  return (
    <div className="absolute inset-0">
      <Description yBounds={descriptionBounds} yOffset={offset} />
      {renderBackground()}
    </div>
  );
};
