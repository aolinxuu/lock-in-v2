import React, { useState, useEffect, useRef } from "react";

import { SEGMENT_PROPORTIONS, RADIUS, STROKE_WIDTH, GAP_ANGLE, BASE_COLOR, OVERLAY_COLOR, SEGMENTS } from "./constants";

import { formatTime, polarToCartesian } from "./utils";

const Segment = ({ startAngle, endAngle, progress, i }) => {
  const start = polarToCartesian(100, 100, RADIUS, startAngle);
  const end = polarToCartesian(100, 100, RADIUS, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  // Calculate the partial end point based on progress
  const actualEndAngle = startAngle + (endAngle - startAngle) * progress;
  const actualEnd = polarToCartesian(100, 100, RADIUS, actualEndAngle);
  const actualLargeArc = actualEndAngle - startAngle > 180 ? 1 : 0;

  return (
    <g key={i}>
      <path
        d={`M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y}`}
        fill="none"
        stroke={BASE_COLOR}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
      />
      {progress > 0 && (
        <path
          d={`M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${actualLargeArc} 1 ${actualEnd.x} ${actualEnd.y}`}
          fill="none"
          stroke={OVERLAY_COLOR}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
        />
      )}
    </g>
  );
};

export default function SegmentedTimer() {
  const [totalSeconds, setTotalSeconds] = useState(300); // 5 minutes default
  const [remainingSeconds, setRemainingSeconds] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(5);
  const intervalRef = useRef(null);

  // Calculate segment angles based on proportions
  const totalAngle = 360 - SEGMENTS * GAP_ANGLE; // Account for gaps
  const segmentAngles = SEGMENT_PROPORTIONS.map((proportion) => proportion * totalAngle);

  const getCumulativeAngle = (index) => {
    let cumulative = GAP_ANGLE / 2;
    for (let i = 0; i < index; i++) {
      cumulative += segmentAngles[i] + GAP_ANGLE;
    }
    return cumulative;
  };

  // Calculate progress for each segment
  const totalProgress = (totalSeconds - remainingSeconds) / totalSeconds;

  const getSegmentProgress = (segmentIndex) => {
    // Calculate cumulative proportions to determine when each segment should start/end
    let cumulativeProportion = 0;
    for (let i = 0; i < segmentIndex; i++) {
      cumulativeProportion += SEGMENT_PROPORTIONS[i];
    }

    const segmentStart = cumulativeProportion;
    const segmentEnd = cumulativeProportion + SEGMENT_PROPORTIONS[segmentIndex];

    if (totalProgress <= segmentStart) {
      return 0;
    } else if (totalProgress >= segmentEnd) {
      return 1;
    } else {
      return (totalProgress - segmentStart) / SEGMENT_PROPORTIONS[segmentIndex];
    }
  };

  // Timer logic
  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, remainingSeconds]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
  };

  const setNewTimer = () => {
    const newTotal = inputMinutes * 60;
    setTotalSeconds(newTotal);
    setRemainingSeconds(newTotal);
    setIsRunning(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <div className="relative">
        <svg width="200" height="200">
          {/* <svg viewBox={`${SVG_VIEWBOX.x} ${SVG_VIEWBOX.y} ${SVG_VIEWBOX.w} ${SVG_VIEWBOX.h}`} className="w-64 h-64"> */}
          {SEGMENT_PROPORTIONS.map((proportion, i) => {
            const startAngle = getCumulativeAngle(i) - 90; // Start from top
            const endAngle = startAngle + segmentAngles[i];
            const segmentProgress = getSegmentProgress(i);
            return <Segment key={i} i={i} startAngle={startAngle} endAngle={endAngle} progress={segmentProgress} />;
          })}
          <text x="100" y="110" textAnchor="middle" fontSize="22" fill="#000" fontFamily="monospace">
            {formatTime(remainingSeconds)}
          </text>
        </svg>

        {/* Progress indicator */}
        {remainingSeconds === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Done!</div>
          </div>
        )}
        {/*State management - preview, deep focus, overview, break */}
        <div className="absolute top-12 left-0 right-0 flex flex-col items-center justify-center">
          <label htmlFor="minutes" className="text-sm font-medium">
            Preview
          </label>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={startTimer}
          disabled={isRunning || remainingSeconds === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Start
        </button>
        <button
          onClick={pauseTimer}
          disabled={!isRunning}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Pause
        </button>
        <button onClick={resetTimer} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Reset
        </button>
      </div>

      {/* Timer setup */}
      <div className="flex items-center gap-2">
        <label htmlFor="minutes" className="text-sm font-medium">
          Total time:
        </label>
        <input
          id="minutes"
          type="number"
          min="1"
          max="60"
          value={0.1}
          onChange={(e) => setInputMinutes(parseInt(e.target.value) || 1)}
          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
        />
        <button
          onClick={setNewTimer}
          disabled={isRunning}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
        >
          Set
        </button>
      </div>
    </div>
  );
}
