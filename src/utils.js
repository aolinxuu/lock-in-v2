// import {
//   SEGMENT_PROPORTIONS,
//   // SVG_VIEWBOX,
//   DEFAULT_RADIUS,
//   DEFAULT_STROKE_WIDTH,
//   CENTER_X,
//   CENTER_Y,
//   GAP,
//   SEGMENT_COLOR,
//   PROGRESS_COLOR,
// } from "./constants";

// import { calculatePoint, segmentAngles } from "./math";

// // Create a full circle segment
// const createFullCircleSegment = (key) => (
//   <circle
//     key={key}
//     cx={CENTER_X}
//     cy={CENTER_Y}
//     r={DEFAULT_RADIUS}
//     fill="none"
//     stroke={SEGMENT_COLOR}
//     strokeWidth={DEFAULT_STROKE_WIDTH}
//     strokeLinecap="round"
//   />
// );

// // Helper function to create a partial circle segment
// const drawSegment = (key, startX, startY, endX, endY, percentage, color) => (
//   <path
//     key={key}
//     d={`M ${startX} ${startY} A ${DEFAULT_RADIUS} ${DEFAULT_RADIUS} 0 ${percentage > 0.5 ? 1 : 0} 1 ${endX} ${endY}`}
//     fill="none"
//     stroke={color}
//     strokeWidth={DEFAULT_STROKE_WIDTH}
//     strokeLinecap="round"
//   />
// );

// const resetTimer = () => {
//   setIsRunning(false);
//   setRemainingSeconds(totalSeconds);
// };

// const setNewTimer = () => {
//   const newTotal = inputMinutes * 60;
//   setTotalSeconds(newTotal);
//   setRemainingSeconds(newTotal);
//   setIsRunning(false);
// };

// const totalProgress = (totalSeconds - remainingSeconds) / totalSeconds;

// const getSegmentProgress = (segmentIndex) => {
//   // Calculate cumulative proportions to determine when each segment should start/end
//   let cumulativeProportion = 0;
//   for (let i = 0; i < segmentIndex; i++) {
//     cumulativeProportion += SEGMENT_PROPORTIONS[i];
//   }

//   const segmentStart = cumulativeProportion;
//   const segmentEnd = cumulativeProportion + SEGMENT_PROPORTIONS[segmentIndex];

//   if (totalProgress <= segmentStart) {
//     return 0; // Segment hasn't started
//   } else if (totalProgress >= segmentEnd) {
//     return 1; // Segment is complete
//   } else {
//     // Segment is partially complete
//     return (totalProgress - segmentStart) / SEGMENT_PROPORTIONS[segmentIndex];
//   }
// };

// // Calculate all points needed for an arc segment
// export function getArcPoints(startX, startY, percentage, GAP) {
//   const startAngle = Math.atan2(startY - CENTER_Y, startX - CENTER_X);
//   const adjustedStartAngle = startAngle + GAP;
//   const angleDelta = 2 * Math.PI * percentage - GAP;
//   const endAngle = startAngle + angleDelta;

//   const endPoint = calculatePoint(endAngle);
//   const nextStartPoint = calculatePoint(startAngle + 2 * Math.PI * percentage);
//   const actualStartPoint = calculatePoint(adjustedStartAngle);

//   return {
//     endX: endPoint.x,
//     endY: endPoint.y,
//     nextStartX: nextStartPoint.x,
//     nextStartY: nextStartPoint.y,
//     actualStartX: actualStartPoint.x,
//     actualStartY: actualStartPoint.y,
//   };
// }
// function addGap(arcPoints, currentX, currentY, GAP) {
//   const startAngle = Math.atan2(currentY - CENTER_Y, currentX - CENTER_X);
//   const endAngle = Math.atan2(arcPoints.endY - CENTER_Y, arcPoints.endX - CENTER_X);

//   const adjustedStartAngle = startAngle + GAP;
//   const adjustedEndAngle = endAngle - GAP;

//   const adjustedStartPoint = calculatePoint(adjustedStartAngle);
//   const adjustedEndPoint = calculatePoint(adjustedEndAngle);

//   return {
//     ...arcPoints,
//     actualStartX: adjustedStartPoint.x,
//     actualStartY: adjustedStartPoint.y,
//     endX: adjustedEndPoint.x,
//     endY: adjustedEndPoint.y,
//   };
// }
// const getCumulativeAngle = (index) => {
//   let cumulative = 0;
//   for (let i = 0; i < index; i++) {
//     cumulative += segmentAngles[i] + GAP;
//   }
//   return cumulative;
// };

// // Main function to generate all segments
// export const createSegments = () => {
//   SEGMENT_PROPORTIONS.map((proportion, i) => {
//     const startAngle = getCumulativeAngle(i) - 90;
//     const endAngle = startAngle + segmentAngles[i];
//     const segmentProgress = getSegmentProgress(i);
//     return <Segment key={i} i={i} startAngle={startAngle} endAngle={endAngle} progress={segmentProgress} />;
//   });

//   //   const segments = [];
//   //   let currentX = CENTER_X;
//   //   let currentY = CENTER_Y - DEFAULT_DEFAULT_RADIUS;

//   //   PERCENTAGES.forEach((percentage, index) => {
//   //     if (percentage <= 0) return;

//   //     // const arcPoints = getArcPoints(currentX, currentY, percentage, GAP);
//   //     const arcPoints = getArcPoints(currentX, currentY, percentage, 0);
//   //     const adjustedPoints = addGap(arcPoints, currentX, currentY, GAP);

//   //     const segment =
//   //       percentage === 1
//   //         ? createFullCircleSegment(index)
//   //         : drawSegment(
//   //             index,
//   //             adjustedPoints.actualStartX,
//   //             adjustedPoints.actualStartY,
//   //             adjustedPoints.endX,
//   //             adjustedPoints.endY,
//   //             percentage,
//   //             SEGMENT_COLOR
//   //           );
//   //     segments.push(segment);
//   //     currentX = arcPoints.nextStartX;
//   //     currentY = arcPoints.nextStartY;
//   //   });

//   //   return segments;
// };

// export const getProgressSegmentInfo = (totalProgress) => {
//   // Return []
//   // result[i] = progress in that segment
//   // [1, 0.4]

//   // total progress = 70
//   // 50 - 50
//   // 50 - 20

//   const progresses = [];
//   for (let i = 0; i < SEGMENT_PROPORTIONS.length; i++) {
//     // Try fill up this segment
//     const segmentTotalPercentage = SEGMENT_PROPORTIONS[i];
//     if (totalProgress >= segmentTotalPercentage) {
//       progresses.push(1.0);
//       totalProgress -= segmentTotalPercentage;
//     } else {
//       progresses.push(totalProgress / segmentTotalPercentage);
//       totalProgress -= totalProgress;
//     }
//     // const segmentEnd = segmentProgress + PERCENTAGES[i];

//     // if (totalProgress <= segmentEnd) {
//     //   currentSegmentIndex = i;
//     //   progressInCurrentSegment = PERCENTAGES[i] > 0 ? (totalProgress - segmentProgress) / PERCENTAGES[i] : 0;
//     //   break;
//     // }
//     // segmentProgress = segmentEnd;
//   }
//   return progresses;
// };

// const Segment = ({ startAngle, endAngle, progress, i }) => {
//   const start = calculatePoint(100, 100, DEFAULT_RADIUS, startAngle);
//   const end = calculatePoint(100, 100, DEFAULT_RADIUS, endAngle);
//   const largeArc = endAngle - startAngle > 180 ? 1 : 0;

//   // Calculate the partial end point based on progress
//   const actualEndAngle = startAngle + (endAngle - startAngle) * progress;
//   const actualEnd = calculatePoint(100, 100, DEFAULT_RADIUS, actualEndAngle);
//   const actualLargeArc = actualEndAngle - startAngle > 180 ? 1 : 0;

//   return (
//     <g key={i}>
//       {/* Background segment (gray) */}
//       <path
//         d={`M ${start.x} ${start.y} A ${DEFAULT_RADIUS} ${DEFAULT_RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y}`}
//         fill="none"
//         stroke="#e5e7eb"
//         strokeWidth={DEFAULT_STROKE_WIDTH}
//         strokeLinecap="round"
//       />
//       {/* Progress segment (blue) - only render if there's progress */}
//       {progress > 0 && (
//         <path
//           d={`M ${start.x} ${start.y} A ${DEFAULT_RADIUS} ${DEFAULT_RADIUS} 0 ${actualLargeArc} 1 ${actualEnd.x} ${actualEnd.y}`}
//           fill="none"
//           stroke="#3b82f6"
//           strokeWidth={DEFAULT_STROKE_WIDTH}
//           strokeLinecap="round"
//         />
//       )}
//     </g>
//   );
// };
// // 1. CreateSegment
// // 2. DrawSegmentProgress

// // export const createProgressOverlay = (totalProgress) => {
// //   const segmentProgresses = getProgressSegmentInfo(totalProgress);
// //   console.log(`SegmentProgresses = ${segmentProgresses}`);

// //   const progressArcs = [];
// //   let currentX = CENTER_X;
// //   let currentY = CENTER_Y - DEFAULT_DEFAULT_RADIUS;

// //   for (let i = 0; i < segmentProgresses.length; ++i) {
// //     const progress = segmentProgresses[i];
// //     if (progress <= 0) break;

// //     const percentage = progress * PERCENTAGES[i];
// //     const arcPoints = getArcPoints(currentX, currentY, percentage, 0);
// //     const adjustedPoints = addGap(arcPoints, currentX, currentY, GAP);

// //     const progressArc = drawSegment(
// //       i,
// //       adjustedPoints.actualStartX,
// //       adjustedPoints.actualStartY,
// //       adjustedPoints.endX,
// //       adjustedPoints.endY,
// //       percentage,
// //       PROGRESS_COLOR
// //     );
// //     progressArcs.push(progressArc);

// //     currentX = arcPoints.nextStartX;
// //     currentY = arcPoints.nextStartY;
// //   }

// //   return progressArcs;
// // };
