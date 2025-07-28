// ================================
// geometry/CircleGeometry.js
// ================================

/**
 * Utility class for circle geometry calculations
 */
export class CircleGeometry {
  constructor(centerX, centerY, radius) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.radius = radius;
  }

  /**
   * Convert angle to cartesian coordinates
   */
  angleToPoint(angle) {
    return {
      x: this.centerX + this.radius * Math.cos(angle),
      y: this.centerY + this.radius * Math.sin(angle),
    };
  }

  /**
   * Convert cartesian coordinates to angle
   */
  pointToAngle(x, y) {
    return Math.atan2(y - this.centerY, x - this.centerX);
  }

  /**
   * Calculate arc endpoints for a given start point and percentage
   */
  calculateArcPoints(startX, startY, percentage) {
    const startAngle = this.pointToAngle(startX, startY);
    const endAngle = startAngle + 2 * Math.PI * percentage;
    const nextStartAngle = endAngle;

    return {
      startAngle,
      endAngle,
      startPoint: { x: startX, y: startY },
      endPoint: this.angleToPoint(endAngle),
      nextStartPoint: this.angleToPoint(nextStartAngle),
    };
  }
}
