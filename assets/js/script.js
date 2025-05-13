// /assets/js/script.js
document.addEventListener('DOMContentLoaded', () => {
    // First handle all the non-profile decoration animations and styling
    applyGeneralAnimations();
    
    // Then, separately handle the profile decoration
    // We'll add it with a slight delay to ensure proper positioning
    setTimeout(() => {
      setupProfileDecoration();
    }, 50);
    
    // Setup mailing list form toggle if on contact page
    setupMailingListForm();
  });
  
  function applyGeneralAnimations() {
    const animations = ['fadeMoveVertical', 'fadeMoveHorizontal', 'fadeMoveDiagonal'];
    const selectors = [
      '.title-container::after',
      'h2::before',
      '.medium-item::before',
      '.notation-item::before',
      '.duration-item::before',
      '.commissioned-item::before'
    ];
    
    // Apply random animations
    const style = document.createElement('style');
    selectors.forEach((selector) => {
      const animation = animations[Math.floor(Math.random() * animations.length)];
      style.innerHTML += `${selector} { animation: ${animation} 0.8s ease-out both; }`;
    });
    document.head.appendChild(style);
    
    // Helper function to set CSS variables
    const set = (prop, min, max, unit = '%') => {
      const value = Math.floor(Math.random() * (max - min + 1)) + min;
      document.documentElement.style.setProperty(prop, `${value}${unit}`);
    };
    
    // Set random line positions
    set('--line-start', 0, 60);
    set('--line-width', 80, 180);
    set('--line-top', 10, 90);
    
    ['medium', 'notation', 'duration', 'commissioned'].forEach(key => {
      set(`--${key}-line-start`, 0, 20);
      set(`--${key}-line-width`, 40, 100);
      set(`--${key}-line-top`, 0, 80);
    });
    
    // Title styling
    set('--title-glyph-width', 180, 300, 'px');
    set('--title-glyph-height', 40, 70, 'px');
    set('--title-glyph-left', 40, 60);
    set('--title-glyph-top', 30, 50);
  }
  
  function setupProfileDecoration() {
    const existingDecoration = document.querySelector('.profile-decoration');
    if (existingDecoration) existingDecoration.remove();
    
    const profileContainer = document.querySelector('.profile-image-container');
    const profileImage = document.querySelector('.profile-image');
    if (!profileContainer || !profileImage) return;

    // Get image dimensions and position relative to container
    const imgRect = profileImage.getBoundingClientRect();
    const containerRect = profileContainer.getBoundingClientRect();
    
    // Calculate image position within container
    const imgLeft = imgRect.left - containerRect.left;
    const imgTop = imgRect.top - containerRect.top;
    const imgRight = containerRect.right - imgRect.right;
    const imgBottom = containerRect.bottom - imgRect.bottom;

    const decoration = document.createElement('div');
    decoration.className = 'profile-decoration';
    profileContainer.appendChild(decoration);

    // Maintain original size (100-120% of image)
    const baseSize = Math.min(imgRect.width, imgRect.height);
    const size = baseSize * (1 + Math.random() * 0.2);
    
    // Define positions that hug the image edges
    const positions = [
        { // Top-left
            left: imgLeft - size/2,
            top: imgTop - size/2
        },
        { // Top
            left: imgLeft + imgRect.width/2 - size/2,
            top: imgTop - size/2
        },
        { // Top-right
            left: imgLeft + imgRect.width - size/2,
            top: imgTop - size/2
        },
        { // Right
            left: imgLeft + imgRect.width - size/2,
            top: imgTop + imgRect.height/2 - size/2
        },
        { // Bottom-right
            left: imgLeft + imgRect.width - size/2,
            top: imgTop + imgRect.height - size/2
        },
        { // Bottom
            left: imgLeft + imgRect.width/2 - size/2,
            top: imgTop + imgRect.height - size/2
        },
        { // Bottom-left
            left: imgLeft - size/2,
            top: imgTop + imgRect.height - size/2
        },
        { // Left
            left: imgLeft - size/2,
            top: imgTop + imgRect.height/2 - size/2
        }
    ];

    // Random position with edge detection
    let position;
    do {
        position = positions[Math.floor(Math.random() * positions.length)];
    } while ( // Ensure it stays within container bounds
        position.left < -size/2 || 
        position.top < -size/2 ||
        position.left > containerRect.width - size/2 ||
        position.top > containerRect.height - size/2
    );

    // Apply styles
    decoration.style.width = `${size}px`;
    decoration.style.height = `${size}px`;
    decoration.style.backgroundColor = 'var(--color-accent)';
    decoration.style.opacity = '0.8';
    decoration.style.zIndex = '0';
    decoration.style.position = 'absolute';
    decoration.style.left = `${position.left}px`;
    decoration.style.top = `${position.top}px`;

    // Shape and animation
    const shapes = ['square', 'circle', 'triangle'];
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    const animations = ['fadeMoveVertical', 'fadeMoveHorizontal', 'fadeMoveDiagonal'];
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];

    if (randomShape === 'circle') {
        decoration.style.borderRadius = '50%';
    } else if (randomShape === 'triangle') {
        decoration.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
        decoration.style.transform = `rotate(${Math.floor(Math.random() * 360)}deg)`;
    }

    requestAnimationFrame(() => {
        decoration.style.animation = `${randomAnimation} 0.8s ease-out both`;
    });
}

function setupMailingListForm() {
    // Check if we're on the contact page
    const showFormButton = document.getElementById('show-mailing-form');
    const closeFormButton = document.getElementById('close-mailing-form');
    const formContainer = document.getElementById('mailing-form-container');
    
    if (!showFormButton || !closeFormButton || !formContainer) return;
    
    // Show the form when the Subscribe button is clicked
    showFormButton.addEventListener('click', () => {
        formContainer.style.display = 'flex';
        // Use setTimeout to trigger the transition
        setTimeout(() => {
            formContainer.classList.add('visible');
        }, 10);
    });
    
    // Hide the form when the close button is clicked
    closeFormButton.addEventListener('click', () => {
        formContainer.classList.remove('visible');
        // Wait for the transition to complete before hiding
        setTimeout(() => {
            formContainer.style.display = 'none';
        }, 300);
    });
    
    // Also close the form when clicking outside of it
    formContainer.addEventListener('click', (e) => {
        if (e.target === formContainer) {
            closeFormButton.click();
        }
    });
}
