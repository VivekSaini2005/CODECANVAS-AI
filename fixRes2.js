const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir('./frontend/src', function(filePath) {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    if (content.includes('gap-8')) {
      content = content.replace(/\bgap-8\b/g, 'gap-4 sm:gap-6 md:gap-8');
      changed = true;
    }
    
    if (content.includes('p-6')) {
      content = content.replace(/\bp-6\b/g, 'p-3 sm:p-4 md:p-6');
      changed = true;
    }
    
    if (content.includes('p-8')) {
      content = content.replace(/\bp-8\b/g, 'p-4 sm:p-6 md:p-8');
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Modified more', filePath);
    }
  }
});