import React, { useRef, useState, WheelEventHandler } from "react";
import { Hero } from "./components/Hero";
import { Release } from "./components/Release";

type Props = {};

const easeOut = (t: number) => t * (2 - t);
const DURATION = 500;

const Rdr2App: React.FC = (props: Props) => {
  const [yOffset, setYOffset] = useState(0);
  const targetOffset = useRef(0);
  const ticking = useRef(false);
  const startTime = useRef(0);
  const animationRef = useRef<number>(null);

  const scroll = (timestamp: number, deltaY: number) => {
    if (!startTime.current) {
      startTime.current = timestamp;
    }
    ticking.current = true;
    const elapsed = timestamp - startTime.current;
    const progress = Math.min(elapsed / DURATION, 1);
    const eased = easeOut(progress);
    setYOffset((prev) => prev + (targetOffset.current - prev) * eased);
    if (progress < 1) {
      animationRef.current = requestAnimationFrame((t) => scroll(t, deltaY));
    } else {
      ticking.current = false;
      animationRef.current = null;
      startTime.current = 0;
    }
  };

  const onWheel: WheelEventHandler = (evt) => {
    const { deltaY } = evt;
    targetOffset.current = Math.max(0, targetOffset.current + deltaY);
    if (ticking.current) {
      startTime.current = 0;
      animationRef.current && cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame((t) => scroll(t, deltaY));
  };

  return (
    <div className="fixed inset-0 bg-orange-950" onWheel={onWheel}>
      <Hero yBounds={[-1000, 1000]} yOffset={yOffset} />
      <Release yBounds={[1000, 3000]} yOffset={yOffset} />
    </div>
  );
};

export default Rdr2App;
