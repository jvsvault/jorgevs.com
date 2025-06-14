# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Claude behavior

- Claude have permission to perform any type of action to build the tool with the exception of commands delete files or folders, or the ones related to Git.

## Project Overview

This is Jorge Viñals' portfolio website - a minimalist single-page application with dynamic geometric decorations and randomized visual elements. The site uses vanilla JavaScript with ES6 modules, CSS3 with custom properties, and requires no build process.

## Development Commands

### Running the Development Server
```bash
node dev-server.js
```
The server runs on port 8080 with aggressive no-cache headers. It includes an `/api/images` endpoint that dynamically lists available background and geometry images.

### Testing Changes
Since there's no build process:
1. Edit files directly
2. Hard refresh browser (Cmd+Shift+R on Mac) to bypass cache
3. Check browser console for randomizer logs

## Architecture & Critical Implementation Details

### Visual Randomization System
The site's core feature is the randomization of backgrounds, textures, and colors:
- **Background images**: Located in `/assets/images/background/`
- **Geometry textures**: Located in `/assets/images/geometry/`
- **Color extraction**: Pulls dominant color from geometry images for accent colors
- **Default fallback**: Grey (#808080) for shapes, black background

### Z-Index Hierarchy (CRITICAL)
Proper layering is essential - many bugs stem from incorrect z-index:
1. Background image: z-index: 0
2. Geometric decorations: z-index: 1
3. Container & content: z-index: 10
4. Text & images: z-index: 10+

### Key Files to Understand

1. **`assets/js/randomizer.js`**: Controls all visual randomization
   - Loads images dynamically via API or falls back to hardcoded list
   - Sets CSS custom properties for backgrounds and textures
   - Handles shape dimensions and animations
   - Extracts colors from geometry images

2. **`assets/js/content-manager.js`**: SPA navigation system
   - Manages content switching without page reloads
   - Triggers re-randomization of h2 elements on content change

3. **`assets/css/main-v2.css`**: All styling with CSS variables
   - Uses CSS custom properties set by JavaScript
   - Responsive breakpoints at 768px and 1024px
   - Grid layout for header section must maintain equal squares

4. **`dev-server.js`**: Development server with caching fixes
   - Provides `/api/images` endpoint for dynamic image loading
   - Forces no-cache headers to prevent stale content

### Common Issues & Solutions

1. **Caching Problems**: 
   - Update version query strings in index.html for CSS/JS files
   - Use hard refresh or incognito mode
   - Server has aggressive no-cache headers

2. **Layout Alignment**:
   - Header grid uses `justify-content: space-between` with `width: 100%`
   - Metadata and image sections use `calc(50% - 0.5rem)` for equal sizing
   - Mobile stacks vertically with fixed 200px squares

3. **Background Not Showing**:
   - Check if images exist in `/assets/images/background/`
   - Verify image extensions match (.jpg, .jpeg, .png, .gif)
   - Check browser console for 404 errors

4. **Shape Overlapping**:
   - Profile decoration must have lower z-index than image
   - Title decoration uses z-index: -2 relative to h1
   - All decorations should be behind text/images

### Testing Checklist
When making visual changes, always verify:
- [ ] Desktop layout (metadata and image aligned with content)
- [ ] Mobile layout (proper stacking, no overlaps)
- [ ] Background images load and randomize
- [ ] Geometry textures apply to all decorations
- [ ] Colors extract properly from geometry images
- [ ] Z-index hierarchy maintained (background → shapes → content)
- [ ] Navigation between sections maintains randomization