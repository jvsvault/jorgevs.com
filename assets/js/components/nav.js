// assets/js/components/nav.js
export async function initNavigation() {
    try {
      console.log('Loading navigation...');
      const response = await fetch('/components/nav.html');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const html = await response.text();
      document.getElementById('nav-container').innerHTML = html;
      setActiveLink();
      
      console.log('Navigation loaded successfully');
    } catch (error) {
      console.error('Error loading navigation:', error);
      document.getElementById('nav-container').innerHTML = `
        <nav class="navigation" aria-label="Main navigation">
          <div class="container">
            <ul class="nav-list">
              <li class="nav-item"><a href="index.html" class="nav-link">Home</a></li>
              <li class="nav-item"><a href="about.html" class="nav-link">About</a></li>
              <li class="nav-item"><a href="manifest.html" class="nav-link">Manifest</a></li>
              <li class="nav-item"><a href="links.html" class="nav-link">Links</a></li>
              <li class="nav-item"><a href="listen.html" class="nav-link">Listen</a></li>
              <li class="nav-item"><a href="contact.html" class="nav-link">Contact</a></li>
            </ul>
          </div>
        </nav>
      `;
      setActiveLink();
    }
  
    function setActiveLink() {
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      const navLinks = document.querySelectorAll('.nav-link');
      
      navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
      });
    }
  }