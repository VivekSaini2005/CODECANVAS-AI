const fs = require('fs');
let file = fs.readFileSync('src/pages/ProblemWorkspace.jsx', 'utf8');

file = file.replace(
  '<div ref={containerRef} className="flex flex-1 overflow-hidden select-none">',
  '<div ref={containerRef} className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden select-none">'
);

if (file.includes('className="border-r border-gray-800 bg-[#0F172A] flex flex-col overflow-hidden" style={{ width: \\%\ }}')) {
  file = file.replace(
    'className="border-r border-gray-800 bg-[#0F172A] flex flex-col overflow-hidden" style={{ width: \\%\ }}',
    'className="w-full lg:w-auto h-[60vh] lg:h-full shrink-0 border-b lg:border-b-0 lg:border-r border-gray-800 bg-[#0F172A] flex flex-col overflow-hidden" style={{ width: typeof window !== \\'undefined\\' && window.innerWidth >= 1024 ? \\%\ : undefined }}'
  );
}

file = file.replace(
  '<div\n          className="w-1.5 flex-shrink-0 bg-gray-800 hover:bg-indigo-500/70 active:bg-indigo-500 cursor-col-resize transition-colors duration-150 flex items-center justify-center group"\n          onMouseDown={handleMouseDown}\n        >',
  '<div\n          className="hidden lg:flex w-1.5 flex-shrink-0 bg-gray-800 hover:bg-indigo-500/70 active:bg-indigo-500 cursor-col-resize transition-colors duration-150 items-center justify-center group"\n          onMouseDown={handleMouseDown}\n        >'
);

file = file.replace(
  '<div className="bg-[#020617] flex-1 overflow-hidden">',
  '<div className="bg-[#020617] flex-1 overflow-hidden min-h-[500px] lg:min-h-0">'
);

fs.writeFileSync('src/pages/ProblemWorkspace.jsx', file);
console.log('ProblemWorkspace updated');
