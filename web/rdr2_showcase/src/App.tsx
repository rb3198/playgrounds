import React, { useState, WheelEventHandler } from "react";
import { Hero } from "./components/Hero";

type Props = {};

const Rdr2App: React.FC = (props: Props) => {
  const [yOffset, setYOffset] = useState(0);

  const onWheel: WheelEventHandler = (evt) => {
    const { deltaY } = evt;
    setYOffset((prev) => Math.max(0, prev + deltaY));
  };

  return (
    <div className="fixed inset-0 bg-orange-950" onWheel={onWheel}>
      <Hero yBounds={[-1000, 1000]} yOffset={yOffset} />
    </div>
  );
};

export default Rdr2App;
