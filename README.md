# Jorge Viñals Website

A minimalist, single-page application showcasing the work of composer Jorge Viñals. The site features dynamic geometric decorations, randomized visual elements, and a clean, modern design.

## Architecture

### Technologies
- Vanilla JavaScript (ES6 modules)
- CSS3 with custom properties
- HTML5
- No external dependencies or frameworks

### Key Features
- **Dynamic Decorations**: Randomized geometric shapes with color variations
- **Text Rotation**: Rotating metadata content with configurable intervals
- **Responsive Design**: Mobile-first approach with equal-square grid layout
- **Performance**: Lazy loading, cache control, and optimized assets
- **Clean Code**: Modular architecture with separation of concerns

### Project Structure
```
jorgevs.com/
├── index.html              # Single HTML file (SPA)
├── assets/
│   ├── css/
│   │   └── main.css       # All styles with CSS custom properties
│   ├── js/
│   │   ├── main.js        # Main controller
│   │   ├── randomizer.js  # Visual randomization system
│   │   ├── content-manager.js # SPA content management
│   │   ├── metadata-rotator.js # Text rotation system
│   │   ├── config/
│   │   │   ├── rotations.js    # Rotation content configuration
│   │   │   └── site-config.js  # Site-wide settings
│   │   └── utils/
│   │       ├── color-utils.js  # Color manipulation utilities
│   │       └── shape-utils.js  # Shape generation utilities
│   └── images/            # Background and geometry textures
└── .htaccess             # Cache control headers
```

### Design Principles
1. **Separation of Concerns**: CSS handles presentation, JS handles logic
2. **Configuration over Code**: Easy to modify settings without touching core logic
3. **Progressive Enhancement**: Site works without JavaScript (static view)
4. **Accessibility**: Semantic HTML, proper contrast ratios
5. **Performance First**: Minimal dependencies, optimized assets

### Customization

#### Adding New Rotation Content
Edit `assets/js/config/rotations.js` to add new rotating text items.

#### Changing Visual Elements
- Background images: Add to `/assets/images/background/`
- Geometry textures: Add to `/assets/images/geometry/`
- Update image arrays in `randomizer.js`

#### Modifying Decorations
Edit dimension constraints in `assets/js/config/site-config.js`

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6 module support required
- CSS Grid and Custom Properties support required

### Development
No build process required. Edit files directly and refresh browser.

### Deployment
Upload all files to web server. Ensure `.htaccess` is processed for proper caching.

## License
© 2025 Jorge Viñals - All rights reserved