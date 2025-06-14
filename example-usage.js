// Example of how to use the read_directory command from the frontend

// Basic usage - read a directory without showing hidden files
async function readDirectory(path) {
  try {
    const files = await window.__TAURI__.core.invoke('read_directory', {
      path: path
    });
    console.log('Directory contents:', files);
    return files;
  } catch (error) {
    console.error('Error reading directory:', error);
    throw error;
  }
}

// Advanced usage - with options
async function readDirectoryWithOptions(path, showHidden = false) {
  try {
    const files = await window.__TAURI__.core.invoke('read_directory', {
      path: path,
      options: {
        show_hidden: showHidden
      }
    });
    console.log('Directory contents:', files);
    return files;
  } catch (error) {
    console.error('Error reading directory:', error);
    throw error;
  }
}

// Example usage
async function exampleUsage() {
  // Read home directory
  const homeFiles = await readDirectory('/Users/jorgevs');
  
  // Read directory with hidden files
  const allFiles = await readDirectoryWithOptions('/Users/jorgevs', true);
  
  // Display files in a simple list
  const fileList = document.getElementById('file-list');
  if (fileList) {
    fileList.innerHTML = allFiles.map(file => {
      const icon = file.is_dir ? '📁' : '📄';
      const size = file.is_dir ? '' : ` (${formatBytes(file.size)})`;
      const date = new Date(file.modified * 1000).toLocaleDateString();
      return `<div>${icon} ${file.name}${size} - ${date}</div>`;
    }).join('');
  }
}

// Helper function to format bytes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}