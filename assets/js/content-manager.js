/**
 * Content Manager - Single Page Application System
 * Handles dynamic loading of different page sections
 */

class ContentManager {
    constructor() {
      this.currentSection = 'about'; // default section
      this.contentContainer = null;
      this.navLinks = [];
      
      // Content definitions - Only the unique content for each section
      this.sections = {
        about: {
          title: 'About | Jorge Viñals',
          content: `
            <h2>COMPOSITION NOTES</h2>
            <p>
              I was a Conservatory kid that started making music from an early age, and later in life became a composer for others by chance.
            </p>
            <p>
              Over the years, working across so many projects turned me into a Swiss Army knife of sorts, but in the process my own identity was left behind. After taking time to perfect my craft and realign with who I am and who I want to become, I'm ready to take on commissioned work again. But only on projects where I can stay true to myself.
            </p>
            <p>
              My current sound is fluid, bridging the space between acoustic and electronic, blending raw sounds and physical timbres with pure signal processing. Sometimes it's harmonic and soft, others it's dissonant or noisy. It's always expressive and emotional, and it usually has a signature melancholic sound that many describe as a core element of my style.
            </p>
          `
        },
        
        listen: {
          title: 'Listen | Jorge Viñals',
          content: `
            <h2>LISTEN</h2>
            
            <p>Here you can listen to a selection of my works through the years. Some have been used in soundtracks, others are from my own projects. The soundtrack pieces are not available for use, for obvious reasons. nor are the rest, as they're part of an ongoing process of shaping my catalogue through proper studio work. I wouldn't feel comfortable having them used in library form. Nevertheless, this feels like a good representation of who I am and some of my skills.</p>
            
            <!-- Music Player -->
            <div class="disco-player-container">
              <iframe id="disco-playlist-23502159" name="disco-playlist-23502159" allowfullscreen frameborder="0" class="disco-embed" src="https://jorgevs.disco.ac/e/p/23502159?download=false&s=z8RayvDcN70nqZnY6Bx9vUxzNKc%3A5A7Jsc4B&artwork=true&color=%23808080&theme=dark" width="100%" height="500"></iframe>
            </div>
            
            <p>Another facet of my work is my current solo project, VISE, which aims to be a crossroad between classical and electronic music. It's brighter than my composer side, but it also represents another part of me. I think it's also interesting to see some studio footage and how I built a small orchestra from scratch.</p>
            
            <!-- YouTube Videos -->
            <div class="video-container">
              <iframe width="100%" height="315" src="https://www.youtube.com/embed/6g6dLIBBQ4w?si=X88ZFmaHAiSz_ekJ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
            
            <div class="video-container">
              <iframe width="100%" height="315" src="https://www.youtube.com/embed/i8guhuDX9_I?si=AyVzkhnMmeWIanwB" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
          `
        },
        
        contact: {
          title: 'Contact | Jorge Viñals',
          content: `
            <h2>CONTACT</h2>
            
            <p>If you want to share some thoughts, or you have a project you think I may fit in, you can drop me a line <a href="mailto:jorgevs.com@gmail.com" class="email-link">here</a>.</p>
          `
        },
        
        img: {
          title: '/img | Jorge Viñals',
          content: `
            <h2>/IMG</h2>
            
            <p>Besides music and sound, I also explore visual arts through photography. My work focuses on capturing textures, geometries, and moments that resonate with the same emotional depth as my compositions. You can explore my visual work and color experiments at:</p>
            <a href="https://jvs.vision" target="_blank" rel="noopener noreferrer" class="vault-button">Visit jvs.vision</a>
          `
        },
        
        etc: {
          title: '/etc | Jorge Viñals',
          content: `
            <h2>/ETC</h2>
            
            <p>
              I had an interest in computers since childhood because they became my first tool for making music. So besides studying music and sound, I also got my degree in Telecommunications Engineering. An old boss used to say I'm a hybrid of creative and engineer. I always say I'm a bad engineer, but because I'm creative and resourceful I always find a way. Music is Math, as a wise duo used to say.
            </p>
            
            <p>
              At the moment I'm lucky enough to work at BMAT, where flexibility is a core identity, so I can give my all there while working on my music. And maybe yours. I don't see myself leaving this company, but maybe if I win a couple of Goyas and an Oscar I'll consider it. You can check my dev adventures here:
            </p>
            <a href="https://jvsvault.dev" target="_blank" rel="noopener noreferrer" class="vault-button">Visit jvsvault.dev</a>
          `
        }
      };
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
    loadSection(sectionName, updateURL = true) {
      console.log(`CONTENT MANAGER: Loading section '${sectionName}'`);
      
      if (!this.sections[sectionName]) {
        console.error(`CONTENT MANAGER: Section '${sectionName}' not found`);
        return;
      }
  
      const section = this.sections[sectionName];
      
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
            // Re-randomize everything: background, shapes, colors
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