import React, { useState, useEffect, useRef } from "react";
import "./App.css";

import {
  SEGMENT_PROPORTIONS,
  RADIUS,
  STROKE_WIDTH,
  GAP_ANGLE,
  BASE_COLOR,
  OVERLAY_COLOR,
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
    <div className="timer-container">
      <div className="ring-wrapper">
        <svg viewBox={`0 0 ${SVG_VIEWBOX.w} ${SVG_VIEWBOX.h}`}>
          {SEGMENT_PROPORTIONS.map((proportion, i) => {
            const startAngle = getCumulativeAngle(i) - 90; // Start from top
            const endAngle = startAngle + segmentAngles[i];
            const segmentProgress = getSegmentProgress(i);
            return <Segment key={i} i={i} startAngle={startAngle} endAngle={endAngle} progress={segmentProgress} />;
          })}
        </svg>
        <div className="timer-wrapper">
          <div className="preview-text">Preview</div>
          <div className="timer-text">{formatTime(remainingSeconds)}</div>
          {remainingSeconds === 0 && (
            <div className="progress-indicator">
              <div className="done-badge">Done!</div>
            </div>
          )}
        </div>
      </div>
      {/* </div> */}

      {/* Controls
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
      </div> */}

      {/* Timer setup
      <div className="timer-setup">
        <label htmlFor="minutes" className="timer-setup-label">
          Total time:
        </label>
        <input
          id="minutes"
          type="number"
          min="1"
          max="60"
          value={0.1}
          onChange={(e) => setInputMinutes(parseInt(e.target.value) || 1)}
          className="timer-input"
        />
        <button onClick={setNewTimer} disabled={isRunning} className="set-button">
          Set
        </button>
      </div> */}
    </div>
  );
}
