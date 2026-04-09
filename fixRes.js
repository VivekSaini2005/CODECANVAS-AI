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

    // 1. px-6 -> px-3 sm:px-4 md:px-6
    if (content.includes('px-6')) {
      content = content.replace(/\bpx-6\b/g, 'px-3 sm:px-4 md:px-6');
      changed = true;
    }
    // 2. py-6 -> py-3 sm:py-4 md:py-6
    if (content.includes('py-6')) {
      content = content.replace(/\bpy-6\b/g, 'py-3 sm:py-4 md:py-6');
      changed = true;
    }
    // 3. gap-6 -> gap-3 sm:gap-4 md:gap-6
    if (content.includes('gap-6')) {
      content = content.replace(/\bgap-6\b/g, 'gap-3 sm:gap-4 md:gap-6');
      changed = true;
    }
    // 4. w-[400px], w-[600px] -> w-full max-w-[...]
    if (content.includes('w-[400px]')) {
      content = content.replace(/w-\[400px\]/g, 'w-full max-w-[400px]');
      changed = true;
    }
    if (content.includes('w-[600px]')) {
      content = content.replace(/w-\[600px\]/g, 'w-full max-w-[600px]');
      changed = true;
    }
    
    // 5. text scaling
    if (content.includes('text-base')) {
      content = content.replace(/\btext-base\b/g, 'text-sm sm:text-base md:text-lg');
      changed = true;
    }

    // 6. Tables overflow handling
    if (content.includes('<table') && !content.includes('overflow-x-auto') && !content.includes('ProblemTable')) {
        content = content.replace(/<table/g, '<div className="w-full overflow-x-auto"><table');
        content = content.replace(/<\/table>/g, '</table></div>');
        changed = true;
    }
    
    // ProblemTable.jsx might already have specific DOM. 
    // We check if it is ProblemTable.
    if (filePath.includes('ProblemTable') && content.includes('<table') && !content.includes('<div className="w-full overflow-x-auto">')) {
        content = content.replace('<table', '<div className="w-full overflow-x-auto"><table');
        content = content.replace('</table>', '</table></div>');
        changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Modified', filePath);
    }
  }
});