/**
 * JVS Vision - Color Palette Explorer
 * Handles palette switching and color display
 */

class JVSVision {
  constructor() {
    this.currentPalette = 'monochrome';
    this.paletteOptions = document.querySelectorAll('.palette-option');
    this.colorCards = document.querySelectorAll('.color-card');
    this.init();
  }

  init() {
    console.log('JVS Vision: Initializing palette explorer');
    
    // Set up palette switching
    this.setupPaletteSelector();
    
    // Initialize with extracted colors if available
    this.checkForExtractedColors();
    
    // Update color values display
    this.updateColorDisplay();
  }

  setupPaletteSelector() {
    this.paletteOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        const palette = option.dataset.palette;
        this.switchPalette(palette);
      });
    });
  }

  switchPalette(paletteName) {
    console.log(`JVS Vision: Switching to ${paletteName} palette`);
    
    // Update active state
    this.paletteOptions.forEach(option => {
      option.classList.remove('active');
      if (option.dataset.palette === paletteName) {
        option.classList.add('active');
      }
    });
    
    // Apply palette to body
    document.body.setAttribute('data-palette', paletteName);
    this.currentPalette = paletteName;
    
    // If switching to extracted, try to get colors from parent site
    if (paletteName === 'extracted') {
      this.applyExtractedColors();
    }
    
    // Update color display values
    this.updateColorDisplay();
    
    // Animate the change
    this.animateColorChange();
  }

  checkForExtractedColors() {
    // Check if we can access parent window's randomizer
    try {
      if (window.opener && window.opener.jorgevsRandomizer) {
        const randomizer = window.opener.jorgevsRandomizer;
        if (randomizer.colorVariations) {
          console.log('JVS Vision: Found extracted colors from parent');
          this.applyExtractedColors();
        }
      }
    } catch (e) {
      console.log('JVS Vision: No parent window colors available');
    }
    
    // Alternative: Check localStorage for saved colors
    const savedColors = localStorage.getItem('jvs-extracted-colors');
    if (savedColors) {
      const colors = JSON.parse(savedColors);
      this.setExtractedPalette(colors);
    }
  }

  applyExtractedColors() {
    try {
      // Try to get colors from parent window
      if (window.opener && window.opener.jorgevsRandomizer && window.opener.jorgevsRandomizer.colorVariations) {
        const colors = window.opener.jorgevsRandomizer.colorVariations;
        this.setExtractedPalette(colors);
      }
    } catch (e) {
      console.log('JVS Vision: Could not access parent colors');
    }
  }

  setExtractedPalette(colors) {
    // Set CSS variables for extracted palette
    const root = document.documentElement;
    
    if (colors.base) root.style.setProperty('--primary-color', colors.base);
    if (colors.light) root.style.setProperty('--light-color', colors.light);
    if (colors.dark) root.style.setProperty('--dark-color', colors.dark);
    if (colors.vibrant) root.style.setProperty('--vibrant-color', colors.vibrant);
    if (colors.muted) root.style.setProperty('--muted-color', colors.muted);
    
    // Update the extracted palette swatch
    const extractedOption = document.querySelector('[data-palette="extracted"] .color-swatch');
    if (extractedOption && colors.base) {
      extractedOption.style.background = colors.base;
    }
  }

  updateColorDisplay() {
    // Get computed styles
    const styles = getComputedStyle(document.body);
    
    // Color mappings
    const colorMap = {
      'primary': '--primary-color',
      'light': '--light-color',
      'dark': '--dark-color',
      'vibrant': '--vibrant-color',
      'muted': '--muted-color'
    };
    
    // Update each color card
    this.colorCards.forEach(card => {
      const colorType = Array.from(card.classList).find(c => colorMap[c]);
      if (colorType && colorMap[colorType]) {
        const colorValue = styles.getPropertyValue(colorMap[colorType]).trim();
        const valueElement = card.querySelector('.color-value');
        if (valueElement) {
          valueElement.textContent = colorValue || '#000000';
        }
      }
    });
  }

  animateColorChange() {
    // Add animation class to color displays
    const colorDisplays = document.querySelectorAll('.color-display');
    colorDisplays.forEach(display => {
      display.style.transform = 'scale(0.95)';
      setTimeout(() => {
        display.style.transform = 'scale(1)';
      }, 100);
    });
    
    // Animate shapes
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
      shape.style.transform = 'scale(0) rotate(180deg)';
      setTimeout(() => {
        shape.style.transform = '';
      }, 100 + (index * 50));
    });
  }

  // Public method to set colors from external source
  setColors(colorData) {
    console.log('JVS Vision: Setting colors from external source', colorData);
    
    // Save to localStorage
    localStorage.setItem('jvs-extracted-colors', JSON.stringify(colorData));
    
    // Apply if extracted palette is active
    if (this.currentPalette === 'extracted') {
      this.setExtractedPalette(colorData);
      this.updateColorDisplay();
    }
  }
}

// Initialize when DOM is ready
const jvsVision = new JVSVision();

// Export for external use
window.jvsVision = jvsVision;

// Listen for color updates from parent window
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'colorUpdate' && event.data.colors) {
    jvsVision.setColors(event.data.colors);
  }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Number keys 1-6 for quick palette switching
  const paletteMap = {
    '1': 'extracted',
    '2': 'monochrome',
    '3': 'warm',
    '4': 'cool',
    '5': 'earth',
    '6': 'neon'
  };
  
  if (paletteMap[e.key]) {
    jvsVision.switchPalette(paletteMap[e.key]);
  }
  
  // Escape to go back to main site
  if (e.key === 'Escape') {
    window.location.href = '/';
  }
});