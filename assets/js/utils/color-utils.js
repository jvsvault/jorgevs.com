/**
 * Color Utility Functions
 * Handles color manipulation and extraction
 */

export class ColorUtils {
  /**
   * Convert hex color to RGB
   */
  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * Convert RGB to hex
   */
  static rgbToHex(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  /**
   * Generate color variations from a base color
   */
  static generateVariations(baseColor) {
    const rgb = this.hexToRgb(baseColor);
    if (!rgb) return { base: baseColor };

    return {
      base: baseColor,
      light: `rgb(${Math.min(255, rgb.r + 40)}, ${Math.min(255, rgb.g + 40)}, ${Math.min(255, rgb.b + 40)})`,
      dark: `rgb(${Math.max(0, rgb.r - 40)}, ${Math.max(0, rgb.g - 40)}, ${Math.max(0, rgb.b - 40)})`,
      saturated: `rgb(${Math.min(255, rgb.r * 1.2)}, ${Math.max(0, rgb.g * 0.8)}, ${Math.max(0, rgb.b * 0.8)})`,
      desaturated: `rgb(${Math.round(rgb.r * 0.8 + 51)}, ${Math.round(rgb.g * 0.8 + 51)}, ${Math.round(rgb.b * 0.8 + 51)})`
    };
  }

  /**
   * Extract dominant color from an image
   */
  static extractDominantColor(imagePath) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const size = 50;
          
          canvas.width = size;
          canvas.height = size;
          ctx.drawImage(img, 0, 0, size, size);
          
          const imageData = ctx.getImageData(0, 0, size, size).data;
          const centerIndex = Math.floor((size * size / 2) + (size / 2)) * 4;
          
          const r = imageData[centerIndex];
          const g = imageData[centerIndex + 1];
          const b = imageData[centerIndex + 2];
          
          const hex = this.rgbToHex(r, g, b);
          resolve(hex);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imagePath;
    });
  }
}