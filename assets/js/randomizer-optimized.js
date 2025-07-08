/**
 * Optimized Randomization System with Preloading
 * Improves performance by preloading images and caching colors
 */

import { ColorUtils } from './utils/color-utils.js';
import { ShapeUtils } from './utils/shape-utils.js';
import imagePreloader from './image-preloader.js';
import sessionCache from './session-cache.js';

class JorgeVSRandomizer {
    constructor() {
      this.backgroundImages = [];
      this.geometryImages = [];
      this.profileImages = [];
      this.isInitialized = false;
      this.colorVariations = null;
      this.selectedImages = null;
      this.isPreloading = false;
    }
  
    /**
     * Initialize the randomizer
     */
    async initialize() {
      console.log('RANDOMIZER: Initializing optimized version');
  
      try {
        // Load available images
        await this.loadAvailableImages();
        
        // Start preloading in background (don't wait)
        this.preloadImagesInBackground();
        
        // Apply randomization immediately with first selection
        this.applyRandomization();
        this.isInitialized = true;
        console.log('RANDOMIZER: Initialization complete');
      } catch (error) {
        console.error('RANDOMIZER: Initialization failed:', error);
        this.applyFallbackRandomization();
      }
    }
    
    /**
     * Preload images in background
     */
    async preloadImagesInBackground() {
      if (this.isPreloading) return;
      this.isPreloading = true;
      
      console.log('RANDOMIZER: Starting background preload');
      
      // Preload a subset of images to avoid blocking
      const imagesToPreload = [
        ...this.backgroundImages.slice(0, 5).map(img => `/assets/images/bg-geo/${img}`),
        ...this.profileImages.slice(0, 3).map(img => `/assets/images/profile/${img}`)
      ];
      
      try {
        await imagePreloader.preloadImages(imagesToPreload);
        console.log('RANDOMIZER: Background preload complete');
      } catch (error) {
        console.error('RANDOMIZER: Background preload error:', error);
      }
    }
  
    /**
     * Load available images
     */
    async loadAvailableImages() {
      // Try API endpoints first
      try {
        const response = await fetch('/api/images');
        if (response.ok) {
          const data = await response.json();
          this.backgroundImages = data.bgGeo || [];
          this.geometryImages = data.bgGeo || [];
          this.profileImages = data.profile || [];
          console.log(`RANDOMIZER: API loaded ${this.backgroundImages.length} bg-geo images, ${this.profileImages.length} profile images`);
          return;
        }
      } catch (error) {
        console.log('RANDOMIZER: API not available');
      }
      
      // Fallback list
      const bgGeoImages = [
        '00420020.JPG',
        'R1-02565-022A.JPG',
        'r001-004.jpg',
        'r001-005.jpg',
        'r001-012.jpg',
        'r001-013.jpg',
        'r001-018.jpg',
        'r001-020.jpg',
        'r001-021 2.jpg',
        'r001-025.jpg'
      ];
      
      const profileImages = [
        '036_BW-2048x1152.jpg',
        '051-2048x1154.jpg',
        '060-2048x1154.jpg',
        '064-2048x1154.jpg',
        '110-2048x1153.jpg',
        '117-2048x1153.jpg'
      ];
      
      this.backgroundImages = bgGeoImages;
      this.geometryImages = bgGeoImages;
      this.profileImages = profileImages;
      
      console.log(`RANDOMIZER: Using fallback - ${bgGeoImages.length} bg-geo images, ${profileImages.length} profile images`);
    }
  
    /**
     * Apply randomization with optimized color extraction
     */
    async applyRandomization() {
      const root = document.documentElement;
      
      // Get images from session cache or generate new ones
      const availableImages = {
        background: this.backgroundImages,
        geometry: this.geometryImages,
        profile: this.profileImages
      };
      
      const selected = sessionCache.getSessionImages(availableImages);
      
      const selectedBgImage = selected.background;
      const selectedGeoImage = selected.geometry;
      const selectedProfileImage = selected.profile;
      
      const bgImagePath = `/assets/images/bg-geo/${selectedBgImage}`;
      const geoImagePath = `/assets/images/bg-geo/${selectedGeoImage}`;
      const profilePath = `/assets/images/profile/${selectedProfileImage}`;
      
      // Store selected images
      this.selectedImages = {
        background: bgImagePath,
        geometry: geoImagePath,
        profile: profilePath
      };
      
      // Apply images immediately
      root.style.setProperty('--bg-image', `url('${bgImagePath}')`);
      root.style.setProperty('--geometry-texture', `url('${geoImagePath}')`);
      
      console.log(`RANDOMIZER: Setting background: ${bgImagePath}, geometry: ${geoImagePath}`);
      
      // Apply profile image
      const profileImg = document.querySelector('.profile-image');
      if (profileImg) {
        profileImg.src = profilePath;
        console.log(`RANDOMIZER: Setting profile image: ${profilePath}`);
      }
      
      // Generate random shapes immediately
      this.randomizeShapes();
      
      // Try to use cached color first
      const cachedColor = imagePreloader.getCachedColor(bgImagePath);
      if (cachedColor) {
        console.log(`RANDOMIZER: Using cached color for ${bgImagePath}`);
        this.applyColorScheme(cachedColor.baseColor, cachedColor.variations);
      } else {
        // Extract color in background
        this.extractAndApplyColor(bgImagePath);
      }
    }
    
    /**
     * Extract and apply color asynchronously
     */
    async extractAndApplyColor(imagePath) {
      console.log(`RANDOMIZER: Extracting color from ${imagePath}`);
      
      try {
        // Use a temporary default while extracting
        const tempColor = '#808080';
        document.documentElement.style.setProperty('--accent-color', tempColor);
        const tempVariations = ColorUtils.generateVariations(tempColor);
        this.applyColorVariations(tempVariations);
        
        // Extract color
        const baseColor = await ColorUtils.extractDominantColor(imagePath);
        const colorVariations = ColorUtils.generateVariations(baseColor);
        
        // Cache for future use
        imagePreloader.colorCache.set(imagePath, {
          baseColor: baseColor,
          variations: colorVariations
        });
        
        // Save to localStorage
        imagePreloader.saveCacheToStorage();
        
        // Apply the extracted color
        this.applyColorScheme(baseColor, colorVariations);
        
      } catch (error) {
        console.error('RANDOMIZER: Error extracting color:', error);
        const fallbackColor = '#808080';
        document.documentElement.style.setProperty('--accent-color', fallbackColor);
        this.applyColorVariations(ColorUtils.generateVariations(fallbackColor));
      }
    }
    
    /**
     * Apply color scheme
     */
    applyColorScheme(baseColor, variations) {
      document.documentElement.style.setProperty('--accent-color', baseColor);
      console.log(`RANDOMIZER: Applied accent color ${baseColor}`);
      this.applyColorVariations(variations);
    }
  
    /**
     * Randomize shape dimensions and positions
     */
    randomizeShapes() {
      const root = document.documentElement;
  
      // H2 decoration - varied rectangles with different animations  
      setTimeout(() => {
        const h2Elements = document.querySelectorAll('h2');
        h2Elements.forEach((h2) => {
          const dimensions = ShapeUtils.getRandomDimensions({
            minWidth: 200, maxWidth: 400,
            minHeight: 15, maxHeight: 30
          });
          const h2Animations = ['fadeInLeft', 'fadeInRight', 'fadeInUp', 'fadeInDown', 'fadeIn'];
          const animation = h2Animations[Math.floor(Math.random() * h2Animations.length)];
          const offsetX = Math.floor(Math.random() * 60) - 30;
          h2.style.setProperty('--shape-width', `${dimensions.width}px`);
          h2.style.setProperty('--shape-height', `${dimensions.height}px`);
          h2.style.setProperty('--h2-animation', animation);
          h2.style.setProperty('--h2-offset', `${offsetX}px`);
        });
      }, 100);
  
      // Metadata items - individual decorations
      const metadataItems = document.querySelectorAll('.metadata dd');
      metadataItems.forEach((item) => {
        const width = Math.floor(Math.random() * 120) + 150;
        const offsetX = Math.floor(Math.random() * 40) - 20;
        item.style.setProperty('--shape-width', `${width}px`);
        item.style.setProperty('--shape-offset', `${offsetX}px`);
      });
  
      // Profile decoration
      const shapes = ['square', 'circle', 'triangle'];
      const selectedShape = shapes[Math.floor(Math.random() * shapes.length)];
      const profileShape = ShapeUtils.profileShapes[selectedShape];
      const profileRotation = Math.floor(Math.random() * 45);
      
      if (selectedShape === 'circle') {
        root.style.setProperty('--profile-radius', '50%');
        root.style.removeProperty('--profile-shape');
      } else {
        root.style.setProperty('--profile-shape', profileShape);
        root.style.setProperty('--profile-radius', '0');
      }
      
      root.style.setProperty('--profile-rotation', `${profileRotation}deg`);
    }
    
    /**
     * Apply color variations to elements
     */
    applyColorVariations(colorVariations) {
      // Store color variations for later use
      this.colorVariations = colorVariations;
      const colorArray = Object.values(colorVariations);
      console.log('RANDOMIZER: Applying color variations to elements:', colorArray);
      
      // Find the darkest color for title cell
      let darkestColor = colorArray[0];
      let lowestLuminance = 999999;
      
      colorArray.forEach(color => {
        let r, g, b;
        
        if (color.startsWith('#')) {
          r = parseInt(color.substr(1,2), 16);
          g = parseInt(color.substr(3,2), 16);
          b = parseInt(color.substr(5,2), 16);
        } else if (color.startsWith('rgb')) {
          const match = color.match(/\d+/g);
          r = parseInt(match[0]);
          g = parseInt(match[1]);
          b = parseInt(match[2]);
        }
        
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
        
        if (luminance < lowestLuminance) {
          lowestLuminance = luminance;
          darkestColor = color;
        }
      });
      
      // Apply darkest color to title cell
      const titleCell = document.querySelector('.title-cell');
      if (titleCell) {
        let r, g, b;
        
        if (darkestColor.startsWith('#')) {
          r = parseInt(darkestColor.substr(1,2), 16);
          g = parseInt(darkestColor.substr(3,2), 16);
          b = parseInt(darkestColor.substr(5,2), 16);
        } else if (darkestColor.startsWith('rgb')) {
          const match = darkestColor.match(/\d+/g);
          r = parseInt(match[0]);
          g = parseInt(match[1]);
          b = parseInt(match[2]);
        }
        
        titleCell.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
      }
      
      // Apply random colors to decorations with minimal delay
      setTimeout(() => {
        // Add title decoration shape
        const titleCell = document.querySelector('.title-cell');
        if (titleCell) {
          const existingDecoration = titleCell.querySelector('.title-decoration');
          if (existingDecoration) {
            existingDecoration.remove();
          }
          
          // Find lightest color for title decoration
          let lightestColor = colorArray[0];
          let highestLuminance = 0;
          
          colorArray.forEach(color => {
            let r, g, b;
            if (color.startsWith('#')) {
              r = parseInt(color.substr(1,2), 16);
              g = parseInt(color.substr(3,2), 16);
              b = parseInt(color.substr(5,2), 16);
            } else if (color.startsWith('rgb')) {
              const match = color.match(/\d+/g);
              r = parseInt(match[0]);
              g = parseInt(match[1]);
              b = parseInt(match[2]);
            }
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
            if (luminance > highestLuminance) {
              highestLuminance = luminance;
              lightestColor = color;
            }
          });
          
          // Create decoration element
          const decoration = document.createElement('div');
          decoration.className = 'title-decoration';
          decoration.style.position = 'absolute';
          decoration.style.backgroundColor = lightestColor;
          decoration.style.opacity = '0.8';
          
          const width = Math.floor(Math.random() * 150) + 100;
          const height = Math.floor(Math.random() * 40) + 30;
          const left = Math.floor(Math.random() * 60) + 20;
          const top = Math.floor(Math.random() * 40) + 30;
          
          decoration.style.width = `${width}px`;
          decoration.style.height = `${height}px`;
          decoration.style.left = `${left}%`;
          decoration.style.top = `${top}%`;
          decoration.style.zIndex = '1';
          decoration.style.transform = `translateX(-50%) rotate(${Math.random() * 10 - 5}deg)`;
          
          titleCell.appendChild(decoration);
        }
        
        // Apply colors to other elements
        document.querySelectorAll('h2').forEach((h2) => {
          const color = colorArray[Math.floor(Math.random() * colorArray.length)];
          h2.style.setProperty('--decoration-color', color);
        });
        
        document.querySelectorAll('.metadata dd').forEach((dd) => {
          const color = colorArray[Math.floor(Math.random() * colorArray.length)];
          dd.style.setProperty('--decoration-color', color);
        });
      }, 50); // Reduced delay
      
      // Profile decoration color
      const profileColor = colorArray[Math.floor(Math.random() * colorArray.length)];
      document.documentElement.style.setProperty('--profile-decoration-color', profileColor);
    }

    /**
     * Apply fallback randomization
     */
    applyFallbackRandomization() {
      const root = document.documentElement;
      root.style.setProperty('--bg-image', "url('/assets/images/bg-geo/r001-004.jpg')");
      root.style.setProperty('--accent-color', '#808080');
      this.randomizeShapes();
      
      const profileImg = document.querySelector('.profile-image');
      if (profileImg) {
        profileImg.src = '/assets/images/profile/110-2048x1153.jpg';
      }
    }
  
    /**
     * Randomize H2 elements only (for dynamic content)
     */
    randomizeH2Elements() {
      const h2Animations = ['fadeInLeft', 'fadeInRight', 'fadeInUp', 'fadeInDown', 'fadeIn'];
      const h2Elements = document.querySelectorAll('h2');
      
      h2Elements.forEach((h2) => {
        const dimensions = ShapeUtils.getRandomDimensions({
          minWidth: 200, maxWidth: 400,
          minHeight: 15, maxHeight: 30
        });
        const animation = h2Animations[Math.floor(Math.random() * h2Animations.length)];
        const offsetX = Math.floor(Math.random() * 60) - 30;
        h2.style.setProperty('--shape-width', `${dimensions.width}px`);
        h2.style.setProperty('--shape-height', `${dimensions.height}px`);
        h2.style.setProperty('--h2-animation', animation);
        h2.style.setProperty('--h2-offset', `${offsetX}px`);
        
        if (this.colorVariations) {
          const colorArray = Object.values(this.colorVariations);
          const color = colorArray[Math.floor(Math.random() * colorArray.length)];
          h2.style.setProperty('--decoration-color', color);
        }
      });
    }

    /**
     * Force new randomization
     */
    forceNewRandomization() {
      console.log('RANDOMIZER: Forcing new randomization');
      // Clear session cache to force new images
      sessionCache.clearSession();
      this.clearExistingStyles();
      setTimeout(() => {
        this.applyRandomization();
      }, 50);
    }
    
    /**
     * Clear existing custom styles
     */
    clearExistingStyles() {
      document.querySelectorAll('h2').forEach(h2 => {
        h2.style.removeProperty('--shape-width');
        h2.style.removeProperty('--shape-height');
        h2.style.removeProperty('--h2-animation');
        h2.style.removeProperty('--h2-offset');
        h2.style.removeProperty('--decoration-color');
      });
      
      document.querySelectorAll('.metadata dd').forEach(dd => {
        dd.style.removeProperty('--shape-width');
        dd.style.removeProperty('--shape-offset');
        dd.style.removeProperty('--decoration-color');
      });
    }
  }
  
  // Create global instance
  window.jorgevsRandomizer = new JorgeVSRandomizer();
  
  // Export for module use
  export default window.jorgevsRandomizer;