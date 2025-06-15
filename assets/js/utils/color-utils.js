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

    // Check if grayscale
    const isGrayscale = Math.abs(rgb.r - rgb.g) < 10 && Math.abs(rgb.g - rgb.b) < 10;
    
    if (isGrayscale) {
      // For grayscale, create gray variations - all dark enough for white text
      const gray = Math.min(100, rgb.r); // Ensure base is dark enough
      return {
        base: baseColor,
        light: `rgb(${Math.min(120, gray + 40)}, ${Math.min(120, gray + 40)}, ${Math.min(120, gray + 40)})`,
        dark: `rgb(${Math.max(0, gray - 40)}, ${Math.max(0, gray - 40)}, ${Math.max(0, gray - 40)})`,
        medium: `rgb(${Math.min(100, Math.round(gray * 0.8 + 20))}, ${Math.min(100, Math.round(gray * 0.8 + 20))}, ${Math.min(100, Math.round(gray * 0.8 + 20))})`,
        contrast: `rgb(60, 60, 60)` // Always dark for contrast
      };
    } else {
      // For color images, create color variations - ensure all are dark enough
      // Cap each channel to ensure visibility
      const capR = Math.min(140, rgb.r);
      const capG = Math.min(140, rgb.g);
      const capB = Math.min(140, rgb.b);
      
      return {
        base: baseColor,
        light: `rgb(${Math.min(160, capR + 30)}, ${Math.min(160, capG + 30)}, ${Math.min(160, capB + 30)})`,
        dark: `rgb(${Math.max(0, capR - 40)}, ${Math.max(0, capG - 40)}, ${Math.max(0, capB - 40)})`,
        saturated: `rgb(${Math.min(140, capR * 1.2)}, ${Math.max(0, capG * 0.8)}, ${Math.max(0, capB * 0.8)})`,
        vibrant: `rgb(${Math.min(140, Math.max(capR, 80))}, ${Math.min(140, Math.max(capG, 80))}, ${Math.min(140, Math.max(capB, 80))})`
      };
    }
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
          let colors = [];
          let grayscaleColors = [];
          
          samplePoints.forEach(point => {
            const x = Math.floor(point.x * size);
            const y = Math.floor(point.y * size);
            const index = (y * size + x) * 4;
            
            const r = imageData[index];
            const g = imageData[index + 1];
            const b = imageData[index + 2];
            
            // Skip very dark or very light colors (likely background)
            const brightness = (r + g + b) / 3;
            const saturation = Math.max(r, g, b) - Math.min(r, g, b);
            
            // Check if it's a grayscale pixel
            const isGrayPixel = saturation < 10;
            
            if (isGrayPixel) {
              if (brightness > 20 && brightness < 235) {
                grayscaleColors.push({ r, g, b, brightness });
              }
            } else if (brightness > 20 && brightness < 235 && saturation > 30) {
              colors.push({ r, g, b, saturation });
            }
          });
          
          // Sort by saturation and pick the most vibrant color
          colors.sort((a, b) => b.saturation - a.saturation);
          
          let avgR, avgG, avgB;
          if (colors.length > 0) {
            // Take average of top 3 most saturated colors
            const topColors = colors.slice(0, Math.min(3, colors.length));
            avgR = Math.round(topColors.reduce((sum, c) => sum + c.r, 0) / topColors.length);
            avgG = Math.round(topColors.reduce((sum, c) => sum + c.g, 0) / topColors.length);
            avgB = Math.round(topColors.reduce((sum, c) => sum + c.b, 0) / topColors.length);
          } else {
            // Fallback to center pixel
            const centerIndex = Math.floor((size * size / 2) + (size / 2)) * 4;
            avgR = imageData[centerIndex];
            avgG = imageData[centerIndex + 1];
            avgB = imageData[centerIndex + 2];
          }
          
          // Determine if the entire image is grayscale
          const isGrayscaleImage = colors.length === 0 && grayscaleColors.length > 0;
          
          if (isGrayscaleImage && grayscaleColors.length > 0) {
            // For grayscale images, use the median brightness value
            grayscaleColors.sort((a, b) => a.brightness - b.brightness);
            const medianIndex = Math.floor(grayscaleColors.length / 2);
            const medianBrightness = Math.round(grayscaleColors[medianIndex].brightness);
            
            // Clamp to a reasonable range to avoid pure white/black
            // Maximum 100 to ensure text is always readable (darker than before)
            const clampedGray = Math.min(100, Math.max(40, medianBrightness));
            const hex = this.rgbToHex(clampedGray, clampedGray, clampedGray);
            console.log(`COLOR UTILS: Grayscale image detected, using gray ${hex} (median brightness: ${medianBrightness}) from ${imagePath}`);
            resolve(hex);
          } else if (colors.length > 0) {
            // For color images, use existing logic
            const topColors = colors.slice(0, Math.min(3, colors.length));
            const avgR = Math.round(topColors.reduce((sum, c) => sum + c.r, 0) / topColors.length);
            const avgG = Math.round(topColors.reduce((sum, c) => sum + c.g, 0) / topColors.length);
            const avgB = Math.round(topColors.reduce((sum, c) => sum + c.b, 0) / topColors.length);
            
            // Boost saturation for color images
            const max = Math.max(avgR, avgG, avgB);
            const min = Math.min(avgR, avgG, avgB);
            const saturationBoost = 1.8;
            
            const finalR = Math.round(min + (avgR - min) * saturationBoost);
            const finalG = Math.round(min + (avgG - min) * saturationBoost);
            const finalB = Math.round(min + (avgB - min) * saturationBoost);
            
            // Ensure the color isn't too light (limit brightness)
            const brightness = (finalR + finalG + finalB) / 3;
            let adjustedR = finalR;
            let adjustedG = finalG;
            let adjustedB = finalB;
            
            // Much stricter limit - maximum brightness of 140 for better contrast
            if (brightness > 140) {
              // Scale down to ensure readability
              const scale = 140 / brightness;
              adjustedR = Math.round(finalR * scale);
              adjustedG = Math.round(finalG * scale);
              adjustedB = Math.round(finalB * scale);
            }
            
            // Additional check: ensure minimum contrast ratio
            // If any channel is too high, darken the whole color
            const maxChannel = Math.max(adjustedR, adjustedG, adjustedB);
            if (maxChannel > 160) {
              const darkScale = 160 / maxChannel;
              adjustedR = Math.round(adjustedR * darkScale);
              adjustedG = Math.round(adjustedG * darkScale);
              adjustedB = Math.round(adjustedB * darkScale);
            }
            
            const hex = this.rgbToHex(
              Math.min(255, Math.max(0, adjustedR)),
              Math.min(255, Math.max(0, adjustedG)),
              Math.min(255, Math.max(0, adjustedB))
            );
            
            console.log(`COLOR UTILS: Extracted vibrant color ${hex} from ${imagePath} (brightness: ${brightness})`);
            resolve(hex);
          } else {
            console.log(`COLOR UTILS: No suitable colors found, using gray fallback`);
            resolve('#808080');
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