/**
 * Image Preloader and Cache Manager
 * Preloads images and caches extracted colors for instant loading
 */

import { ColorUtils } from './utils/color-utils.js';

class ImagePreloader {
  constructor() {
    this.imageCache = new Map();
    this.colorCache = new Map();
    this.preloadPromises = [];
    this.CACHE_KEY = 'jvs_color_cache';
    this.CACHE_VERSION = '1.0';
    this.loadCacheFromStorage();
  }
  
  /**
   * Load color cache from localStorage
   */
  loadCacheFromStorage() {
    try {
      const stored = localStorage.getItem(this.CACHE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.version === this.CACHE_VERSION) {
          // Convert back to Map
          Object.entries(data.colors).forEach(([path, colorData]) => {
            this.colorCache.set(path, colorData);
          });
          console.log(`PRELOADER: Loaded ${this.colorCache.size} cached colors from storage`);
        }
      }
    } catch (error) {
      console.error('PRELOADER: Error loading cache from storage:', error);
    }
  }
  
  /**
   * Save color cache to localStorage
   */
  saveCacheToStorage() {
    try {
      const data = {
        version: this.CACHE_VERSION,
        timestamp: Date.now(),
        colors: Object.fromEntries(this.colorCache)
      };
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('PRELOADER: Error saving cache to storage:', error);
    }
  }

  /**
   * Preload an image and extract its color
   */
  async preloadImage(imagePath) {
    // Return cached result if available
    if (this.imageCache.has(imagePath)) {
      return this.imageCache.get(imagePath);
    }

    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = async () => {
        // Extract color while we have the image loaded
        try {
          const color = await ColorUtils.extractDominantColor(imagePath);
          const colorVariations = ColorUtils.generateVariations(color);
          
          // Cache the results
          this.colorCache.set(imagePath, {
            baseColor: color,
            variations: colorVariations
          });
          
          // Save to localStorage
          this.saveCacheToStorage();
          
          resolve({
            path: imagePath,
            loaded: true,
            color: color,
            variations: colorVariations
          });
        } catch (error) {
          console.error(`PRELOADER: Failed to extract color from ${imagePath}:`, error);
          resolve({
            path: imagePath,
            loaded: true,
            color: '#808080',
            variations: ColorUtils.generateVariations('#808080')
          });
        }
      };
      
      img.onerror = () => {
        console.error(`PRELOADER: Failed to load ${imagePath}`);
        reject(new Error(`Failed to load ${imagePath}`));
      };
      
      img.src = imagePath;
    });

    this.imageCache.set(imagePath, promise);
    return promise;
  }

  /**
   * Preload multiple images in parallel
   */
  async preloadImages(imagePaths) {
    console.log(`PRELOADER: Starting preload of ${imagePaths.length} images`);
    const startTime = performance.now();
    
    const promises = imagePaths.map(path => 
      this.preloadImage(path).catch(err => {
        console.error(`PRELOADER: Error loading ${path}:`, err);
        return null;
      })
    );
    
    const results = await Promise.all(promises);
    const successful = results.filter(r => r !== null);
    
    const endTime = performance.now();
    console.log(`PRELOADER: Loaded ${successful.length}/${imagePaths.length} images in ${Math.round(endTime - startTime)}ms`);
    
    return successful;
  }

  /**
   * Get cached color for an image
   */
  getCachedColor(imagePath) {
    return this.colorCache.get(imagePath);
  }

  /**
   * Preload all site images
   */
  async preloadAllImages(backgroundImages, profileImages) {
    const allImages = [];
    
    // Add bg-geo images
    backgroundImages.forEach(img => {
      allImages.push(`/assets/images/bg-geo/${img}`);
    });
    
    // Add profile images
    profileImages.forEach(img => {
      allImages.push(`/assets/images/profile/${img}`);
    });
    
    return this.preloadImages(allImages);
  }

  /**
   * Clear caches
   */
  clearCache() {
    this.imageCache.clear();
    this.colorCache.clear();
  }
}

// Create singleton instance
const imagePreloader = new ImagePreloader();

export default imagePreloader;