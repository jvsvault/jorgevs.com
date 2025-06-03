/**
 * Unified Randomization System - Clean Architecture
 * Sets data attributes for CSS to consume - no inline styles
 */

import { ColorUtils } from './utils/color-utils.js';
import { ShapeUtils } from './utils/shape-utils.js';

class JorgeVSRandomizer {
    constructor() {
      this.backgroundImages = [];
      this.geometryImages = [];
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
      try {
        // Try to fetch from API first
        const response = await fetch('/api/images');
        if (response.ok) {
          const data = await response.json();
          this.backgroundImages = data.background;
          this.geometryImages = data.geometry;
          console.log(`RANDOMIZER: Dynamically loaded ${this.backgroundImages.length} backgrounds, ${this.geometryImages.length} geometry images`);
          return;
        }
      } catch (error) {
        console.log('RANDOMIZER: API not available, using fallback');
      }
      
      // Fallback to known images - include both JPG and PNG
      this.backgroundImages = [
        '01.jpg', '01 2.jpg', '06.jpg', '07.jpg', '09.jpg',
        '2e9ea32e-9a95-4c1e-bb05-e730465e0f19.png',
        '352b7503-9023-456e-90f2-69875a0d3820.png',
        '92a9cf41-11b4-436d-8e2e-dc1f83c08c39.png',
        'd004a045-43b1-4c5c-abb5-7032dd10d395.png',
        'e4d523a1-2a0e-4189-a7c3-341144c7a491.png'
      ];
  
      this.geometryImages = [
        '01.jpg', '02.jpg', '03.jpg', '03 copia.jpg', '05.jpg', '07.jpg',
        '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg',
        '0f6255a0-b8cf-4c9d-b12a-0708b288f847.png',
        '1aacc4eb-7ef1-453f-a88f-a98b089364c2.png',
        '7319fe29-2b49-43db-9c96-7ea78e2a82fb (1).png',
        'b52b84d6-d2e6-4537-8672-462d3d7c8fbc.png',
        'f0cd9415-0daa-465f-9ae9-08dd2011a9ed.png'
      ];
  
      console.log(`RANDOMIZER: Using fallback - ${this.backgroundImages.length} backgrounds, ${this.geometryImages.length} geometry images`);
    }
  
    /**
     * Apply randomization via CSS custom properties
     */
    applyRandomization() {
      const root = document.documentElement;
      
      // Select random images
      const bgIndex = Math.floor(Math.random() * this.backgroundImages.length);
      const geoIndex = Math.floor(Math.random() * this.geometryImages.length);
      
      // Set image paths as CSS custom properties
      const bgPath = `/assets/images/background/${this.backgroundImages[bgIndex]}`;
      const geoPath = `/assets/images/geometry/${this.geometryImages[geoIndex]}`;
      
      root.style.setProperty('--bg-image', `url('${bgPath}')`);
      root.style.setProperty('--geometry-texture', `url('${geoPath}')`);
      
      console.log(`RANDOMIZER: Setting background: ${bgPath}`);
      console.log(`RANDOMIZER: Setting geometry: ${geoPath}`);
      
      // Generate random values for shapes
      this.randomizeShapes();
      
      // Extract and set accent color
      this.setAccentColor(geoPath);
      
      console.log(`RANDOMIZER: Applied background ${this.backgroundImages[bgIndex]}, geometry ${this.geometryImages[geoIndex]}`);
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
      try {
        const baseColor = await this.extractDominantColor(imagePath);
        const colorVariations = this.generateColorVariations(baseColor);
        
        // Set base accent color
        document.documentElement.style.setProperty('--accent-color', baseColor);
        
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
      
      // Apply random colors to decorations after a delay to ensure elements exist
      setTimeout(() => {
        // H2 decorations
        document.querySelectorAll('h2').forEach((h2) => {
          const color = colorArray[Math.floor(Math.random() * colorArray.length)];
          h2.style.setProperty('--decoration-color', color);
        });
        
        // Metadata decorations
        document.querySelectorAll('.metadata dd').forEach((dd) => {
          const color = colorArray[Math.floor(Math.random() * colorArray.length)];
          dd.style.setProperty('--decoration-color', color);
        });
      }, 200);
      
      // Profile decoration gets a random color too
      const profileColor = colorArray[Math.floor(Math.random() * colorArray.length)];
      document.documentElement.style.setProperty('--profile-decoration-color', profileColor);
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
      root.style.setProperty('--bg-image', "url('/assets/images/background/01.jpg')");
      root.style.setProperty('--geometry-texture', "url('/assets/images/geometry/01.jpg')");
      root.style.setProperty('--accent-color', '#808080');
      this.randomizeShapes();
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