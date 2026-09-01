/**
 * Content Manager - Single Page Application System
 * Handles dynamic loading of different page sections
 */

import { renderMarkdown } from './md.js?v=20260901-1256';

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
      const hash = window.location.hash.replace('#', '');
      return this.sections[hash] ? hash : 'about';
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
        
      }, 150);
  
      // Update URL if requested
      if (updateURL) {
        this.updateURL(sectionName);
      }
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
      const newURL = `${window.location.pathname}#${section}`;
      history.pushState({ section }, '', newURL);
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