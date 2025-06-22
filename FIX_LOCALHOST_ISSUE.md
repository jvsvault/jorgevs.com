# Fix for Localhost Background Issue

## Problem Summary

The production site (jorgevs.com) works perfectly but localhost:8080 shows only a black background with no styling applied.

## Root Cause

1. **MIME Type Issue**: The dev server was serving uppercase `.JPG` files with `Content-Type: application/octet-stream` instead of `image/jpeg`, causing browsers to not recognize them as images.

2. **Aggressive Error Handling**: The randomizer's error handler sets the background to 'none' if ANY image fails to load, which was happening due to the MIME type issue.

## Solution

### 1. Fix Dev Server (COMPLETED)

Updated `dev-server.js` to handle uppercase file extensions:

```javascript
const mimeTypes = {
  // ... other types ...
  '.jpg': 'image/jpeg',
  '.JPG': 'image/jpeg',  // Added uppercase
  '.jpeg': 'image/jpeg',
  '.JPEG': 'image/jpeg', // Added uppercase
  // ... other types ...
};
```

### 2. Restart Dev Server

Kill the current server and restart it:

```bash
# Find and kill the process on port 8080
lsof -ti:8080 | xargs kill -9

# Restart the server
node dev-server.js
```

### 3. Optional: Use Fixed Randomizer

If issues persist, use the improved randomizer (`randomizer-fixed.js`) which:
- Tests each image before setting it as background
- Uses a gradient fallback instead of 'none'
- Provides better error handling

To use it, update `main.js`:
```javascript
import randomizer from './randomizer-fixed.js'; // instead of './randomizer.js'
```

## Testing

1. Visit http://localhost:8080
2. The background should now load correctly
3. Check browser console for any errors

## Debug Pages Created

- `/debug-localhost.html` - Comprehensive diagnostics
- `/test-background.html` - Background testing
- `/test-api-fetch.html` - API endpoint testing
- `/test-image-fallback.html` - Image loading tests
- `/diagnose-final.html` - Final diagnosis tool

## Why Production Works

GitHub Pages serves all files statically with correct MIME types regardless of file extension case, while the local dev server was case-sensitive for MIME type mapping.