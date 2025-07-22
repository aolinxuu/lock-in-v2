import React from "react";

function App() {
  const SVG_VIEWBOX = {
    x: 0,
    y: 0,
    w: 250,
    h: 250,
  };

  function getArcEndPoint(startX, startY, centerX, centerY, radius, percentage, segmentGap = 12) {
    const startAngle = Math.atan2(startY - centerY, startX - centerX);
    // Convert gap from degrees to radians
    const gapRadians = (segmentGap * Math.PI) / 180;
    // Subtract gap from the arc length
    const angleDelta = 2 * Math.PI * percentage - gapRadians;
    const endAngle = startAngle + angleDelta;

    const endX = centerX + radius * Math.cos(endAngle);
    const endY = centerY + radius * Math.sin(endAngle);

    // Calculate where the next segment should start (including the gap)
    const nextStartAngle = startAngle + 2 * Math.PI * percentage;
    const nextStartX = centerX + radius * Math.cos(nextStartAngle);
    const nextStartY = centerY + radius * Math.sin(nextStartAngle);

    return { endX, endY, nextStartX, nextStartY };
  }

  const createSegments = () => {
    const segments = [];
    const radius = 30;
    const centerX = SVG_VIEWBOX.w / 2;
    const centerY = SVG_VIEWBOX.h / 2;
    // const percentages = [6 / 60, 6 / 60];
    const percentages = [5 / 60, 40 / 60, 5 / 60, 10 / 60];

    // start at top of circle
    let currentX = centerX;
    let currentY = centerY - radius;

    percentages.forEach((percentage, i) => {
      const { endX, endY, nextStartX, nextStartY } = getArcEndPoint(
        currentX,
        currentY,
        centerX,
        centerY,
        radius,
        percentage
      );

      const largeArcFlag = percentage > 0.5 ? 1 : 0;

      if (percentage === 1) {
        segments.push(
          <circle
            key={i}
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke={`url(#gradient-${i})`}
            strokeWidth="5"
            strokeLinecap="round"
          />
        );
      } else if (percentage > 0) {
        segments.push(
          <path
            key={i}
            d={`M ${currentX} ${currentY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`}
            fill="none"
            stroke={`url(#gradient-${i})`}
            strokeWidth="5"
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
