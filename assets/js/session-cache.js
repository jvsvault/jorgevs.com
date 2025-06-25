/**
 * Session Cache Manager
 * Maintains randomization state within a session to prevent flashing
 */

class SessionCache {
  constructor() {
    this.CACHE_KEY = 'jvs_session_state';
    this.SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
  }

  /**
   * Get current session state
   */
  getSessionState() {
    try {
      const stored = sessionStorage.getItem(this.CACHE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        // Check if session is still valid
        if (Date.now() - data.timestamp < this.SESSION_DURATION) {
          return data;
        }
      }
    } catch (error) {
      console.error('SESSION CACHE: Error reading session state:', error);
    }
    return null;
  }

  /**
   * Save current session state
   */
  saveSessionState(state) {
    try {
      const data = {
        ...state,
        timestamp: Date.now()
      };
      sessionStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('SESSION CACHE: Error saving session state:', error);
    }
  }

  /**
   * Get or create session images
   */
  getSessionImages(availableImages) {
    const session = this.getSessionState();
    
    if (session && session.selectedImages) {
      console.log('SESSION CACHE: Using cached session images');
      return session.selectedImages;
    }
    
    // Generate new random selection
    const bgIndex = Math.floor(Math.random() * availableImages.background.length);
    const geoIndex = Math.floor(Math.random() * availableImages.geometry.length);
    const profileIndex = Math.floor(Math.random() * availableImages.profile.length);
    
    const selectedImages = {
      background: availableImages.background[bgIndex],
      geometry: availableImages.geometry[geoIndex],
      profile: availableImages.profile[profileIndex],
      bgIndex,
      geoIndex,
      profileIndex
    };
    
    // Save for this session
    this.saveSessionState({ selectedImages });
    
    return selectedImages;
  }

  /**
   * Clear session
   */
  clearSession() {
    sessionStorage.removeItem(this.CACHE_KEY);
  }
}

export default new SessionCache();