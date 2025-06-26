import React, { useRef } from "react";
import { Hero } from "./components/Hero";
import { Release } from "./components/Release";
import { useScroll } from "./hooks/useScroll";
import { Content } from "./components/content";

type Props = {};

const Rdr2App: React.FC = (props: Props) => {
  const [yOffset, onWheel] = useScroll();
  const releaseLogoRef = useRef<HTMLImageElement>(null);
  return (
    <div className="fixed inset-0" onWheel={onWheel}>
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
      <Content yBounds={[3000, 27000]} yOffset={yOffset} />
    </div>
  );
};

export default Rdr2App;
