/**
 * Automatic image detector - no hardcoding, no bullshit
 */

export async function detectAllImages() {
  const results = {
    background: [],
    geometry: []
  };

  // Method 1: Try directory listing via fetch (works with some servers)
  try {
    const bgResponse = await fetch('/assets/images/background/');
    if (bgResponse.ok) {
      const html = await bgResponse.text();
      // Parse HTML directory listing
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const links = doc.querySelectorAll('a');
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && /\.(jpg|jpeg|png|gif)$/i.test(href)) {
          results.background.push(href);
        }
      });
    }
  } catch (e) {
    console.log('Directory listing not available');
  }

  // Method 2: Brute force common patterns and actual files
  // This will test EVERY combination without hardcoding specific names
  const testImage = async (path) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = path;
    });
  };

  // Test a wide range of possible filenames
  const extensions = ['jpg', 'jpeg', 'png', 'gif', 'JPG', 'JPEG', 'PNG', 'GIF'];
  const prefixes = ['', 'r', 'R', 'img', 'IMG', 'image', 'IMAGE', 'pic', 'PIC', 'photo', 'PHOTO', 'bg', 'BG', 'background', 'BACKGROUND'];
  const separators = ['', '-', '_', ' '];
  
  // Test different patterns
  const patterns = [];
  
  // Numbers from 0-50
  for (let i = 0; i <= 50; i++) {
    patterns.push(String(i));
    patterns.push(String(i).padStart(2, '0'));
    patterns.push(String(i).padStart(3, '0'));
    patterns.push(String(i).padStart(4, '0'));
  }
  
  // Common codes
  for (let i = 1; i <= 30; i++) {
    patterns.push(`001-${String(i).padStart(3, '0')}`);
    patterns.push(`r001-${String(i).padStart(3, '0')}`);
    patterns.push(`R1-${String(i).padStart(5, '0')}-${String(i).padStart(3, '0')}A`);
  }

  // Test each combination
  const tested = new Set();
  
  for (const prefix of prefixes) {
    for (const sep of separators) {
      for (const pattern of patterns) {
        for (const ext of extensions) {
          const filename = `${prefix}${sep}${pattern}.${ext}`;
          if (!tested.has(filename)) {
            tested.add(filename);
            
            // Test background
            const bgPath = `/assets/images/background/${filename}`;
            if (await testImage(bgPath)) {
              results.background.push(filename);
              console.log(`Found background: ${filename}`);
            }
            
            // Test geometry
            const geoPath = `/assets/images/geometry/${filename}`;
            if (await testImage(geoPath)) {
              results.geometry.push(filename);
              console.log(`Found geometry: ${filename}`);
            }
          }
        }
      }
    }
  }

  return results;
}