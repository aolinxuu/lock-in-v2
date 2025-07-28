// ================================
// svg/SVGSegmentFactory.js
// ================================

import React from "react";

/**
 * Factory for creating SVG path elements
 */
export class SVGSegmentFactory {
  constructor(strokeWidth) {
    this.strokeWidth = strokeWidth;
  }

  createFullCircle(key, centerX, centerY, radius, color) {
    return (
      <circle
        key={key}
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={this.strokeWidth}
        strokeLinecap="round"
      />
    );
  }

  createArc(key, startPoint, endPoint, radius, percentage, color) {
    const largeArcFlag = percentage > 0.5 ? 1 : 0;

    return (
      <path
        key={key}
        d={`M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endPoint.x} ${endPoint.y}`}
        fill="none"
        stroke={color}
        strokeWidth={this.strokeWidth}
        strokeLinecap="round"
      />
    );
  }
}
