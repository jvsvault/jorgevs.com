/**
 * Content Manager - Single Page Application System
 * Handles dynamic loading of different page sections
 */

import { renderMarkdown } from './md.js?v=20260906-0832';

class ContentManager {
    constructor() {
      this.currentSection = 'about'; // default section
      this.contentContainer = null;
      this.navLinks = [];
      
      // Los textos viven en /content/*.md y MANDAN: las secciones y el menú se
      // descubren de ahí en cada carga. Antes esta lista estaba escrita a mano
      // aquí y la nav a mano en el HTML, así que añadir o quitar un .md en
      // Obsidian dejaba la web desincronizada sin ningún error visible. Pasó
      // dos veces. La única lista que existe ahora es la del directorio.
      this.sections = {};
      this.meta = {};   // nombre -> { etiqueta, orden }
      this.cache = {};
      // Red de seguridad: si el índice no responde, el sitio sigue navegable.
      this.RESPALDO = ['about', 'catalog', 'subscribe', 'etc', 'privacy'];
    }

    /**
     * Initialize the content management system
     */
    async init() {
      console.log('CONTENT MANAGER: Initializing SPA system');
      
      this.contentContainer = document.getElementById('dynamic-content');
      await this.descubrirSecciones();
      this.pintarNav();
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
     * Descubre qué secciones existen leyendo el directorio de textos.
     * La etiqueta del menú sale del propio fichero (`<!-- title: X | ... -->`),
     * y el orden de un `<!-- nav: N -->` opcional. Sin ese marcador, alfabético.
     * Así se controla todo desde Obsidian, sin tocar una línea de código.
     */
    async descubrirSecciones() {
      let nombres = this.RESPALDO;
      try {
        const r = await fetch(`/content-index/?t=${Date.now()}`);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const entradas = await r.json();
        const md = entradas
          .filter(e => e.type === 'file' && e.name.endsWith('.md'))
          // Syncthing deja copias `X.sync-conflict-<fecha>-<id>.md` cuando el
          // mismo fichero se edita en dos sitios, y aparecieron como cinco
          // apartados duplicados en el menu el 2026-09-02. Tampoco son paginas
          // los ficheros que empiezan por `_` o `.` (borradores, ocultos).
          .filter(e => !/\.sync-conflict-/.test(e.name) && !/^[._]/.test(e.name))
          .map(e => e.name.replace(/\.md$/, ''));
        if (md.length) nombres = md;
        else console.warn('CONTENT MANAGER: índice vacío, uso el respaldo');
      } catch (e) {
        console.warn('CONTENT MANAGER: no se pudo leer /content-index/, uso el respaldo —', e.message);
      }

      const cargadas = await Promise.all(nombres.map(async n => {
        try { return [n, await this.fetchSection(n)]; }
        catch { return [n, null]; }   // un .md ilegible no puede tumbar el menú
      }));

      for (const [n, sec] of cargadas) {
        if (!sec) continue;
        this.sections[n] = null;
        // <!-- nav: N -->      posicion en el menu
        // <!-- nav: oculto -->  seccion accesible por su URL, fuera del menu
        // sin marcador          se muestra al final, por orden alfabetico
        const marca = sec.raw && sec.raw.match(/<!--\s*nav:\s*([^\s>-]+)\s*-->/);
        const valor = marca ? marca[1].toLowerCase() : null;
        this.meta[n] = {
          // "Contact & Subscribe | Jorge Viñals" -> "Contact & Subscribe"
          etiqueta: sec.title.split(/\s+[|\u2013-]\s+/)[0].trim() || n,
          oculta: ['oculto', 'oculta', 'none', 'hidden', 'no'].includes(valor),
          orden: valor && /^\d+$/.test(valor) ? parseInt(valor, 10) : 500
        };
      }
      console.log('CONTENT MANAGER: secciones descubiertas —', Object.keys(this.sections).join(', '));
    }

    /**
     * Pinta el menú a partir de lo descubierto. Sustituye lo que hubiera en el
     * HTML, que ahora es solo un contenedor vacío.
     */
    pintarNav() {
      const nav = document.querySelector('.param-nav');
      if (!nav) return;
      const orden = Object.keys(this.sections)
        .filter(n => !this.meta[n].oculta)
        .sort((a, b) => (this.meta[a].orden - this.meta[b].orden) || a.localeCompare(b));
      nav.innerHTML = orden.map(n =>
        `<a href="/${n}" data-section="${n}">${this.meta[n].etiqueta}</a>`).join('\n      ');
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
      // Los comentarios de cabecera son metadatos (title, nav): fuera antes de
      // renderizar. Se quitan solo los del principio, no los que haya dentro
      // del contenido (catalog.md usa comentarios junto a los embeds).
      const cuerpo = src.replace(/^(?:\s*<!--[\s\S]*?-->\s*)+/, '');
      const section = { title: titulo, raw: src, content: renderMarkdown(cuerpo) };
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