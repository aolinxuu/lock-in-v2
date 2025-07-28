// ================================
// progress/ProgressCalculator.js
// ================================

/**
 * Manages progress calculation across segments
 */
export class ProgressCalculator {
  constructor(percentages) {
    this.percentages = percentages;
    this.totalPercentage = percentages.reduce((sum, p) => sum + p, 0);
  }

  /**
   * Get progress information for a given total progress value
   */
  getSegmentProgress(totalProgress) {
    let accumulatedProgress = 0;

    for (let i = 0; i < this.percentages.length; i++) {
      const segmentEnd = accumulatedProgress + this.percentages[i];

      if (totalProgress <= segmentEnd) {
        const progressInSegment =
          this.percentages[i] > 0 ? (totalProgress - accumulatedProgress) / this.percentages[i] : 0;

        return {
          currentSegmentIndex: i,
          progressInCurrentSegment: Math.max(0, Math.min(1, progressInSegment)),
          accumulatedProgress,
        };
      }

      accumulatedProgress = segmentEnd;
    }

    // Handle case where totalProgress exceeds total
    return {
      currentSegmentIndex: this.percentages.length - 1,
      progressInCurrentSegment: 1,
      accumulatedProgress: this.totalPercentage,
    };
  }
}
