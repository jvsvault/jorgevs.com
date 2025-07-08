/**
 * Background Cache Manager
 * Preloads and caches images for seamless transitions
 */

class BackgroundCache {
  constructor() {
    this.imageCache = new Map();
    this.preloadedImages = new Set();
    this.currentImages = null;
  }

  /**
   * Preload an image and store in cache
   */
  async preloadImage(src) {
    if (this.preloadedImages.has(src)) {
      return this.imageCache.get(src);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.imageCache.set(src, img);
        this.preloadedImages.add(src);
        resolve(img);
      };
      
      img.onerror = () => {
        console.error(`Failed to preload: ${src}`);
        reject(new Error(`Failed to load ${src}`));
      };
      
      // Force browser to cache
      img.crossOrigin = 'anonymous';
      img.src = src;
    });
  }

  /**
   * Preload multiple images
   */
  async preloadImages(images) {
    const promises = images.map(src => 
      this.preloadImage(src).catch(err => {
        console.error(`Preload error: ${err.message}`);
        return null;
      })
    );
    
    return Promise.all(promises);
  }

  /**
   * Get next set of images and preload them
   */
  async prepareNextImages(bgImages, geoImages) {
    // Select random images
    const bgIndex = Math.floor(Math.random() * bgImages.length);
    const geoIndex = Math.floor(Math.random() * geoImages.length);
    
    const bgImage = bgImages[bgIndex];
    const geoImage = geoImages[geoIndex];
    
    const bgPath = `https://jvsvault.github.io/jorgevs.com/assets/images/bg-geo/${encodeURIComponent(bgImage)}`;
    const geoPath = `https://jvsvault.github.io/jorgevs.com/assets/images/bg-geo/${encodeURIComponent(geoImage)}`;
    
    // Preload both images
    try {
      await Promise.all([
        this.preloadImage(bgPath),
        this.preloadImage(geoPath)
      ]);
      
      return { bgPath, geoPath, bgImage, geoImage };
    } catch (error) {
      console.error('Failed to prepare images:', error);
      return null;
    }
  }

  /**
   * Apply cached images instantly
   */
  applyImages(bgPath, geoPath) {
    const root = document.documentElement;
    
    // These should load instantly from cache
    root.style.setProperty('--bg-image', `url('${bgPath}')`);
    root.style.setProperty('--geometry-texture', `url('${geoPath}')`);
  }

  /**
   * Preload all available images in background
   */
  async preloadAllInBackground(bgImages, geoImages) {
    console.log('CACHE: Starting background preload of all images');
    
    // Convert to full paths
    const bgPaths = bgImages.map(img => `https://jvsvault.github.io/jorgevs.com/assets/images/bg-geo/${encodeURIComponent(img)}`);
    const geoPaths = geoImages.map(img => `https://jvsvault.github.io/jorgevs.com/assets/images/bg-geo/${encodeURIComponent(img)}`);
    
    // Combine and deduplicate
    const allPaths = [...new Set([...bgPaths, ...geoPaths])];
    
    // Preload in chunks to avoid overwhelming the browser
    const chunkSize = 3;
    for (let i = 0; i < allPaths.length; i += chunkSize) {
      const chunk = allPaths.slice(i, i + chunkSize);
      await this.preloadImages(chunk);
      // Small delay between chunks
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`CACHE: Preloaded ${this.preloadedImages.size} images`);
  }
}

export default new BackgroundCache();