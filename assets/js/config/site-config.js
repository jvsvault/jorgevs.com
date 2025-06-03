/**
 * Site Configuration
 * Central location for all site-wide settings and constants
 */

export const SiteConfig = {
  // Animation timings
  animations: {
    fadeInDuration: 600,
    fadeOutDuration: 150,
    rotationInterval: 5000,
    profileRotationDuration: 20000
  },

  // Layout constraints
  layout: {
    containerMaxWidth: 900,
    headerGridMaxWidth: 600,
    mobileBreakpoint: 768,
    tabletBreakpoint: 1024
  },

  // Decoration dimensions
  decorations: {
    title: {
      minWidth: 60,
      maxWidth: 120,
      minHeight: 30,
      maxHeight: 50,
      gap: 10
    },
    h2: {
      minWidth: 120,
      maxWidth: 220,
      minHeight: 15,
      maxHeight: 25
    },
    metadata: {
      minWidth: 100,
      maxWidth: 200,
      minOffsetX: -5,
      maxOffsetX: 5
    },
    profile: {
      minFrameSize: 105,
      maxFrameSize: 145,
      maxRotation: 45
    }
  },

  // Asset paths
  assets: {
    backgroundPath: '/assets/images/background/',
    geometryPath: '/assets/images/geometry/'
  },

  // Default colors
  colors: {
    fallbackAccent: '#d12e2e',
    text: '#ffffff',
    border: '#ffffff',
    background: '#000000'
  }
};