export function initImageDecorations() {
    document.querySelectorAll('[data-decorations]').forEach(container => {
      // Clear existing decorations
      container.innerHTML = '';
      
      // Create 3-5 decorations
      const count = Math.floor(Math.random() * 3) + 3;
      const shapes = ['circle', 'triangle', 'square'];
      
      for (let i = 0; i < count; i++) {
        const decoration = document.createElement('div');
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        decoration.className = `decoration decoration--${shape}`;
        decoration.style.setProperty('--rotation', `${Math.floor(Math.random() * 360)}deg`);
        
        // Size between 30-80px
        const size = Math.floor(Math.random() * 50) + 30;
        decoration.style.width = `${size}px`;
        decoration.style.height = `${size}px`;
        
        // Position around the image edges
        const position = getDecorationPosition(i, count);
        decoration.style.left = position.x;
        decoration.style.top = position.y;
        decoration.style.animationDelay = `${i * 0.1}s`;
        
        container.appendChild(decoration);
      }
    });
  }
  
  function getDecorationPosition(index, total) {
    const edge = index % 4;
    const spacing = 100 / (Math.floor(total / 4) + 1);
    const position = (Math.floor(index / 4) + 1) * spacing;
    
    switch(edge) {
      case 0: return { x: `${position}%`, y: '0%' };    // Top
      case 1: return { x: '100%', y: `${position}%` };  // Right
      case 2: return { x: `${position}%`, y: '100%' };  // Bottom
      case 3: return { x: '0%', y: `${position}%` };    // Left
    }
  }