#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT = __dirname;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // API endpoint for listing images
  if (req.url === '/api/images') {
    const bgGeoDir = path.join(ROOT, 'assets/images/bg-geo');
    const profileDir = path.join(ROOT, 'assets/images/profile');
    
    try {
      // Get images from bg-geo folder
      const bgGeoImages = fs.existsSync(bgGeoDir) ? 
        fs.readdirSync(bgGeoDir)
          .filter(file => /\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/i.test(file))
          .sort() : [];
      
      // Get images from profile folder
      const profileImages = fs.existsSync(profileDir) ? 
        fs.readdirSync(profileDir)
          .filter(file => /\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/i.test(file))
          .sort() : [];
      
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      });
      
      res.end(JSON.stringify({
        bgGeo: bgGeoImages,
        profile: profileImages,
        // For backwards compatibility
        background: bgGeoImages,
        geometry: bgGeoImages
      }));
      return;
    } catch (error) {
      res.writeHead(500);
      res.end('Error reading directories');
      return;
    }
  }
  
  let filePath = path.join(ROOT, req.url === '/' ? '/index.html' : req.url);
  
  // Security check
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    
    const ext = path.extname(filePath);
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    
    // NO CACHE HEADERS - EVER (ESPECIALLY FOR IMAGES)
    const headers = {
      'Content-Type': mimeType,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Timestamp': Date.now().toString(),
      'Last-Modified': new Date().toUTCString(),
      'ETag': `"${Date.now()}-${Math.random()}"`
    };
    
    // Extra headers for images to force reload
    if (/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/i.test(filePath)) {
      headers['X-Image-Refresh'] = 'force';
      console.log(`Serving ${req.url} with NO CACHE`);
    }
    
    res.writeHead(200, headers);
    
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 Development server running at http://localhost:${PORT}`);
  console.log('📌 NO CACHING - All files served fresh\n');
});

process.on('SIGINT', () => {
  console.log('\n✋ Server stopped');
  process.exit(0);
});