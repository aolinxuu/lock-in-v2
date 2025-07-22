import React from "react";
import { PERCENTAGES, SVG_VIEWBOX, DEFAULT_RADIUS, DEFAULT_STROKE_WIDTH } from "./constants";
import { getArcEndPoint } from "./utils";

function App() {
  const createSegments = () => {
    const segments = [];
    const centerX = SVG_VIEWBOX.w / 2;
    const centerY = SVG_VIEWBOX.h / 2;

    // start at top of circle
    let currentX = centerX;
    let currentY = centerY - DEFAULT_RADIUS;

    PERCENTAGES.forEach((percentage, i) => {
      const { endX, endY, nextStartX, nextStartY } = getArcEndPoint(
        currentX,
        currentY,
        centerX,
        centerY,
        DEFAULT_RADIUS,
        percentage
      );

      const largeArcFlag = percentage > 0.5 ? 1 : 0;

      if (percentage === 1) {
        segments.push(
          <circle
            key={i}
            cx={centerX}
            cy={centerY}
            r={DEFAULT_RADIUS}
            fill="none"
            stroke={`url(#gradient-${i})`}
            strokeWidth={DEFAULT_STROKE_WIDTH}
            strokeLinecap="round"
          />
        );
      } else if (percentage > 0) {
        segments.push(
          <path
            key={i}
            d={`M ${currentX} ${currentY} A ${DEFAULT_RADIUS} ${DEFAULT_RADIUS} 0 ${largeArcFlag} 1 ${endX} ${endY}`}
            fill="none"
            stroke={`url(#gradient-${i})`}
            strokeWidth={DEFAULT_STROKE_WIDTH}
            strokeLinecap="round"
          />
        );
      }

      currentX = nextStartX;
      currentY = nextStartY;
    });
    return segments;
  };

  return (
    <div>
      <svg viewBox={`${SVG_VIEWBOX.x} ${SVG_VIEWBOX.y} ${SVG_VIEWBOX.w} ${SVG_VIEWBOX.h}`} className="w-full h-full">
        <defs>
          {Array.from({ length: 8 }).map((_, i) => (
            <linearGradient key={i} id={`gradient-${i}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="0">
              <stop offset="0%" stopColor="#93CDAC" />
              <stop offset="100%" stopColor="#93CDAC" />
            </linearGradient>
          ))}
        </defs>
        {createSegments()}
      </svg>
    </div>
  );
}

export default App;
