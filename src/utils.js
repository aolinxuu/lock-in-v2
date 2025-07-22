/**
 * Calculates the end point of an arc and the start point of the next segment
 * @param {number} startX - Starting X coordinate
 * @param {number} startY - Starting Y coordinate
 * @param {number} centerX - Center X coordinate of the circle
 * @param {number} centerY - Center Y coordinate of the circle
 * @param {number} radius - Radius of the circle
 * @param {number} percentage - Percentage of the circle for this arc (0-1)
 * @param {number} segmentGap - Gap between segments in degrees (default: 12)
 * @returns {Object} Object containing endX, endY, nextStartX, nextStartY coordinates
 */
export function getArcEndPoint(startX, startY, centerX, centerY, radius, percentage, segmentGap = 12) {
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

// difference colors
// <defs>
//   {/* {colorPairs.map((colors, i) => ( */}
//   {/* <linearGradient key={i} id={`gradient-${i}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="0"> */}
//   <linearGradient id="constant-gradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="0">
//     <stop offset="0%" stopColor="#93CDAC" />
//     <stop offset="100%" stopColor="#93CDAC" />
//   </linearGradient>
//   {/* ))} */}
// </defs>
