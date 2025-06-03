/**
 * Metadata Rotator - Clean Architecture
 * Simple rotation without fade effects
 */

import rotationConfig from './config/rotations.js';

// Current indices for each position
const currentIndices = {
  position1: 0,
  position2: 0,
  position3: 0,
  position4: 0
};

// Rotation interval in milliseconds
const interval = rotationConfig.interval || 5000;

/**
 * Initialize the rotation for a specific position
 */
function initializeRotation(position, items, initialDelay = 0) {
  // Get the DOM elements
  const getElements = () => {
    let titleElement, contentElement;
    
    // Try with position-specific classes first
    titleElement = document.querySelector(`.${position}-title`);
    contentElement = document.querySelector(`.${position}-item`);
    
    // Fall back to legacy class names if needed
    if (!titleElement || !contentElement) {
      if (position === 'position1') {
        titleElement = document.querySelector('.medium-title');
        contentElement = document.querySelector('.medium-item');
      } else if (position === 'position2') {
        titleElement = document.querySelector('.notation-title');
        contentElement = document.querySelector('.notation-item');
      } else if (position === 'position3') {
        titleElement = document.querySelector('.duration-title');
        contentElement = document.querySelector('.duration-item');
      } else if (position === 'position4') {
        titleElement = document.querySelector('.commissioned-title');
        contentElement = document.querySelector('.commissioned-item');
      }
    }
    
    return { titleElement, contentElement };
  };

  // Function to update the content
  const updateContent = () => {
    const { titleElement, contentElement } = getElements();
    
    if (!titleElement || !contentElement) {
      console.warn(`ROTATOR: Elements for ${position} not found`);
      return;
    }
    
    // Store current height to prevent layout shift
    const currentHeight = contentElement.offsetHeight;
    contentElement.style.minHeight = `${currentHeight}px`;
    
    // Get the current item
    const itemIndex = currentIndices[position];
    const item = items[itemIndex];
    
    // Direct update - no fade
    titleElement.textContent = item.title;
    contentElement.innerHTML = item.content;
    
    // NO ANIMATION UPDATES - decorations are set once at load
    
    // Log the update (for debugging)
    console.log(`ROTATOR: Updated ${position} to:`, item.title);
    
    // Increment the index for next rotation
    currentIndices[position] = (itemIndex + 1) % items.length;
  };
  
  // Initial update (apply first item immediately)
  setTimeout(updateContent, initialDelay);
  
  // Set up the interval for continuous rotation
  setTimeout(() => {
    setInterval(updateContent, interval);
  }, initialDelay + interval);
}

/**
 * Initialize all rotations with a staggered start
 */
export function initializeRotations() {
  console.log('ROTATOR: Initializing metadata rotations');
  
  // Check if rotation configuration is valid
  if (!rotationConfig || !rotationConfig.rotationSets) {
    console.error('ROTATOR: Invalid rotation configuration');
    return;
  }
  
  const { rotationSets } = rotationConfig;
  
  // Set up staggered delays for each position
  initializeRotation('position1', rotationSets.position1, 0);
  initializeRotation('position2', rotationSets.position2, interval * 0.25);
  initializeRotation('position3', rotationSets.position3, interval * 0.5);
  initializeRotation('position4', rotationSets.position4, interval * 0.75);
  
  console.log('ROTATOR: All rotations initialized successfully');
}