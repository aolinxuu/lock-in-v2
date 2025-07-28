import { GAP, SEGMENT_PROPORTIONS } from "./constants";

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const degToRad = (deg) => (deg * Math.PI) / 180;

// Convert angle to cartesian coordinates
export const calculatePoint = (cx, cy, r, angleDeg) => {
  const rad = degToRad(angleDeg);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
};

const totalAngle = 360 - SEGMENT_PROPORTIONS.length * GAP;
export const segmentAngles = SEGMENT_PROPORTIONS.map((proportion) => proportion * totalAngle);

export const getCumulativeAngle = (index) => {
  let cumulative = 0;
  for (let i = 0; i < index; i++) {
    cumulative += segmentAngles[i] + GAP;
  }
  return cumulative;
};
