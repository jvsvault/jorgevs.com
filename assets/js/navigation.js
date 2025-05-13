// Navigation System v3 - Atomic Implementation
(() => {
  const NAV_CONFIG = Object.freeze([
    { path: '/about', label: 'About' },
    { path: '/works', label: 'Works' },
    { path: '/contact', label: 'Contact' },
    { path: '/etc', label: '/etc' }
  ]);

  const initNavigation = () => {
    const currentPath = window.location.pathname;
    
    document.querySelectorAll('.param-nav').forEach(navEl => {
      // Completely wipe existing navigation
      navEl.textContent = '';
      
      // Build new navigation atomically
      NAV_CONFIG.forEach(({path, label}) => {
        const link = document.createElement('a');
        link.href = path;
        link.textContent = label;
        if (path === currentPath) link.classList.add('active');
        navEl.appendChild(link);
        
        // Add space between items except last
        if (path !== NAV_CONFIG[NAV_CONFIG.length-1].path) {
          navEl.appendChild(document.createTextNode(' '));
        }
      });
    });
  };

  // Initialize on load and navigation
  document.addEventListener('DOMContentLoaded', initNavigation);
  window.addEventListener('popstate', initNavigation);
})();
