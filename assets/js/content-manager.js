/**
 * Content Manager - Single Page Application System
 * Handles dynamic loading of different page sections
 */

import { renderMarkdown } from './md.js?v=20260901-1348';

class ContentManager {
    constructor() {
      this.currentSection = 'about'; // default section
      this.contentContainer = null;
      this.navLinks = [];
      
      // Los textos viven en /content/*.md — se editan ahí, no aquí.
      // Este objeto solo declara qué secciones existen y guarda lo ya cargado.
      this.sections = Object.fromEntries(
        ['about', 'catalog', 'subscribe', 'etc', 'privacy'].map(n => [n, null])
      );
      this.cache = {};
    }

    /**
     * Initialize the content management system
     */
    init() {
      console.log('CONTENT MANAGER: Initializing SPA system');
      
      this.contentContainer = document.getElementById('dynamic-content');
      this.navLinks = document.querySelectorAll('.param-nav a[data-section]');
      
      if (!this.contentContainer) {
        console.error('CONTENT MANAGER: Dynamic content container not found');
        return;
      }
  
      // Set up navigation event listeners
      this.setupNavigation();
      
      // Load initial content based on URL hash or default to 'about'
      this.loadInitialContent();
      
      console.log('CONTENT MANAGER: SPA system initialized');
    }
  
    /**
     * Set up navigation event listeners
     */
    setupNavigation() {
      this.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const section = link.getAttribute('data-section');
          this.loadSection(section);
          this.updateURL(section);
        });
      });
  
      // Handle browser back/forward
      window.addEventListener('popstate', (e) => {
        const section = this.getSectionFromURL();
        this.loadSection(section, false); // false = don't update URL again
      });
    }
  
    /**
     * Load initial content based on URL or default
     */
    loadInitialContent() {
      const section = this.getSectionFromURL();
      this.loadSection(section, false); // Don't update URL on initial load
    }
  
    /**
     * Get current section from URL hash
     */
    getSectionFromURL() {
      // Comprobar `in`, no el valor: los valores arrancan a null, asi que
      // `this.sections[hash]` era siempre falsy y todo caia en 'about'.
      // Se acepta tanto /subscribe como #subscribe: privacy.md enlaza rutas.
      const ruta = window.location.pathname.replace(/^\/|\/$/g, '');
      if (ruta in this.sections) return ruta;
      const hash = window.location.hash.replace('#', '');
      return hash in this.sections ? hash : 'about';
    }
  
    /**
     * Load a specific section
     */
    async fetchSection(nombre) {
      if (this.cache[nombre]) return this.cache[nombre];
      const r = await fetch(`/content/${nombre}.md?t=${Date.now()}`);
      if (!r.ok) throw new Error(`content/${nombre}.md → HTTP ${r.status}`);
      const src = await r.text();
      const titulo = (src.match(/<!--\s*title:\s*(.+?)\s*-->/) || [])[1] || 'Jorge Viñals';
      const section = { title: titulo, content: renderMarkdown(src.replace(/<!--.*?-->/s, '')) };
      this.cache[nombre] = section;
      return section;
    }

    async loadSection(sectionName, updateURL = true) {
      console.log(`CONTENT MANAGER: Loading section '${sectionName}'`);

      if (!(sectionName in this.sections)) {
        console.error(`CONTENT MANAGER: Section '${sectionName}' not found`);
        return;
      }

      let section;
      try {
        section = await this.fetchSection(sectionName);
      } catch (e) {
        console.error('CONTENT MANAGER:', e);
        this.contentContainer.innerHTML = '<p>Content unavailable. Try reloading.</p>';
        return;
      }

      // Update page title
      document.title = section.title;
      
      // Load content with fade transition
      this.contentContainer.style.opacity = '0';
      
      setTimeout(() => {
        this.contentContainer.innerHTML = section.content;
        this.contentContainer.style.opacity = '1';
        
        // Update navigation active state
        this.updateNavigation(sectionName);
        
        // Trigger full randomization on section change
        if (window.jorgevsRandomizer) {
          setTimeout(() => {
            // Force new random selection on section change
            window.jorgevsRandomizer._forceNew = true;
            sessionStorage.removeItem('jvs_current_images');
            window.jorgevsRandomizer.applyRandomization();
            console.log('CONTENT MANAGER: Triggered new randomization for section change');
          }, 100);
        }
        
        this.currentSection = sectionName;
        this.wireSubscribeForm();
        
      }, 150);
  
      // Update URL if requested
      if (updateURL) {
        this.updateURL(sectionName);
      }
    }
  
    /**
     * Conecta el formulario de suscripcion, si la seccion recien pintada lo
     * trae. El markup vive en content/subscribe.md para que se edite desde
     * Obsidian; aqui solo esta la logica. Va contra /api/public/subscription,
     * que nginx proxya a Listmonk en el mismo origen (sin CORS).
     */
    wireSubscribeForm() {
      const form = this.contentContainer.querySelector('#subscribe-form');
      if (!form || form.dataset.wired) return;
      form.dataset.wired = '1';
      const aviso = form.querySelector('.form-status');
      const boton = form.querySelector('button[type=submit]');

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const listas = [...form.querySelectorAll('input[name=list]:checked')].map(c => c.value);
        if (!listas.length) {
          aviso.textContent = 'Pick at least one list.';
          return;
        }
        boton.disabled = true;
        aviso.textContent = 'Sending...';
        try {
          const r = await fetch('/api/public/subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: form.email.value.trim(),
              name: form.name.value.trim(),
              list_uuids: listas
            })
          });
          // 429 = limite de peticiones de nginx; merece su propio mensaje.
          if (r.status === 429) throw new Error('Too many attempts. Try again in a minute.');
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          form.reset();
          aviso.textContent = "You're on the list.";
        } catch (err) {
          aviso.textContent = `Could not subscribe: ${err.message}`;
          boton.disabled = false;
        }
      });
    }

    /**
     * Update navigation active states
     */
    updateNavigation(activeSection) {
      this.navLinks.forEach(link => {
        const section = link.getAttribute('data-section');
        if (section === activeSection) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  
    /**
     * Update URL without triggering page reload
     */
    updateURL(section) {
      history.pushState({ section }, '', `/${section}`);
    }
  
    /**
     * Add new content section (for future extensibility)
     */
    addSection(name, config) {
      this.sections[name] = config;
      console.log(`CONTENT MANAGER: Added new section '${name}'`);
    }
  }
  
  // Create and export global instance
  const contentManager = new ContentManager();
  
  export default contentManager;