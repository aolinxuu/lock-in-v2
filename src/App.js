import React, { useState, useEffect } from "react";
import { PERCENTAGES, SVG_VIEWBOX, DEFAULT_RADIUS, DEFAULT_STROKE_WIDTH, CENTER_X, CENTER_Y, GAP } from "./constants";
import { getArcPoints, createSegments, formatTime } from "./utils";

function App() {
  const [currentSegment, setCurrentSegment] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          const totalSegDuration = PERCENTAGES[currentSegment] * 60;
          const segmentProgress = (totalSegDuration - newTime) / totalSegDuration;
          const completedSegments = PERCENTAGES.slice(0, currentSegment).reduce((sum, p) => sum + p, 0);
          const currentProgress = PERCENTAGES[currentSegment] * segmentProgress;
          setTotalProgress(completedSegments + currentProgress);
          return newTime;
        });
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setCurrentSegment((prev) => (prev + 1) % PERCENTAGES.length);
      const nextSegment = (currentSegment + 1) % PERCENTAGES.length;
      const nextDuration = PERCENTAGES[nextSegment] * 60;
      setTimeLeft(nextDuration);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentSegment]);

  const createProgressOverlay = () => {
    if (totalProgress <= 0) return null;

    const gapRadians = (GAP * Math.PI) / 180;
    // let accumulatedProgress = 0;
    let startX = CENTER_X;
    let startY = CENTER_Y - DEFAULT_RADIUS;
    let remainingProgress = totalProgress;
    let paths = [];

    PERCENTAGES.forEach((percentage, index) => {
      if (remainingProgress <= 0) return;

      const segmentProgress = Math.min(percentage, remainingProgress);
      remainingProgress -= percentage;

      if (segmentProgress > 0) {
        const adjustedStartAngle = Math.atan2(startY - CENTER_Y, startX - CENTER_X) + gapRadians;
        const angleDelta = 2 * Math.PI * segmentProgress - gapRadians;
        const endAngle = adjustedStartAngle + angleDelta;

        const endX = CENTER_X + DEFAULT_RADIUS * Math.cos(endAngle);
        const endY = CENTER_Y + DEFAULT_RADIUS * Math.sin(endAngle);

        const progressLargeArcFlag = segmentProgress > 0.5 ? 1 : 0;

        paths.push(
          <path
            key={`progress-${index}`}
            d={`M ${startX} ${startY} A ${DEFAULT_RADIUS} ${DEFAULT_RADIUS} 0 ${progressLargeArcFlag} 1 ${endX} ${endY}`}
            fill="none"
            stroke="#F59E0B"
            strokeWidth={DEFAULT_STROKE_WIDTH}
            strokeLinecap="round"
          />
        );

        // Update start position for next segment (including gap)
        const nextAngle = adjustedStartAngle + 2 * Math.PI * segmentProgress;
        startX = CENTER_X + DEFAULT_RADIUS * Math.cos(nextAngle);
        startY = CENTER_Y + DEFAULT_RADIUS * Math.sin(nextAngle);
      }
    });

    return paths;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <svg viewBox={`${SVG_VIEWBOX.x} ${SVG_VIEWBOX.y} ${SVG_VIEWBOX.w} ${SVG_VIEWBOX.h}`} className="w-64 h-64">
        {createSegments()}
        {createProgressOverlay()}
      </svg>
      <p className="mb-2 text-2xl font-bold">{formatTime(timeLeft)}</p>
      <p className="mb-2 text-sm text-gray-600">
        Current segment: {currentSegment + 1} of {PERCENTAGES.length}
      </p>
      <p className="mb-2 text-sm text-gray-600">
        Duration: {PERCENTAGES[currentSegment] * 60} minutes ({(PERCENTAGES[currentSegment] * 100).toFixed(1)}% of
        circle)
      </p>
      <div className="text-center mt-4">
        <button
          onClick={() => {
            setIsRunning(true);
            if (timeLeft === 0) setTimeLeft(PERCENTAGES[currentSegment] * 60);
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
