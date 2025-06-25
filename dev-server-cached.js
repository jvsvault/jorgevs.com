const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;
const ROOT = __dirname;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(url.parse(req.url).pathname);
  
  console.log(`${new Date().toISOString()} - ${req.method} ${pathname}`);
  
  // API endpoint for listing images
  if (pathname === '/api/images') {
    try {
      const bgGeoPath = path.join(ROOT, 'assets/images/bg-geo');
      const profilePath = path.join(ROOT, 'assets/images/profile');
      
      const bgGeoImages = fs.readdirSync(bgGeoPath)
        .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
      
      const profileImages = fs.readdirSync(profilePath)
        .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
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
  
  let filePath = path.join(ROOT, pathname === '/' ? '/index.html' : pathname);
  
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
    
    // Different cache strategies based on file type
    let headers = {
      'Content-Type': mimeType,
      'X-Content-Type-Options': 'nosniff'
    };
    
    // Images get cached for better performance
    if (['.jpg', '.jpeg', '.png', '.gif', '.svg'].includes(ext)) {
      headers['Cache-Control'] = 'public, max-age=3600'; // 1 hour cache
      headers['ETag'] = `"${Date.now()}"`;
      console.log(`Serving ${pathname} with CACHE`);
    } else {
      // Everything else - no cache
      headers['Cache-Control'] = 'no-store, no-cache, must-revalidate';
      headers['Pragma'] = 'no-cache';
      headers['Expires'] = '0';
      console.log(`Serving ${pathname} with NO CACHE`);
    }
    
    res.writeHead(200, headers);
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`
🚀 Development server running at http://localhost:${PORT}
📌 Images are CACHED for performance
📌 Other files served fresh
  `);
});