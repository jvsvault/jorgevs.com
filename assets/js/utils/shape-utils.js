/**
 * Shape Utility Functions
 * Defines and manages geometric shapes for decorations
 */

export class ShapeUtils {
  // Text decoration shapes - only pure rectangles for readability
  static textShapes = [
    'polygon(0 0, 100% 0, 100% 100%, 0 100%)' // rectangle only
  ];

  // Profile frame shapes - only triangle, square, circle
  static profileShapes = {
    square: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
    circle: 'circle(49% at 50% 50%)', // Slightly smaller radius to prevent clipping
    triangle: 'polygon(50% 0%, 0% 100%, 100% 100%)'
  };

  /**
   * Get a random text shape
   */
  static getRandomTextShape() {
    return this.textShapes[Math.floor(Math.random() * this.textShapes.length)];
  }

  /**
   * Get a random profile shape
   */
  static getRandomProfileShape() {
    const shapeNames = Object.keys(this.profileShapes);
    const selectedShape = shapeNames[Math.floor(Math.random() * shapeNames.length)];
    return this.profileShapes[selectedShape];
  }

  /**
   * Generate random dimensions within constraints
   */
  static getRandomDimensions(config) {
    const {
      minWidth = 100,
      maxWidth = 200,
      minHeight = 20,
      maxHeight = 40
    } = config;

    return {
      width: Math.floor(Math.random() * (maxWidth - minWidth)) + minWidth,
      height: Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight
    };
  }
}