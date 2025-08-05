import React, { useState, useEffect, useRef } from "react";

import "./App.css";

import {
  SEGMENT_PROPORTIONS,
  RADIUS,
  STROKE_WIDTH,
  GAP_ANGLE,
  BASE_COLOR,
  OVERLAY_COLOR,
  OVERLAY_COLOR_1,
  OVERLAY_COLOR_2,
  OVERLAY_COLOR_3,
  OVERLAY_COLOR_4,
  SEGMENTS,
  SVG_VIEWBOX,
} from "./constants";

import { formatTime, polarToCartesian } from "./utils";

const Segment = ({ startAngle, endAngle, progress, i }) => {
  const start = polarToCartesian(SVG_VIEWBOX.w / 2, SVG_VIEWBOX.h / 2, RADIUS, startAngle);
  const end = polarToCartesian(SVG_VIEWBOX.w / 2, SVG_VIEWBOX.h / 2, RADIUS, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  // Calculate the partial end point based on progress
  const actualEndAngle = startAngle + (endAngle - startAngle) * progress;
  const actualEnd = polarToCartesian(SVG_VIEWBOX.w / 2, SVG_VIEWBOX.h / 2, RADIUS, actualEndAngle);
  const actualLargeArc = actualEndAngle - startAngle > 180 ? 1 : 0;

  return (
    <svg>
      <defs>
        {/* <linearGradient id="baseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7EA0FC" />
          <stop offset="100%" stopColor="#11BA24" />
        </linearGradient> */}
        <linearGradient id="overlayGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={OVERLAY_COLOR_1} />
          <stop offset="40%" stopColor={OVERLAY_COLOR_2} />
          <stop offset="70%" stopColor={OVERLAY_COLOR_3} />
          <stop offset="100%" stopColor={OVERLAY_COLOR_4} />
        </linearGradient>
      </defs>
      <g key={i}>
        <path
          d={`M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y}`}
          fill="none"
          stroke={BASE_COLOR}
          strokeOpacity={0.4}
          // stroke="url(#baseGradient)"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
        />
        {progress > 0 && (
          <path
            d={`M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${actualLargeArc} 1 ${actualEnd.x} ${actualEnd.y}`}
            fill="none"
            stroke={OVERLAY_COLOR}
            strokeOpacity={0.9}
            // stroke="url(#overlayGradient)"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
          />
        )}
      </g>
    </svg>
  );
};

export default function SegmentedTimer() {
  const totalTime = 60;
  const [totalSeconds, setTotalSeconds] = useState(totalTime); // 5 minutes default
  const [remainingSeconds, setRemainingSeconds] = useState(totalTime);
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
    <div className="fullscreen-center">
      <div className="timer-container">
        <div className="timer-container-ring">
          <svg viewBox={`0 0 ${SVG_VIEWBOX.w} ${SVG_VIEWBOX.h}`}>
            {SEGMENT_PROPORTIONS.map((proportion, i) => {
              const startAngle = getCumulativeAngle(i) - 90; // Start from top
              const endAngle = startAngle + segmentAngles[i];
              const segmentProgress = getSegmentProgress(i);
              return <Segment key={i} i={i} startAngle={startAngle} endAngle={endAngle} progress={segmentProgress} />;
            })}
          </svg>
          <div className="timer-container-text">
            {(() => {
              const fiftyFivePercent = Math.round((55 / 60) * totalTime);
              const fifteenPercent = Math.round((15 / 60) * totalTime);
              const tenPercent = Math.round((10 / 60) * totalTime);
              const fivePercent = Math.round((5 / 60) * totalTime);

              let message = null;

              // Show each message for a range of time
              if (remainingSeconds <= totalTime && remainingSeconds >= fiftyFivePercent) {
                message = "Preview";
              } else if (remainingSeconds < fiftyFivePercent && remainingSeconds >= fifteenPercent) {
                message = "Focus";
              } else if (remainingSeconds < fifteenPercent && remainingSeconds >= tenPercent) {
                message = "Overview";
              } else if (remainingSeconds < tenPercent && remainingSeconds > 0) {
                message = "Break";
              } else if (remainingSeconds === 0) {
                message = "Done 🎉";
              }

              return message ? (
                <div className="progress-text">
                  <div className="progress-text">{message}</div>
                </div>
              ) : null;
            })()}
            {/* <div className="preview-text">Preview</div> */}
            <div className="timer-text">{formatTime(remainingSeconds)}</div>
          </div>
          {/* Controls */}
        </div>
        <div className="controls">
          <button onClick={startTimer} disabled={isRunning || remainingSeconds === 0} className="control-button start">
            Start
          </button>
          <button onClick={pauseTimer} disabled={!isRunning} className="control-button pause">
            Pause
          </button>
          <button onClick={resetTimer} className="control-button reset">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

// {[(5 / 60) * startTimer, (40 / 60) * startTimer, (5 / 60) * startTimer, (10 / 60) * startTimer, 0].includes(
//   remainingSeconds
// ) && (
//   <div className="milestone-alert">
//   <div className="preview-text">
//     {remainingSeconds === (5 / 60) * startTimer && "Halfway there! 🎯"}
//     {remainingSeconds === (40 / 60) * startTimer && "30 seconds left! ⏰"}
//     {remainingSeconds === (5 / 60) * startTimer && "Final countdown! 🚨"}
//     {remainingSeconds === (10 / 60) * startTimer && "Final countdown! 🚨"}
//     {remainingSeconds === 0 && "Done! 🎉"}
//   </div>
// </div>
