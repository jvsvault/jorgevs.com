/**
 * Metadata Rotator - Minimal Implementation
 * This script handles text rotation without affecting animations
 */

// Content to rotate through
const content = [
  { title: 'Medium', text: 'Acoustic / Electronic' },
  { title: 'Medium', text: 'Piano / Ensembles' },
  { title: 'Medium', text: 'Sound Design / Tape' },
  { title: 'Inspiration', text: 'Electronic / Experimental' },
  { title: 'Inspiration', text: 'Boards of Canada / Aphex Twin' },
  { title: 'Inspiration', text: 'William Basinski / Merzbow' }
];

// Global index for debug panel - start with index 1 as requested
let currentIndex = 1;

// Simple function to update text only
function updateText() {
  const titleEl = document.querySelector('#rotating-dl-target dt');
  const textEl = document.querySelector('#rotating-dl-target dd');
  
  if (!titleEl || !textEl) return;
  
  // Update text only
  titleEl.textContent = content[currentIndex].title;
  textEl.textContent = content[currentIndex].text;
  
  // Update debug info
  const debug = document.getElementById('debug-info');
  if (debug) {
    debug.innerHTML = `Rotation: ${content[currentIndex].title} - ${content[currentIndex].text}<br>Index: ${currentIndex}`;
  }
  
  // Move to next item
  currentIndex = (currentIndex + 1) % content.length;
}

// Initialize on page load with more reliable timing
window.addEventListener('load', () => {
  // Wait for browser to complete any animations
  requestAnimationFrame(() => {
    // First rotation happens after 5 seconds (same as all subsequent rotations)
    setTimeout(() => {
      updateText();
      // All rotations happen at exactly 5-second intervals
      setInterval(updateText, 5000);
    }, 5000);
  });
});
