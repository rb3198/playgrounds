import { useRef, useEffect, useState, WheelEventHandler } from "react";

const DURATION = 400; // ms
const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

interface ScrollEntry {
  deltaY: number;
  start: number; // timestamp
  duration: number; // always DURATION
}

export const useScroll = () => {
  const [yOffset, setYOffset] = useState(0);
  const yOffsetRef = useRef(0);
  const entriesRef = useRef<ScrollEntry[]>([]);
  const animationRef = useRef<number | null>(null);

  const animate = (timestamp: number) => {
    // Remove finished entries and compute total scroll offset
    let total = 0;
    const remaining: ScrollEntry[] = [];

    for (const entry of entriesRef.current) {
      const { start, deltaY, duration } = entry;
      const elapsed = timestamp - start;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutQuad(t);

      total += deltaY * eased;
      entry.deltaY -= deltaY * eased;
      if (t < 1) remaining.push(entry);
    }
    const yOffset = yOffsetRef.current;
    entriesRef.current = remaining;
    const newYOffset = Math.max(0, yOffset + total);
    setYOffset(newYOffset);
    yOffsetRef.current = newYOffset;

    if (entriesRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      animationRef.current = null;
    }
  };

  const onWheel: WheelEventHandler = (e) => {
    const { deltaY } = e;
    const entry: ScrollEntry = {
      deltaY,
      start: performance.now(),
      duration: DURATION,
    };
    entriesRef.current.push(entry);
    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return [yOffset, onWheel] as const;
};
