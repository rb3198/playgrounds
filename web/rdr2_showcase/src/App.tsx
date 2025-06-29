import React, { useRef } from "react";
import { Hero } from "./components/Hero";
import { Release } from "./components/Release";
import { useScroll } from "./hooks/useScroll";
import { Content } from "./components/content";

const END_OFFSET = 24000;
const Rdr2App: React.FC = () => {
  const [yOffset, onWheel, onTouchStart, onTouchMove, subscribe, unsubscribe] =
    useScroll(END_OFFSET);
  const releaseLogoRef = useRef<HTMLImageElement>(null);
  return (
    <div
      className="fixed inset-0 touch-none"
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
    >
      <Hero
        yBounds={[-1000, 1000]}
        yOffset={yOffset}
        releaseLogoRef={releaseLogoRef}
      />
      <Release
        yBounds={[1000, 3000]}
        yOffset={yOffset}
        releaseLogoRef={releaseLogoRef}
      />
      <Content
        yBounds={[3000, END_OFFSET]}
        yOffset={yOffset}
        subscribe={subscribe}
        unsubscribe={unsubscribe}
      />
    </div>
  );
};

export default Rdr2App;
