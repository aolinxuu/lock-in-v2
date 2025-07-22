import React, { useState, useEffect } from "react";
import { PERCENTAGES, SVG_VIEWBOX, DEFAULT_RADIUS, DEFAULT_STROKE_WIDTH } from "./constants";
import { getArcEndPoint, createSegments } from "./utils";

function App() {
  const [currentSegment, setCurrentSegment] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Move to next segment when timer reaches 0
      setCurrentSegment((prev) => (prev + 1) % PERCENTAGES.length);
      setTimeLeft(5); // Reset timer to 5 seconds for next segment
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

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

      const isActive = i === currentSegment;
      const strokeColor = isActive ? "#3B82F6" : "#93CDAC";

      if (percentage === 1) {
        segments.push(
          <circle
            key={i}
            cx={centerX}
            cy={centerY}
            r={DEFAULT_RADIUS}
            fill="none"
            stroke={strokeColor}
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
            stroke={strokeColor}
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
      <div className="text-center mt-4">
        <p className="mb-2">Start Timer {currentSegment + 1}</p>
        <button
          onClick={() => {
            setIsRunning(true);
            if (timeLeft === 0) setTimeLeft(5);
          }}
          disabled={isRunning}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Start Timer
        </button>
        <button
          onClick={() => setIsRunning(false)}
          disabled={!isRunning}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          Stop Timer
        </button>
      </div>
    </div>
  );
}

export default App;
