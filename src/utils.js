import {
  PERCENTAGES,
  // SVG_VIEWBOX,
  DEFAULT_RADIUS,
  DEFAULT_STROKE_WIDTH,
  CENTER_X,
  CENTER_Y,
  GAP,
  SEGMENT_COLOR,
} from "./constants";

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Helper function to create a full circle segment
const createFullCircleSegment = (key) => (
  <circle
    key={key}
    cx={CENTER_X}
    cy={CENTER_Y}
    r={DEFAULT_RADIUS}
    fill="none"
    stroke={SEGMENT_COLOR}
    strokeWidth={DEFAULT_STROKE_WIDTH}
    strokeLinecap="round"
  />
);

// Helper function to create a partial circle segment
const createPartialCircleSegment = (key, startX, startY, endX, endY, percentage) => (
  <path
    key={key}
    d={`M ${startX} ${startY} A ${DEFAULT_RADIUS} ${DEFAULT_RADIUS} 0 ${percentage > 0.5 ? 1 : 0} 1 ${endX} ${endY}`}
    fill="none"
    stroke={SEGMENT_COLOR}
    strokeWidth={DEFAULT_STROKE_WIDTH}
    strokeLinecap="round"
  />
);

// Main function to generate all segments
export const createSegments = () => {
  const segments = [];
  let currentX = CENTER_X;
  let currentY = CENTER_Y - DEFAULT_RADIUS;
  const gapRadians = (GAP * Math.PI) / 180;

  PERCENTAGES.forEach((percentage, index) => {
    if (percentage <= 0) return;

    const arcPoints = getArcPoints(currentX, currentY, DEFAULT_RADIUS, percentage, gapRadians);

    const segment =
      percentage === 1
        ? createFullCircleSegment(index)
        : createPartialCircleSegment(
            index,
            arcPoints.actualStartX,
            arcPoints.actualStartY,
            arcPoints.endX,
            arcPoints.endY,
            percentage
          );

    segments.push(segment);
    currentX = arcPoints.nextStartX;
    currentY = arcPoints.nextStartY;
  });

  return segments;
};

// Calculate all points needed for an arc segment
export function getArcPoints(startX, startY, radius, percentage, gapRadians) {
  const startAngle = Math.atan2(startY - CENTER_Y, startX - CENTER_X);
  const adjustedStartAngle = startAngle + gapRadians;
  const angleDelta = 2 * Math.PI * percentage - gapRadians;
  const endAngle = startAngle + angleDelta;

  const calculatePoint = (angle) => ({
    x: CENTER_X + radius * Math.cos(angle),
    y: CENTER_Y + radius * Math.sin(angle),
  });

  const endPoint = calculatePoint(endAngle);
  const nextStartPoint = calculatePoint(startAngle + 2 * Math.PI * percentage);
  const actualStartPoint = calculatePoint(adjustedStartAngle);

  return {
    endX: endPoint.x,
    endY: endPoint.y,
    nextStartX: nextStartPoint.x,
    nextStartY: nextStartPoint.y,
    actualStartX: actualStartPoint.x,
    actualStartY: actualStartPoint.y,
  };
}

// export const overlayProcess = () => {
//   if (totalProgress <= 0) return null;
//   // Start at top of circle
//   const startX = CENTER_X;
//   const startY = CENTER_Y - DEFAULT_RADIUS;
//   console.log("dahs");
//   console.log(totalProgress);

//   const gapRadians = (GAP * Math.PI) / 180;

//   const { endX, endY, nextStartX, nextStartY, actualStartX, actualStartY } = getArcPoints(
//     startX,
//     startY,
//     DEFAULT_RADIUS,
//     totalProgress,
//     gapRadians
//   );

//   const progressLargeArcFlag = totalProgress > 0.5 ? 1 : 0;
//   // console.log("askhfdah");
//   // console.log(startX, startY, progressLargeArcFlag, endX, endY);

//   return (
//     <path
//       key="progress-overlay"
//       d={`M ${startX} ${startY} A ${DEFAULT_RADIUS} ${DEFAULT_RADIUS} 0 ${progressLargeArcFlag} 1 ${endX} ${endY}`}
//       // d={`M ${50} ${20} A ${DEFAULT_RADIUS} ${DEFAULT_RADIUS} 0 ${progressLargeArcFlag} 1 ${endX} ${endY}`}
//       fill="none"
//       stroke="#F59E0B" // Orange color for progress
//       strokeWidth={DEFAULT_STROKE_WIDTH}
//       strokeLinecap="round"
//     />
//   );
// };
