/**
 * Jorge Viñals Website - Main Controller (SPA Version)
 * Much simpler now that we have a single page
 */

import randomizer from './randomizer.js';
import { initializeRotations } from './metadata-rotator.js';
import contentManager from './content-manager.js';

class JorgeVSMain {
  constructor() {
    this.isInitialized = false;
  }

  /**
   * Initialize the entire website
   */
  async init() {
    console.log('MAIN: Starting SPA initialization');

    try {
      // Step 1: Initialize randomization FIRST (before anything shows)
      await randomizer.initialize();
      
      // Step 2: Initialize content management system
      contentManager.init();
      
      // Step 3: Initialize metadata rotations
      await this.initializeRotations();
      
      // Step 4: Set up page-specific features
      this.initializePageFeatures();
      
      // Step 5: Show the page
      document.body.classList.add('loaded');
      
      this.isInitialized = true;
      console.log('MAIN: SPA initialization complete');
      
    } catch (error) {
      console.error('MAIN: Initialization failed:', error);
      // Still show the page even if something failed
      document.body.classList.add('loaded');
    }
  }

  /**
   * Initialize metadata rotations
   */
  async initializeRotations() {
    try {
      console.log('MAIN: Initializing metadata rotations');
      await initializeRotations();
      console.log('MAIN: Metadata rotations initialized');
    } catch (error) {
      console.error('MAIN: Error initializing rotations:', error);
    }
  }

  /**
   * Initialize page-specific features
   */
  initializePageFeatures() {
    console.log('MAIN: Initializing page-specific features');
    
    // Listen page player tabs (will be available when listen section loads)
    this.initializePlayerTabs();
    
    // Contact page mailing list form (will be available when contact section loads)
    this.initializeMailingForm();
  }

  /**
   * Initialize player tabs for listen page
   */
  initializePlayerTabs() {
    // Use event delegation since player tabs might be loaded dynamically
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('player-tab')) {
        const tab = e.target;
        
        // Remove active class from all tabs and containers
        document.querySelectorAll('.player-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.player-container').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Show corresponding player
        const playerId = tab.getAttribute('data-player');
        const playerContainer = document.getElementById(playerId);
        if (playerContainer) {
          playerContainer.classList.add('active');
        }
      }
    });
  }

  /**
   * Initialize mailing list form for contact page
   */
  initializeMailingForm() {
    // Use event delegation since form might be loaded dynamically
    document.addEventListener('click', (e) => {
      if (e.target.id === 'show-mailing-form') {
        const formContainer = document.getElementById('mailing-form-container');
        if (formContainer) {
          formContainer.style.display = 'flex';
          setTimeout(() => formContainer.classList.add('visible'), 10);
        }
      }
      
      if (e.target.id === 'close-mailing-form') {
        const formContainer = document.getElementById('mailing-form-container');
        if (formContainer) {
          formContainer.classList.remove('visible');
          setTimeout(() => formContainer.style.display = 'none', 300);
        }
      }
    });
    
    // Close form when clicking outside
    document.addEventListener('click', (e) => {
      if (e.target.id === 'mailing-form-container') {
        const closeButton = document.getElementById('close-mailing-form');
        if (closeButton) closeButton.click();
      }
    });
  }
}

// Initialize when DOM is ready
const main = new JorgeVSMain();

// Handle different loading states
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => main.init());
} else {
  // DOM already loaded
  main.init();
}

// Export for potential external use
export default main;