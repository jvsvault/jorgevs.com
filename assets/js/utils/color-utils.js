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
      // Only set crossOrigin if it's an external URL
      if (imagePath.startsWith('http') && !imagePath.includes(window.location.hostname)) {
        img.crossOrigin = 'Anonymous';
      }
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const size = 100; // Larger sample size for better analysis
          
          canvas.width = size;
          canvas.height = size;
          ctx.drawImage(img, 0, 0, size, size);
          
          const imageData = ctx.getImageData(0, 0, size, size).data;
          
          // Sample multiple points across the image
          const colorCounts = {};
          const samplePoints = [
            // Grid of 9 points
            {x: 0.25, y: 0.25}, {x: 0.5, y: 0.25}, {x: 0.75, y: 0.25},
            {x: 0.25, y: 0.5}, {x: 0.5, y: 0.5}, {x: 0.75, y: 0.5},
            {x: 0.25, y: 0.75}, {x: 0.5, y: 0.75}, {x: 0.75, y: 0.75},
            // Extra points for better coverage
            {x: 0.33, y: 0.33}, {x: 0.67, y: 0.33},
            {x: 0.33, y: 0.67}, {x: 0.67, y: 0.67}
          ];
          
          // Sample colors from multiple points
          let totalR = 0, totalG = 0, totalB = 0;
          let validSamples = 0;
          
          samplePoints.forEach(point => {
            const x = Math.floor(point.x * size);
            const y = Math.floor(point.y * size);
            const index = (y * size + x) * 4;
            
            const r = imageData[index];
            const g = imageData[index + 1];
            const b = imageData[index + 2];
            
            // Skip very dark or very light colors (likely background)
            const brightness = (r + g + b) / 3;
            if (brightness > 20 && brightness < 235) {
              totalR += r;
              totalG += g;
              totalB += b;
              validSamples++;
            }
          });
          
          // If we got valid samples, use average
          if (validSamples > 0) {
            const avgR = Math.round(totalR / validSamples);
            const avgG = Math.round(totalG / validSamples);
            const avgB = Math.round(totalB / validSamples);
            
            // Boost saturation slightly for more vibrant colors
            const max = Math.max(avgR, avgG, avgB);
            const min = Math.min(avgR, avgG, avgB);
            const saturationBoost = 1.2;
            
            const finalR = Math.round(min + (avgR - min) * saturationBoost);
            const finalG = Math.round(min + (avgG - min) * saturationBoost);
            const finalB = Math.round(min + (avgB - min) * saturationBoost);
            
            const hex = this.rgbToHex(
              Math.min(255, Math.max(0, finalR)),
              Math.min(255, Math.max(0, finalG)),
              Math.min(255, Math.max(0, finalB))
            );
            
            console.log(`COLOR UTILS: Extracted color ${hex} from ${imagePath}`);
            resolve(hex);
          } else {
            // Fallback to center pixel if no valid samples
            const centerIndex = Math.floor((size * size / 2) + (size / 2)) * 4;
            const r = imageData[centerIndex];
            const g = imageData[centerIndex + 1];
            const b = imageData[centerIndex + 2];
            const hex = this.rgbToHex(r, g, b);
            console.log(`COLOR UTILS: Fallback color ${hex} from center of ${imagePath}`);
            resolve(hex);
          }
        } catch (error) {
          console.error('COLOR UTILS: Error extracting color:', error);
          reject(error);
        }
      };
      
      img.onerror = () => {
        console.error(`COLOR UTILS: Failed to load image: ${imagePath}`);
        reject(new Error('Failed to load image'));
      };
      img.src = imagePath;
    });
  }
}