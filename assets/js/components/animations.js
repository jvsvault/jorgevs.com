// assets/js/components/animations.js
export function initAnimations() {
    const animations = ['fadeMoveVertical', 'fadeMoveHorizontal', 'fadeMoveDiagonal'];
    
    // Create style element for animations
    const style = document.createElement('style');
    document.head.appendChild(style);
    
    // Animate title elements
    animateElement('.title-container::after');
    
    // Animate h2 elements
    document.querySelectorAll('h2').forEach(el => {
        animateElement(`h2[data-id="${generateUniqueId(el)}"]::before`);
    });
    
    // Animate each metadata item independently
    document.querySelectorAll('.medium-item, .notation-item, .duration-item, .commissioned-item').forEach(el => {
        animateElement(`.${el.className}[data-id="${generateUniqueId(el)}"]::before`);
        setCSSVariablesForElement(el);
    });
    
    // Set up the profile decoration
    setupProfileDecoration();
    
    // Function to generate a unique ID
    function generateUniqueId(el) {
        const id = 'anim-' + Math.random().toString(36).substring(2, 9);
        el.setAttribute('data-id', id);
        return id;
    }
    
    // Function to apply a random animation to an element
    function animateElement(selector) {
        const animation = animations[Math.floor(Math.random() * animations.length)];
        style.textContent += `${selector} { animation: ${animation} 0.8s ease-out both; }`;
    }
    
    // Apply unique random CSS variables to each element
    function setCSSVariablesForElement(el) {
        // Set line parameters with more dramatic randomness
        el.style.setProperty('--line-start', `${Math.floor(Math.random() * 40)}%`);
        el.style.setProperty('--line-width', `${Math.floor(Math.random() * 100) + 80}%`);
        el.style.setProperty('--line-top', `${Math.floor(Math.random() * 70)}%`);
    }
    
    // Set general CSS variables
    setCSSVariable('--title-glyph-width', 180, 300, 'px');
    setCSSVariable('--title-glyph-height', 40, 70, 'px');
    setCSSVariable('--title-glyph-left', 40, 60);
    setCSSVariable('--title-glyph-top', 20, 40);
}

// Helper function to set CSS variables with randomness
function setCSSVariable(prop, min, max, unit = '%') {
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    document.documentElement.style.setProperty(prop, `${value}${unit}`);
}

function setupProfileDecoration() {
    const profileContainer = document.querySelector('.profile-image-container');
    if (!profileContainer) return;

    // Clear any existing decorations
    const existingDecorations = profileContainer.querySelectorAll('.profile-decoration');
    existingDecorations.forEach(el => el.remove());

    // Create a new decoration
    const decoration = document.createElement('div');
    decoration.className = 'profile-decoration';
    profileContainer.appendChild(decoration);

    // Get container dimensions
    const containerRect = profileContainer.getBoundingClientRect();
    const profileImage = profileContainer.querySelector('.profile-image');
    const imageRect = profileImage ? profileImage.getBoundingClientRect() : containerRect;

    // More variation in shape sizes
    const minSize = Math.min(containerRect.width, containerRect.height) * 0.25;
    const maxSize = Math.min(containerRect.width, containerRect.height) * 0.7;
    const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
    
    decoration.style.width = `${size}px`;
    decoration.style.height = `${size}px`;

    // More random positioning around the image
    const maxOffset = imageRect.width * 0.4;
    
    // Generate offset for x and y
    const xOffset = (Math.random() * maxOffset * 2) - maxOffset;
    const yOffset = (Math.random() * maxOffset * 2) - maxOffset;
    
    // Position relative to the image's center
    const imageCenter = {
        x: imageRect.left + imageRect.width / 2 - containerRect.left,
        y: imageRect.top + imageRect.height / 2 - containerRect.top
    };
    
    decoration.style.left = `${imageCenter.x + xOffset}px`;
    decoration.style.top = `${imageCenter.y + yOffset}px`;
    decoration.style.transform = 'translate(-50%, -50%)';

    // More shape variety
    const shapes = ['circle', 'triangle', 'square', 'rhombus', 'ellipse'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    if (shape === 'circle') {
        decoration.style.borderRadius = '50%';
    } else if (shape === 'triangle') {
        decoration.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
        decoration.style.transform = `translate(-50%, -50%) rotate(${Math.floor(Math.random() * 360)}deg)`;
    } else if (shape === 'rhombus') {
        decoration.style.clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
        decoration.style.transform = `translate(-50%, -50%) rotate(${Math.floor(Math.random() * 45)}deg)`;
    } else if (shape === 'ellipse') {
        decoration.style.borderRadius = '50%';
        // Create an ellipse by scaling differently in x and y
        const scaleX = 0.6 + Math.random() * 0.8;
        const scaleY = 0.6 + Math.random() * 0.8;
        decoration.style.transform = `translate(-50%, -50%) scale(${scaleX}, ${scaleY})`;
    }

    // Random opacity for more variation
    decoration.style.opacity = (0.6 + Math.random() * 0.4).toString();

    // Apply random animation
    const animations = ['fadeMoveVertical', 'fadeMoveHorizontal', 'fadeMoveDiagonal'];
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    decoration.style.animation = `${randomAnimation} 0.8s ease-out both`;
}