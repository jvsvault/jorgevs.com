/**
 * Unified Randomization System - Fixed Version
 * Sets data attributes for CSS to consume - no inline styles
 */

import { ColorUtils } from './utils/color-utils.js';
import { ShapeUtils } from './utils/shape-utils.js';

class JorgeVSRandomizer {
    constructor() {
      this.backgroundImages = [];
      this.geometryImages = [];
      this.profileImages = [];
      this.isInitialized = false;
      this.colorVariations = null;
    }
  
    /**
     * Initialize the randomizer
     */
    async initialize() {
      console.log('RANDOMIZER: Initializing');
  
      try {
        await this.loadAvailableImages();
        await this.applyRandomization(); // Made async to properly handle image validation
        this.isInitialized = true;
        console.log('RANDOMIZER: Initialization complete');
      } catch (error) {
        console.error('RANDOMIZER: Initialization failed:', error);
        this.applyFallbackRandomization();
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
          // bg-geo images are used for both background and geometry textures
          this.backgroundImages = data.bgGeo || [];
          this.geometryImages = data.bgGeo || [];
          this.profileImages = data.profile || [];
          console.log(`RANDOMIZER: API loaded ${this.backgroundImages.length} bg-geo images, ${this.profileImages.length} profile images`);
          return;
        }
      } catch (error) {
        console.log('RANDOMIZER: API not available, using fallback');
      }
      
      // Fallback list - hardcoded image names
      // Fixed: Use lowercase extensions for consistency
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
      
      // Use bg-geo images for both background and geometry
      this.backgroundImages = bgGeoImages;
      this.geometryImages = bgGeoImages;
      this.profileImages = profileImages;
      
      console.log(`RANDOMIZER: Using fallback - ${bgGeoImages.length} bg-geo images, ${profileImages.length} profile images`);
    }
  
    /**
     * Apply randomization via CSS custom properties
     * Fixed: Better error handling for image loading
     */
    async applyRandomization() {
      const root = document.documentElement;
      
      // Try to set a background image that actually loads
      let backgroundSet = false;
      const shuffledImages = [...this.backgroundImages].sort(() => Math.random() - 0.5);
      
      for (const imageName of shuffledImages) {
        const imagePath = `/assets/images/bg-geo/${imageName}`;
        
        // Test if image loads before setting it
        const imageLoads = await this.testImageLoad(imagePath);
        
        if (imageLoads) {
          root.style.setProperty('--bg-image', `url('${imagePath}')`);
          console.log(`RANDOMIZER: Successfully set background: ${imagePath}`);
          backgroundSet = true;
          
          // Extract and set accent color from this image
          this.setAccentColor(imagePath);
          break;
        } else {
          console.warn(`RANDOMIZER: Image failed to load: ${imagePath}`);
        }
      }
      
      // If no images loaded, use a nice gradient fallback instead of solid black
      if (!backgroundSet) {
        console.warn('RANDOMIZER: No background images could be loaded, using gradient fallback');
        root.style.setProperty('--bg-image', 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)');
      }
      
      // Randomize profile image
      if (this.profileImages.length > 0) {
        const profileIndex = Math.floor(Math.random() * this.profileImages.length);
        const profilePath = `/assets/images/profile/${this.profileImages[profileIndex]}`;
        const profileImg = document.querySelector('.profile-image');
        if (profileImg) {
          profileImg.src = profilePath;
          console.log(`RANDOMIZER: Setting profile image: ${profilePath}`);
        }
      }
      
      // Generate random values for shapes
      this.randomizeShapes();
    }
    
    /**
     * Test if an image loads successfully
     */
    async testImageLoad(src) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
      });
    }
  
    /**
     * Randomize shape dimensions and positions
     */
    randomizeShapes() {
      const root = document.documentElement;
  
      // Title decoration - random size AND animation
      const titleAnimations = ['fadeIn', 'fadeInUp', 'fadeInDown', 'fadeInLeft', 'fadeInRight'];
      const titleAnimation = titleAnimations[Math.floor(Math.random() * titleAnimations.length)];
      const titleWidth = Math.floor(Math.random() * 100) + 180; // 180-280px (longer but contained)
      const titleHeight = Math.floor(Math.random() * 40) + 50; // 50-90px (varied sizes)
      
      root.style.setProperty('--title-width', `${titleWidth}px`);
      root.style.setProperty('--title-height', `${titleHeight}px`);
      root.style.setProperty('--title-animation', titleAnimation);
      
      // Title position - random side and offset
      const titleSide = Math.random() > 0.5 ? 'left' : 'right';
      const titleOffset = Math.floor(Math.random() * 30) + 10; // 10-40px
      
      root.style.setProperty('--title-side', titleSide);
      root.style.setProperty('--title-offset', `${titleOffset}px`);
      
      // Profile shape - fully random using custom generator
      const profileShape = ShapeUtils.generateRandomShape();
      const profileRotation = Math.floor(Math.random() * 360); // 0-360 degrees
      
      root.style.setProperty('--profile-shape', profileShape);
      root.style.setProperty('--profile-rotation', `${profileRotation}deg`);
      
      console.log(`RANDOMIZER: Set shapes - Title: ${titleWidth}x${titleHeight}, ${titleSide}, Profile: ${profileRotation}deg`);
    }
  
    /**
     * Extract accent color from background image
     */
    async setAccentColor(imagePath) {
      try {
        // Skip color extraction if no valid image
        if (!imagePath || imagePath === 'none') {
          console.log('RANDOMIZER: No valid image for color extraction');
          return;
        }
        
        const colors = await ColorUtils.extractColors(imagePath);
        
        if (colors && colors.accent) {
          // Generate color variations
          this.colorVariations = ColorUtils.generateColorVariations(colors.accent);
          
          // Apply accent color and its variations
          const root = document.documentElement;
          root.style.setProperty('--accent-color', colors.accent);
          root.style.setProperty('--accent-light', this.colorVariations.light);
          root.style.setProperty('--accent-dark', this.colorVariations.dark);
          root.style.setProperty('--accent-muted', this.colorVariations.muted);
          
          console.log(`RANDOMIZER: Set accent color to ${colors.accent}`);
        }
      } catch (error) {
        console.error('RANDOMIZER: Error extracting colors:', error);
      }
    }
  
    /**
     * Apply fallback randomization when things go wrong
     */
    applyFallbackRandomization() {
      const root = document.documentElement;
      
      // Use a nice gradient instead of solid black
      root.style.setProperty('--bg-image', 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)');
      
      // Still randomize shapes
      this.randomizeShapes();
      
      // Set a default accent color
      root.style.setProperty('--accent-color', '#808080');
      
      console.log('RANDOMIZER: Applied fallback randomization');
    }
  }
  
  // Create and export singleton instance
  const randomizer = new JorgeVSRandomizer();
  export default randomizer;