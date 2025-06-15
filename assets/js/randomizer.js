/**
 * Unified Randomization System - Clean Architecture
 * Sets data attributes for CSS to consume - no inline styles
 */

import { ColorUtils } from './utils/color-utils.js';
import { ShapeUtils } from './utils/shape-utils.js';
// import { detectAllImages } from './auto-image-detector.js';

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
        this.applyRandomization();
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
        console.log('RANDOMIZER: API not available');
      }
      
      // Fallback list - hardcoded image names
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
     */
    applyRandomization() {
      const root = document.documentElement;
      
      // Select ONE random image for both background and color extraction
      const bgIndex = Math.floor(Math.random() * this.backgroundImages.length);
      
      // Use the SAME image for both background and color extraction
      const selectedImage = this.backgroundImages[bgIndex];
      const imagePath = `/assets/images/bg-geo/${selectedImage}`;
      
      root.style.setProperty('--bg-image', `url('${imagePath}')`);
      
      console.log(`RANDOMIZER: Setting background and extracting colors from: ${imagePath}`);
      
      // Verify background image loads
      const testImg = new Image();
      testImg.onerror = () => {
        console.error(`RANDOMIZER: Failed to load background: ${imagePath}`);
        // Set a solid fallback color instead of trying another image
        root.style.setProperty('--bg-image', 'none');
        root.style.setProperty('background-color', '#1a1a1a');
        console.log(`RANDOMIZER: Using solid color fallback`);
      };
      testImg.src = imagePath;
      
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
      
      // Extract and set accent color from the SAME background image
      this.setAccentColor(imagePath);
      
      console.log(`RANDOMIZER: Applied background and color extraction from ${selectedImage}`);
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
      
      // Set random side for title decoration
      const titleSide = Math.random() < 0.5 ? 'left' : 'right';
      const h1 = document.querySelector('.title-container h1');
      if (h1) {
        h1.setAttribute('data-decoration-side', titleSide);
      }
  
      // H2 decoration - varied rectangles with different animations  
      const h2Animations = ['fadeInLeft', 'fadeInRight', 'fadeInUp', 'fadeInDown', 'fadeIn'];
      
      // Wait for h2 elements to exist
      setTimeout(() => {
        const h2Elements = document.querySelectorAll('h2');
        h2Elements.forEach((h2) => {
          const dimensions = ShapeUtils.getRandomDimensions({
            minWidth: 200, maxWidth: 400,
            minHeight: 15, maxHeight: 30
          });
          // Random animation for each h2
          const animation = h2Animations[Math.floor(Math.random() * h2Animations.length)];
          const offsetX = Math.floor(Math.random() * 60) - 30; // -30 to 30px horizontal variation
          h2.style.setProperty('--shape-width', `${dimensions.width}px`);
          h2.style.setProperty('--shape-height', `${dimensions.height}px`);
          h2.style.setProperty('--h2-animation', animation);
          h2.style.setProperty('--h2-offset', `${offsetX}px`);
          console.log(`H2 "${h2.textContent}" animation: ${animation}, width: ${dimensions.width}px, offset: ${offsetX}px`);
        });
      }, 100);
  
      // Metadata items - individual decorations with variations
      const ddAnimations = ['fadeInLeft', 'fadeInRight', 'fadeIn'];
      const metadataItems = document.querySelectorAll('.metadata dd');
      metadataItems.forEach((item) => {
        const width = Math.floor(Math.random() * 120) + 150; // 150-270px (longer shapes)
        const offsetX = Math.floor(Math.random() * 40) - 20; // -20 to 20px (more variation)
        const animation = ddAnimations[Math.floor(Math.random() * ddAnimations.length)];
        item.style.setProperty('--shape-width', `${width}px`);
        item.style.setProperty('--shape-offset', `${offsetX}px`);
        item.style.setProperty('--dd-animation', animation);
      });
  
      // Profile decoration - varied frame shapes and sizes
      const shapes = ['square', 'circle', 'triangle'];
      const selectedShape = shapes[Math.floor(Math.random() * shapes.length)];
      const profileShape = ShapeUtils.profileShapes[selectedShape];
      const profileFrameWidth = Math.floor(Math.random() * 20) + 105; // 105-125% (smaller range)
      const profileFrameHeight = Math.floor(Math.random() * 20) + 105; // 105-125% (smaller range)
      const profileRotation = Math.floor(Math.random() * 45); // 0-45 degrees initial rotation
      
      // Use border-radius for circle, clip-path for others
      if (selectedShape === 'circle') {
        root.style.setProperty('--profile-radius', '50%');
        root.style.removeProperty('--profile-shape');
      } else {
        root.style.setProperty('--profile-shape', profileShape);
        root.style.setProperty('--profile-radius', '0');
      }
      
      root.style.setProperty('--profile-frame-width', `${profileFrameWidth}%`);
      root.style.setProperty('--profile-frame-height', `${profileFrameHeight}%`);
      root.style.setProperty('--profile-rotation', `${profileRotation}deg`);
    }
  
    /**
     * Generate color variations from base accent color
     */
    generateColorVariations(baseColor) {
      return ColorUtils.generateVariations(baseColor);
    }

    /**
     * Extract and set accent color
     */
    async setAccentColor(imagePath) {
      console.log(`RANDOMIZER: Starting color extraction from ${imagePath}`);
      try {
        const baseColor = await this.extractDominantColor(imagePath);
        console.log(`RANDOMIZER: Extracted base color: ${baseColor}`);
        
        const colorVariations = this.generateColorVariations(baseColor);
        console.log('RANDOMIZER: Generated color variations:', colorVariations);
        
        // Set base accent color
        document.documentElement.style.setProperty('--accent-color', baseColor);
        console.log(`RANDOMIZER: Set accent color to ${baseColor}`);
        
        // Apply color variations to different elements
        this.applyColorVariations(colorVariations);
      } catch (error) {
        console.error('RANDOMIZER: Error extracting color:', error);
        const fallbackColor = '#808080';
        document.documentElement.style.setProperty('--accent-color', fallbackColor);
        this.applyColorVariations(this.generateColorVariations(fallbackColor));
      }
    }
    
    /**
     * Apply color variations to elements
     */
    applyColorVariations(colorVariations) {
      // Store color variations for later use
      this.colorVariations = colorVariations;
      const colorArray = Object.values(colorVariations);
      console.log('RANDOMIZER: Applying color variations to elements:', colorArray);
      
      // Apply random colors to decorations after a delay to ensure elements exist
      setTimeout(() => {
        // H2 decorations
        document.querySelectorAll('h2').forEach((h2, index) => {
          const color = colorArray[Math.floor(Math.random() * colorArray.length)];
          h2.style.setProperty('--decoration-color', color);
          console.log(`RANDOMIZER: Applied color ${color} to H2 #${index}: "${h2.textContent}"`);
        });
        
        // Metadata decorations
        document.querySelectorAll('.metadata dd').forEach((dd, index) => {
          const color = colorArray[Math.floor(Math.random() * colorArray.length)];
          dd.style.setProperty('--decoration-color', color);
          console.log(`RANDOMIZER: Applied color ${color} to metadata dd #${index}`);
        });
      }, 200);
      
      // Profile decoration gets a random color too
      const profileColor = colorArray[Math.floor(Math.random() * colorArray.length)];
      document.documentElement.style.setProperty('--profile-decoration-color', profileColor);
      console.log(`RANDOMIZER: Applied profile decoration color: ${profileColor}`);
    }
  
    /**
     * Extract dominant color from image
     */
    extractDominantColor(imagePath) {
      return ColorUtils.extractDominantColor(imagePath);
    }
  
    /**
     * Apply fallback randomization
     */
    applyFallbackRandomization() {
      const root = document.documentElement;
      root.style.setProperty('--bg-image', "url('/assets/images/bg-geo/r001-004.jpg')");
      root.style.setProperty('--accent-color', '#808080');
      this.randomizeShapes();
      
      // Set fallback profile image
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
        // Random animation for each h2
        const animation = h2Animations[Math.floor(Math.random() * h2Animations.length)];
        const offsetX = Math.floor(Math.random() * 60) - 30; // -30 to 30px horizontal variation
        h2.style.setProperty('--shape-width', `${dimensions.width}px`);
        h2.style.setProperty('--shape-height', `${dimensions.height}px`);
        h2.style.setProperty('--h2-animation', animation);
        h2.style.setProperty('--h2-offset', `${offsetX}px`);
        
        // Also randomize color
        if (this.colorVariations) {
          const colorArray = Object.values(this.colorVariations);
          const color = colorArray[Math.floor(Math.random() * colorArray.length)];
          h2.style.setProperty('--decoration-color', color);
        }
        
        console.log(`H2 "${h2.textContent}" animation: ${animation}, width: ${dimensions.width}px`);
      });
    }

    /**
     * Force new randomization
     */
    forceNewRandomization() {
      console.log('RANDOMIZER: Forcing new randomization');
      // Clear any existing styles to ensure fresh application
      this.clearExistingStyles();
      // Small delay to ensure DOM updates
      setTimeout(() => {
        this.applyRandomization();
      }, 50);
    }
    
    /**
     * Clear existing custom styles
     */
    clearExistingStyles() {
      // Clear element-specific styles
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