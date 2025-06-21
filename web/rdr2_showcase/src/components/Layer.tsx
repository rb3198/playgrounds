import React, { PropsWithChildren, useMemo } from "react";

export interface FadeLayerProps {
  yOffset: number;
  yBounds: [number, number];
}

export const FadeLayer: React.FC<PropsWithChildren<FadeLayerProps>> = ({
  children,
  yBounds,
  yOffset,
}) => {
  const opacity = useMemo(() => {
    const [yMin, yMax] = yBounds;
    const range = yMax - yMin;
    const offset = yOffset - yMin;
    const normalizedX = (offset * Math.PI) / range;
    return Math.sin(normalizedX);
  }, [yBounds, yOffset]);
  return (
    <div className={`fixed inset-0`} style={{ opacity }}>
      {children}
    </div>
  );
};
