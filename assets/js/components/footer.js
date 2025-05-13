// assets/js/components/footer.js
export async function initFooter() {
    try {
      console.log('Loading footer...');
      const response = await fetch('/components/footer.html');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const html = await response.text();
      document.getElementById('footer-container').innerHTML = html;
      document.getElementById('current-year').textContent = new Date().getFullYear();
      
      console.log('Footer loaded successfully');
    } catch (error) {
      console.error('Error loading footer:', error);
      document.getElementById('footer-container').innerHTML = `
        <footer class="site-footer">
          <div class="container">
            <p>© ${new Date().getFullYear()} Jorge Viñals</p>
          </div>
        </footer>
      `;
    }
  }