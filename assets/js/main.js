// assets/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  // Preload components before showing anything
  preloadResources().then(() => {
      // Only initialize and show content when everything is loaded
      initializeComponents().then(() => {
          // After everything is initialized, show the body
          document.body.style.opacity = '1';
      });
  });
});

async function preloadResources() {
  // Create hidden preload elements for critical resources
  const preloads = [
      '/components/header.html',
      '/components/nav.html',
      '/components/footer.html',
  ];
  
  // Create an array of promises for each resource
  const preloadPromises = preloads.map(url => {
      return fetch(url).then(response => {
          if (!response.ok) throw new Error(`Failed to preload ${url}`);
          return response.text();
      });
  });
  
  // Wait for all resources to be preloaded
  return Promise.all(preloadPromises).catch(err => {
      console.error('Error preloading resources:', err);
  });
}

async function initializeComponents() {
  // Run these in parallel for better performance
  await Promise.all([
      initHeader(),
      initNavigation(),
      initFooter()
  ]);
  
  // Initialize animations last to ensure the DOM is ready
  setTimeout(() => {
      import('./components/animations.js').then(module => {
          module.initAnimations();
      });
  }, 50);
}

async function initHeader() {
  const headerContainer = document.getElementById('header-container');
  if (!headerContainer) return;
  
  try {
      const response = await fetch('/components/header.html');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const html = await response.text();
      headerContainer.innerHTML = html;
  } catch (error) {
      console.error('Error loading header:', error);
      headerContainer.innerHTML = `
          <div class="title-container">
              <h1 class="title">Jorge Viñals</h1>
          </div>
          <div class="header-grid">
              <div class="metadata">
                  <dl>
                      <dt>Medium</dt>
                      <dd class="medium-item">Acoustic / Electronic / Tape </dd>
                      <dt>Notation</dt>
                      <dd class="notation-item">Traditional / MIDI </dd>
                      <dt>Duration</dt>
                      <dd class="duration-item">Variable</dd>
                      <dt>Commissioned By</dt>
                      <dd class="commissioned-item">Coca-Cola, New Balance,<br>Mccann Erickson, Ogilvy,<br>El Deseo</dd>
                  </dl>
              </div>
              <div class="profile-image-container">
                  <img src="/assets/images/2024/04/110.jpg" alt="Jorge Viñals" class="profile-image" />
              </div>
          </div>
      `;
  }
}

async function initNavigation() {
  const navContainer = document.getElementById('nav-container');
  if (!navContainer) return;
  
  try {
      const response = await fetch('/components/nav.html');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const html = await response.text();
      navContainer.innerHTML = html;
      
      // Set active link
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      const links = navContainer.querySelectorAll('.nav-link');
      links.forEach(link => {
          const href = link.getAttribute('href');
          if (href === currentPage || (currentPage === 'index.html' && href === '/' || href === '')) {
              link.classList.add('active');
          }
      });
  } catch (error) {
      console.error('Error loading navigation:', error);
      navContainer.innerHTML = `
          <nav class="navigation">
              <ul class="nav-list">
                  <li><a href="/about" class="nav-link">About</a></li>
                  <li><a href="/manifest" class="nav-link">Manifest</a></li>
                  <li><a href="/links" class="nav-link">Links</a></li>
                  <li><a href="/listen" class="nav-link">Listen</a></li>
                  <li><a href="/contact" class="nav-link">Contact</a></li>
              </ul>
          </nav>
      `;
  }
}

async function initFooter() {
  const footerContainer = document.getElementById('footer-container');
  if (!footerContainer) return;
  
  try {
      const response = await fetch('/components/footer.html');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const html = await response.text();
      footerContainer.innerHTML = html;
      
      // Set current year
      const yearElement = footerContainer.querySelector('#current-year');
      if (yearElement) {
          yearElement.textContent = new Date().getFullYear();
      }
  } catch (error) {
      console.error('Error loading footer:', error);
      footerContainer.innerHTML = `
          <div class="site-footer">
              &copy; ${new Date().getFullYear()} Jorge Viñals
          </div>
      `;
  }
}