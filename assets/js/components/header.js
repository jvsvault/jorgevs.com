export async function initHeader() {
    try {
      const response = await fetch('/components/header.html');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const html = await response.text();
      document.getElementById('header-container').innerHTML = html;
      
      // Set up profile decoration immediately
      const profileDecoration = document.createElement('div');
      profileDecoration.className = 'profile-decoration';
      document.querySelector('.profile-image-container').appendChild(profileDecoration);
      
      setupProfileDecoration();
      
    } catch (error) {
      console.error('Error loading header:', error);
      document.getElementById('header-container').innerHTML = `
        <header class="header">
          <div class="title-container">
            <h1 class="title">Jorge Viñals</h1>
          </div>
          <div class="header-grid">
            <div class="metadata">
              <dl>
                <dt>Medium</dt>
                <dd class="medium-item">Acoustic / Electronic / Tape</dd>
                <dt>Notation</dt>
                <dd class="notation-item">Traditional / MIDI</dd>
                <dt>Duration</dt>
                <dd class="duration-item">Variable</dd>
                <dt>Commissioned By</dt>
                <dd class="commissioned-item">Coca-Cola, New Balance,<br>Mccann Erickson, Ogilvy,<br>El Deseo</dd>
              </dl>
            </div>
            <div class="profile-image-container">
              <img src="/assets/images/2024/04/110.jpg" alt="Jorge Viñals" class="profile-image">
              <div class="profile-decoration"></div>
            </div>
          </div>
        </header>
      `;
      setupProfileDecoration();
    }
  
    function setupProfileDecoration() {
      const decoration = document.querySelector('.profile-decoration');
      if (!decoration) return;
  
      // Set random size (120-180px)
      const size = Math.floor(Math.random() * 60) + 120;
      decoration.style.width = `${size}px`;
      decoration.style.height = `${size}px`;
  
      // Position near the profile image (not menu)
      const imgContainer = document.querySelector('.profile-image-container');
      const imgRect = imgContainer.getBoundingClientRect();
      
      decoration.style.left = `${imgRect.left + (Math.random() * 100 - 30)}px`;
      decoration.style.top = `${imgRect.top + (Math.random() * 100 - 20)}px`;
  
      // Random shape
      const shapes = ['circle', 'triangle', 'square'];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      
      if (shape === 'circle') {
        decoration.style.borderRadius = '50%';
      } else if (shape === 'triangle') {
        decoration.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
        decoration.style.transform = `rotate(${Math.floor(Math.random() * 360)}deg)`;
      }
    }
  }