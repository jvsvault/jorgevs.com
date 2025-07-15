/**
 * Fast Randomization System
 * Applies randomization instantly without delays
 */

import { ColorUtils } from './utils/color-utils.js';
import { ShapeUtils } from './utils/shape-utils.js';
import backgroundCache from './background-cache.js';

class FastRandomizer {
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
      console.log('FAST RANDOMIZER: Initializing');
  
      try {
        // Load images first
        await this.loadAvailableImages();
        
        // Apply randomization immediately - no delays
        await this.applyInstantRandomization();
        
        // Start preloading all images in background
        this.preloadAllImagesInBackground();
        
        this.isInitialized = true;
        console.log('FAST RANDOMIZER: Initialization complete');
      } catch (error) {
        console.error('FAST RANDOMIZER: Initialization failed:', error);
        this.applyFallbackRandomization();
      }
    }
    
    /**
     * Preload all images in background
     */
    async preloadAllImagesInBackground() {
      if (this.backgroundImages.length > 0) {
        // Don't await - let it run in background
        backgroundCache.preloadAllInBackground(this.backgroundImages, this.geometryImages)
          .catch(err => console.error('Background preload error:', err));
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
          console.log(`FAST RANDOMIZER: Loaded ${this.backgroundImages.length} bg-geo, ${this.profileImages.length} profile images`);
          return;
        }
      } catch (error) {
        console.log('FAST RANDOMIZER: API not available, using fallback');
      }
      
      // Fallback - hardcoded list of images for when API is not available (e.g., GitHub Pages)
      this.backgroundImages = [
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
      this.geometryImages = this.backgroundImages; // Same images for both
      this.profileImages = [
        '036_BW-2048x1152.jpg',
        '051-2048x1154.jpg',
        '060-2048x1154.jpg',
        '064-2048x1154.jpg',
        '110-2048x1153.jpg',
        '117-2048x1153.jpg'
      ];
    }
  
    /**
     * Apply randomization instantly
     */
    async applyInstantRandomization() {
      const root = document.documentElement;
      
      // Check if we have images
      if (this.backgroundImages.length === 0) {
        console.error('FAST RANDOMIZER: No images loaded');
        return;
      }
      
      // Check for stored selection (to prevent flash on refresh)
      const stored = sessionStorage.getItem('jvs_current_images');
      let selectedBgImage, selectedGeoImage, selectedProfileImage;
      
      if (stored && !this._forceNew) {
        // Use stored images on refresh
        const data = JSON.parse(stored);
        selectedBgImage = data.bg;
        selectedGeoImage = data.geo;
        selectedProfileImage = data.profile;
        console.log('FAST RANDOMIZER: Using stored images to prevent flash');
      } else {
        // Select new random images
        const bgIndex = Math.floor(Math.random() * this.backgroundImages.length);
        const geoIndex = Math.floor(Math.random() * this.geometryImages.length);
        const profileIndex = Math.floor(Math.random() * this.profileImages.length);
        
        selectedBgImage = this.backgroundImages[bgIndex];
        selectedGeoImage = this.geometryImages[geoIndex];
        selectedProfileImage = this.profileImages[profileIndex];
        
        // Store for next refresh
        sessionStorage.setItem('jvs_current_images', JSON.stringify({
          bg: selectedBgImage,
          geo: selectedGeoImage,
          profile: selectedProfileImage
        }));
      }
      
      this._forceNew = false; // Reset flag
      
      // Encode filenames to handle spaces and special characters
      const bgImagePath = `/assets/images/bg-geo/${encodeURIComponent(selectedBgImage)}`;
      const geoImagePath = `/assets/images/bg-geo/${encodeURIComponent(selectedGeoImage)}`;
      const profilePath = `/assets/images/profile/${encodeURIComponent(selectedProfileImage)}`;
      
      // Preload images before applying
      try {
        await Promise.all([
          backgroundCache.preloadImage(bgImagePath),
          backgroundCache.preloadImage(geoImagePath)
        ]);
        
        // Apply cached images - should be instant
        backgroundCache.applyImages(bgImagePath, geoImagePath);
        console.log('FAST RANDOMIZER: Applied cached images');
      } catch (error) {
        console.error('FAST RANDOMIZER: Error preloading images:', error);
        // Apply anyway and hope for the best
        root.style.setProperty('--bg-image', `url('${bgImagePath}')`);
        root.style.setProperty('--geometry-texture', `url('${geoImagePath}')`);
      }
      
      // Update profile image
      const profileImg = document.querySelector('.profile-image');
      if (profileImg) {
        profileImg.src = profilePath;
      }
      
      console.log(`FAST RANDOMIZER: Applied bg: ${selectedBgImage}, geo: ${selectedGeoImage}, profile: ${selectedProfileImage}`);
      
      // Randomize shapes immediately
      this.randomizeShapes();
      
      // Extract and set colors asynchronously (won't block visual update)
      this.extractAndApplyColors(bgImagePath);
    }
  
    /**
     * Randomize shape dimensions instantly
     */
    randomizeShapes() {
      const root = document.documentElement;
  
      // Metadata items
      document.querySelectorAll('.metadata dd').forEach((item) => {
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
      
      // H2 elements - check if they exist first
      const h2Elements = document.querySelectorAll('h2');
      if (h2Elements.length > 0) {
        this.randomizeH2Elements();
      } else {
        // If no h2s yet, wait a bit and try again
        setTimeout(() => this.randomizeH2Elements(), 100);
      }
    }
  
    /**
     * Randomize H2 elements
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
     * Extract and apply colors (async, non-blocking)
     */
    async extractAndApplyColors(imagePath) {
      try {
        // Apply a temporary color immediately
        const tempColor = '#808080';
        document.documentElement.style.setProperty('--accent-color', tempColor);
        
        // Extract actual color
        const baseColor = await ColorUtils.extractDominantColor(imagePath);
        const colorVariations = ColorUtils.generateVariations(baseColor);
        
        // Apply the extracted colors
        document.documentElement.style.setProperty('--accent-color', baseColor);
        this.applyColorVariations(colorVariations);
        
      } catch (error) {
        console.error('FAST RANDOMIZER: Color extraction failed:', error);
        // Keep the temporary color
      }
    }
    
    /**
     * Apply color variations
     */
    applyColorVariations(colorVariations) {
      this.colorVariations = colorVariations;
      const colorArray = Object.values(colorVariations);
      
      // Find darkest color for title cell
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
      
      // Apply to title cell
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
      
      // Add title decoration
      setTimeout(() => {
        const titleCell = document.querySelector('.title-cell');
        if (titleCell) {
          const existingDecoration = titleCell.querySelector('.title-decoration');
          if (existingDecoration) {
            existingDecoration.remove();
          }
          
          // Find lightest color
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
        
        // Apply to other elements
        document.querySelectorAll('h2').forEach((h2) => {
          const color = colorArray[Math.floor(Math.random() * colorArray.length)];
          h2.style.setProperty('--decoration-color', color);
        });
        
        document.querySelectorAll('.metadata dd').forEach((dd) => {
          const color = colorArray[Math.floor(Math.random() * colorArray.length)];
          dd.style.setProperty('--decoration-color', color);
        });
      }, 50);
      
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
     * Apply randomization (alias for compatibility)
     */
    applyRandomization() {
      this.applyInstantRandomization();
    }

    /**
     * Force new randomization
     */
    forceNewRandomization() {
      console.log('FAST RANDOMIZER: Forcing new randomization');
      this.clearExistingStyles();
      // No delay - apply immediately
      this.applyInstantRandomization();
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
  window.jorgevsRandomizer = new FastRandomizer();
  
  // Export for module use
  export default window.jorgevsRandomizer;