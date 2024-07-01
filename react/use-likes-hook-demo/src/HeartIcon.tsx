import React from "react";

type Props = {
  fill?: string;
  stroke?: string;
  height: number;
  width: number;
};

export const HeartIcon: React.FC<Props> = (props) => {
  const { fill, stroke, height, width } = props;
  return (
    <svg
      height={`${height}px`}
      width={`${width}px`}
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <g>
        <path
          d="M12 5.881C12.981 4.729 14.484 4 16.05 4C18.822 4 21 6.178 21 8.95C21 12.3492 17.945 15.1195 13.3164 19.3167L13.305 19.327L12 20.515L10.695 19.336L10.6595 19.3037C6.04437 15.1098 3 12.3433 3 8.95C3 6.178 5.178 4 7.95 4C9.516 4 11.019 4.729 12 5.881Z"
          fill={fill || "transparent"}
          stroke={stroke || "#6e6e6e"}
          strokeWidth={0.5}
        />
      </g>
    </svg>
  );
};
